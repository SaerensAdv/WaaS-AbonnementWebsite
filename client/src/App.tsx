import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n-context";
import { PageLoader } from "@/components/page-loader";
import { ErrorBoundary } from "@/components/error-boundary";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location]);

  return null;
}

import HomePage from "@/pages/home";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import CheckoutSuccessPage from "@/pages/checkout-success";
import OffertePage from "@/pages/offerte";

import CustomerDashboard from "@/pages/dashboard/customer-dashboard";
import OnboardingPage from "@/pages/dashboard/onboarding";
import AddOnsPage from "@/pages/dashboard/addons";
import AnalyticsPage from "@/pages/dashboard/analytics";
import BillingPage from "@/pages/dashboard/billing";
import SettingsPage from "@/pages/dashboard/settings";

import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminCustomersPage from "@/pages/admin/customers";
import AdminClickUpPage from "@/pages/admin/clickup";
import SupportPage from "@/pages/dashboard/support";

import loaderGif from "@assets/Untitled_design-loader_icon_1764970117869.gif";

function ProtectedRoute({
  component: Component,
  roles,
}: {
  component: React.ComponentType;
  roles?: string[];
}) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <img src={loaderGif} alt="Loading..." className="h-20 w-20 object-contain" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === "ADMIN") {
      return <Redirect to="/admin" />;
    } else {
      return <Redirect to="/app" />;
    }
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/checkout-success" component={CheckoutSuccessPage} />
      <Route path="/offerte" component={OffertePage} />

      <Route path="/app">
        <ProtectedRoute component={CustomerDashboard} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/onboarding">
        <ProtectedRoute component={OnboardingPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/addons">
        <ProtectedRoute component={AddOnsPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/analytics">
        <ProtectedRoute component={AnalyticsPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/billing">
        <ProtectedRoute component={BillingPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/support">
        <ProtectedRoute component={SupportPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/settings">
        <ProtectedRoute component={SettingsPage} roles={["CUSTOMER"]} />
      </Route>

      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} roles={["ADMIN"]} />
      </Route>
      <Route path="/admin/customers">
        <ProtectedRoute component={AdminCustomersPage} roles={["ADMIN"]} />
      </Route>
      <Route path="/admin/clickup">
        <ProtectedRoute component={AdminClickUpPage} roles={["ADMIN"]} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="website-abonnementen-theme">
          <TooltipProvider>
            <I18nProvider>
              <AuthProvider>
                <ScrollToTop />
                <PageLoader />
                <Router />
                <Toaster />
              </AuthProvider>
            </I18nProvider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
