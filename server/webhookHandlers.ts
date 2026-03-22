import { getStripeSync, getUncachableStripeClient } from './stripeClient';
import { storage } from './storage';
import { log } from './index';
import Stripe from 'stripe';
import { createKlantTask, isClickUpConfigured } from './clickup';

export class WebhookHandlers {
  static async processWebhook(payload: Buffer, signature: string, uuid: string): Promise<void> {
    if (!Buffer.isBuffer(payload)) {
      throw new Error(
        'STRIPE WEBHOOK ERROR: Payload must be a Buffer. ' +
        'Received type: ' + typeof payload + '. ' +
        'This usually means express.json() parsed the body before reaching this handler. ' +
        'FIX: Ensure webhook route is registered BEFORE app.use(express.json()).'
      );
    }

    const sync = await getStripeSync();
    await sync.processWebhook(payload, signature, uuid);

    try {
      const event = JSON.parse(payload.toString()) as Stripe.Event;
      await WebhookHandlers.handleCustomEvents(event);
    } catch (error: any) {
      log(`Custom event handling error: ${error.message}`, 'stripe');
    }
  }

  static async handleCustomEvents(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'checkout.session.completed':
        await WebhookHandlers.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await WebhookHandlers.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await WebhookHandlers.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
    }
  }

  static async handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const userId = session.metadata?.userId;
    const planId = session.metadata?.planId;
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;

    if (!userId || !planId) {
      log('Checkout session missing userId or planId metadata', 'stripe');
      return;
    }

    log(`Processing checkout for user ${userId}, plan ${planId}`, 'stripe');

    try {
      const existingSubscription = await storage.getSubscription(userId);
      
      if (existingSubscription) {
        await storage.updateSubscription(existingSubscription.id, {
          planId,
          stripeCustomerId,
          stripeSubscriptionId,
          status: 'ACTIVE',
        });
        log(`Updated subscription for user ${userId}`, 'stripe');
      } else {
        await storage.createSubscription({
          userId,
          planId,
          stripeCustomerId,
          stripeSubscriptionId,
          status: 'ACTIVE',
        });
        log(`Created subscription for user ${userId}`, 'stripe');
      }

      const existingProject = await storage.getProject(userId);
      
      if (!existingProject) {
        await storage.createProject({
          userId,
          planId,
          status: 'ONBOARDING',
        });
        log(`Created project for user ${userId}`, 'stripe');
      }

      if (isClickUpConfigured()) {
        try {
          const user = await storage.getUser(userId);
          const plan = await storage.getPlan(planId);
          const profile = await storage.getCustomerProfile(userId);
          if (user && plan) {
            await createKlantTask(
              user.name,
              user.email,
              plan.name,
              profile?.companyName || undefined,
            );
            log(`Created ClickUp klant task for ${user.email}`, 'stripe');
          }
        } catch (clickupError: any) {
          log(`ClickUp klant task error (non-blocking): ${clickupError.message}`, 'stripe');
        }
      }
    } catch (error: any) {
      log(`Error processing checkout: ${error.message}`, 'stripe');
    }
  }

  static async handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
    const stripeSubscriptionId = subscription.id;
    const status = WebhookHandlers.mapStripeStatus(subscription.status);

    try {
      const existingSub = await storage.getSubscriptionByStripeId(stripeSubscriptionId);
      
      if (!existingSub) {
        log(`No subscription found for Stripe ID ${stripeSubscriptionId}`, 'stripe');
        return;
      }

      const stripe = await getUncachableStripeClient();
      const liveSubscription = await stripe.subscriptions.retrieve(stripeSubscriptionId, {
        expand: ['items.data.price'],
      });

      const updateData: { status: 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE'; planId?: string } = { 
        status: WebhookHandlers.mapStripeStatus(liveSubscription.status) 
      };

      const items = liveSubscription.items?.data || [];
      let foundPlan = null;

      for (const item of items) {
        const priceId = typeof item.price === 'string' ? item.price : item.price?.id;
        if (priceId) {
          const plan = await storage.getPlanByStripePriceId(priceId);
          if (plan && ['LOW', 'MEDIUM', 'HIGH'].includes(plan.tier)) {
            foundPlan = plan;
            log(`Found primary plan: ${plan.name} (${plan.tier}) for price ${priceId}`, 'stripe');
            break;
          }
        }
      }

      if (!foundPlan && items.length > 0) {
        log(`No primary plan found in ${items.length} subscription items for ${stripeSubscriptionId}`, 'stripe');
      }

      if (foundPlan && foundPlan.id !== existingSub.planId) {
        updateData.planId = foundPlan.id;
        log(`Updating plan from ${existingSub.planId} to ${foundPlan.id}`, 'stripe');
        
        const project = await storage.getProject(existingSub.userId);
        if (project) {
          await storage.updateProject(project.id, { planId: foundPlan.id });
          log(`Updated project planId to ${foundPlan.id}`, 'stripe');
        }
      }

      await storage.updateSubscription(existingSub.id, updateData);
      log(`Updated subscription ${stripeSubscriptionId} - status: ${updateData.status}`, 'stripe');
    } catch (error: any) {
      log(`Error updating subscription: ${error.message}`, 'stripe');
    }
  }

  static async handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
    const stripeSubscriptionId = subscription.id;

    try {
      const existingSub = await storage.getSubscriptionByStripeId(stripeSubscriptionId);
      
      if (!existingSub) {
        log(`No subscription found for Stripe ID ${stripeSubscriptionId} (deletion)`, 'stripe');
        return;
      }

      await storage.updateSubscription(existingSub.id, { status: 'CANCELED' });
      log(`Canceled subscription ${stripeSubscriptionId}`, 'stripe');
    } catch (error: any) {
      log(`Error canceling subscription: ${error.message}`, 'stripe');
    }
  }

  static mapStripeStatus(stripeStatus: Stripe.Subscription.Status): 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' {
    switch (stripeStatus) {
      case 'active':
      case 'trialing':
        return 'ACTIVE';
      case 'past_due':
        return 'PAST_DUE';
      case 'canceled':
      case 'unpaid':
        return 'CANCELED';
      default:
        return 'INCOMPLETE';
    }
  }
}
