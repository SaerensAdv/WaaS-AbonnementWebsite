import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from "./stripeClient";
import { WebhookHandlers } from "./webhookHandlers";
import path from "path";
import { pool } from "./db";

const app = express();

app.use('/assets', express.static(path.resolve(process.cwd(), 'attached_assets')));
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

async function runSchemaCleanup() {
  const client = await pool.connect();
  try {
    const migrationCheck = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = '_schema_migrations') as exists`
    );
    if (!migrationCheck.rows[0].exists) {
      await client.query(`CREATE TABLE _schema_migrations (id TEXT PRIMARY KEY, applied_at TIMESTAMP DEFAULT NOW())`);
    }
    const alreadyRan = await client.query(
      `SELECT 1 FROM _schema_migrations WHERE id = 'cleanup_orphaned_v2'`
    );
    if (alreadyRan.rows.length > 0) {
      log('Schema cleanup already applied, skipping', 'migration');
      return;
    }

    log('Running schema cleanup...', 'migration');
    await client.query('BEGIN');

    const fksToRemove = [
      { table: 'projects', constraint: 'projects_template_id_templates_id_fk' },
      { table: 'add_on_selections', constraint: 'add_on_selections_project_id_projects_id_fk' },
      { table: 'assignments', constraint: 'assignments_add_on_selection_id_add_on_selections_id_fk' },
      { table: 'assignments', constraint: 'assignments_specialist_user_id_users_id_fk' },
      { table: 'audit_logs', constraint: 'audit_logs_actor_user_id_users_id_fk' },
      { table: 'blog_posts', constraint: 'blog_posts_author_id_users_id_fk' },
      { table: 'reports', constraint: 'reports_created_by_user_id_users_id_fk' },
      { table: 'reports', constraint: 'reports_project_id_projects_id_fk' },
      { table: 'specialist_profiles', constraint: 'specialist_profiles_user_id_users_id_fk' },
    ];
    for (const { table, constraint } of fksToRemove) {
      await client.query(`ALTER TABLE IF EXISTS "${table}" DROP CONSTRAINT IF EXISTS "${constraint}"`);
    }

    const orphanedTables = [
      'assignments', 'audit_logs', 'blog_posts', 'reports',
      'specialist_profiles', 'system_config', 'templates'
    ];
    for (const table of orphanedTables) {
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE`);
    }

    const projectExtraCols = [
      'template_id', 'public_url', 'showcase_opt_in', 'showcase_thumbnail_url',
      'showcase_title', 'showcase_description', 'showcase_industry',
      'showcase_featured', 'launched_at'
    ];
    for (const col of projectExtraCols) {
      await client.query(`ALTER TABLE projects DROP COLUMN IF EXISTS "${col}"`);
    }
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "company_name" text`);
    await client.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "onboarding_completed" boolean DEFAULT false`);

    const plansExtraCols = ['included_templates_min', 'included_templates_max', 'included_credits', 'sla_text'];
    for (const col of plansExtraCols) {
      await client.query(`ALTER TABLE plans DROP COLUMN IF EXISTS "${col}"`);
    }

    await client.query(`ALTER TABLE add_on_selections DROP COLUMN IF EXISTS "project_id"`);

    await client.query(`ALTER TABLE users ALTER COLUMN role TYPE text`);
    await client.query(`UPDATE users SET role = 'CUSTOMER' WHERE role NOT IN ('ADMIN', 'CUSTOMER')`);

    await client.query(`ALTER TABLE subscriptions ALTER COLUMN status TYPE text`);
    await client.query(`UPDATE subscriptions SET status = 'ACTIVE' WHERE status IN ('active', 'trialing')`);
    await client.query(`UPDATE subscriptions SET status = 'PAST_DUE' WHERE status IN ('past_due', 'unpaid')`);
    await client.query(`UPDATE subscriptions SET status = 'CANCELED' WHERE status IN ('canceled', 'incomplete_expired', 'paused')`);
    await client.query(`UPDATE subscriptions SET status = 'INCOMPLETE' WHERE status IN ('incomplete')`);

    const orphanedEnums = [
      'assignment_status', 'blog_status', 'showcase_opt_in'
    ];
    for (const enumType of orphanedEnums) {
      await client.query(`DROP TYPE IF EXISTS "${enumType}" CASCADE`);
    }

    const enumCleanups = [
      { name: 'user_role', validValues: ['ADMIN', 'CUSTOMER'], column: 'role', table: 'users' },
      { name: 'subscription_status', validValues: ['ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE'], column: 'status', table: 'subscriptions' }
    ];

    for (const { name, validValues, column, table } of enumCleanups) {
      await client.query(`DROP TYPE IF EXISTS "${name}" CASCADE`);
      const valuesStr = validValues.map(v => `'${v}'`).join(', ');
      await client.query(`CREATE TYPE "${name}" AS ENUM (${valuesStr})`);
      await client.query(`ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE "${name}" USING "${column}"::"${name}"`);
    }

    await client.query(`DELETE FROM _schema_migrations WHERE id = 'cleanup_orphaned_v1'`);
    await client.query(`INSERT INTO _schema_migrations (id) VALUES ('cleanup_orphaned_v2')`);
    await client.query('COMMIT');
    log('Schema cleanup completed', 'migration');
  } catch (error: any) {
    await client.query('ROLLBACK').catch(() => {});
    log(`Schema cleanup failed, rolled back: ${error.message}`, 'migration');
    throw error;
  } finally {
    client.release();
  }
}

async function ensureQuoteRequestsTable() {
  const client = await pool.connect();
  try {
    const tableExists = await client.query(
      `SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'quote_requests') as exists`
    );
    if (!tableExists.rows[0].exists) {
      log('Creating quote_requests table...', 'migration');
      await client.query(`
        DO $$ BEGIN
          CREATE TYPE quote_request_status AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'DECLINED');
        EXCEPTION WHEN duplicate_object THEN null; END $$;
        CREATE TABLE IF NOT EXISTS quote_requests (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          company_name TEXT NOT NULL,
          contact_name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT,
          project_type TEXT NOT NULL,
          budget_range TEXT,
          description TEXT NOT NULL,
          current_website TEXT,
          details JSONB,
          status quote_request_status DEFAULT 'NEW',
          clickup_task_id TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        );
      `);
      log('quote_requests table created', 'migration');
    } else {
      const detailsCheck = await client.query(
        `SELECT 1 FROM information_schema.columns WHERE table_name = 'quote_requests' AND column_name = 'details'`
      );
      if (detailsCheck.rows.length === 0) {
        await client.query(`ALTER TABLE quote_requests ADD COLUMN details JSONB`);
        log('Added details column to quote_requests', 'migration');
      }
    }
  } finally {
    client.release();
  }
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    log('DATABASE_URL not set, skipping Stripe initialization', 'stripe');
    return null;
  }

  try {
    log('Initializing Stripe schema...', 'stripe');
    try {
      await runMigrations({ 
        databaseUrl
      } as any);
      log('Stripe schema ready', 'stripe');
    } catch (migrationError: any) {
      if (migrationError.message?.includes('already exists')) {
        log('Stripe schema already up to date', 'stripe');
      } else {
        throw migrationError;
      }
    }

    const stripeSync = await getStripeSync();

    log('Setting up managed webhook...', 'stripe');
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    
    try {
      const { webhook, uuid } = await stripeSync.findOrCreateManagedWebhook(
        `${webhookBaseUrl}/api/stripe/webhook`,
        {
          enabled_events: ['*'],
          description: 'Managed webhook for Stripe sync',
        }
      );
      log(`Webhook configured: ${webhook.url}`, 'stripe');

      stripeSync.syncBackfill()
        .then(() => {
          log('Stripe data synced', 'stripe');
        })
        .catch((err: Error) => {
          log(`Error syncing Stripe data: ${err.message}`, 'stripe');
        });

      return uuid;
    } catch (webhookError: any) {
      log(`Webhook setup skipped: ${webhookError.message}`, 'stripe');
      return null;
    }
  } catch (error: any) {
    log(`Failed to initialize Stripe: ${error.message}`, 'stripe');
    return null;
  }
}

(async () => {
  await runSchemaCleanup();
  await ensureQuoteRequestsTable();

  let stripeWebhookUuid: string | null = null;
  
  try {
    stripeWebhookUuid = await initStripe();
  } catch (error: any) {
    log(`Stripe initialization failed: ${error.message}`, 'stripe');
  }

  app.post(
    '/api/stripe/webhook/:uuid',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const signature = req.headers['stripe-signature'];

      if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature' });
      }

      try {
        const sig = Array.isArray(signature) ? signature[0] : signature;

        if (!Buffer.isBuffer(req.body)) {
          log('STRIPE WEBHOOK ERROR: req.body is not a Buffer', 'stripe');
          return res.status(500).json({ error: 'Webhook processing error' });
        }

        const { uuid } = req.params;
        await WebhookHandlers.processWebhook(req.body as Buffer, sig, uuid);

        res.status(200).json({ received: true });
      } catch (error: any) {
        log(`Webhook error: ${error.message}`, 'stripe');
        res.status(400).json({ error: 'Webhook processing error' });
      }
    }
  );

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port}`);
    },
  );
})();
