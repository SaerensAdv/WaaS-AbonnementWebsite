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
import { lazy, Suspense, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { getSite, goToSite } from "@/lib/site";

// ---------- Eager: critical public marketing pages ----------
import HomePage from "@/pages/home";
import BetaalbareWebsitePage from "@/pages/betaalbare-website";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import ConsentEasePage from "@/pages/consentease";
import WerkwijzePage from "@/pages/werkwijze";

// ---------- Lazy: auth pages ----------
const LoginPage = lazy(() => import("@/pages/auth/login"));
const SignupPage = lazy(() => import("@/pages/auth/signup"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/forgot-password"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/reset-password"));

// ---------- Lazy: secondary public pages ----------
const CheckoutSuccessPage = lazy(() => import("@/pages/checkout-success"));
const OffertePage = lazy(() => import("@/pages/offerte"));
const BlogIndexPage = lazy(() => import("@/pages/blog"));
const BlogArticlePage = lazy(() => import("@/pages/blog/article"));

// ---------- Lazy: customer dashboard ----------
const CustomerDashboard = lazy(() => import("@/pages/dashboard/customer-dashboard"));
const OnboardingPage = lazy(() => import("@/pages/dashboard/onboarding"));
const AddOnsPage = lazy(() => import("@/pages/dashboard/addons"));
const AnalyticsPage = lazy(() => import("@/pages/dashboard/analytics"));
const BillingPage = lazy(() => import("@/pages/dashboard/billing"));
const SettingsPage = lazy(() => import("@/pages/dashboard/settings"));
const SupportPage = lazy(() => import("@/pages/dashboard/support"));
const ChangesPage = lazy(() => import("@/pages/dashboard/changes"));

// ---------- Lazy: admin ----------
const AdminDashboard = lazy(() => import("@/pages/admin/admin-dashboard"));
const AdminCustomersPage = lazy(() => import("@/pages/admin/customers"));
const AdminClickUpPage = lazy(() => import("@/pages/admin/clickup"));
const AdminChangesPage = lazy(() => import("@/pages/admin/changes"));
const AdminClientDetailPage = lazy(() => import("@/pages/admin/client-detail"));
const AdminQuotesPage = lazy(() => import("@/pages/admin/quotes"));

// ---------- Suspense fallback ----------
function LazyFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

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
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="auth-loader">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    // Verkeerde rol voor deze site → hard redirect naar de juiste site.
    goToSite(user.role === "ADMIN" ? "admin" : "app", "/");
    return <LazyFallback />;
  }

  return <Component />;
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/betaalbare-professionele-website" component={BetaalbareWebsitePage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/consentease" component={ConsentEasePage} />
      <Route path="/werkwijze" component={WerkwijzePage} />
      <Route path="/checkout-success" component={CheckoutSuccessPage} />
      <Route path="/offerte" component={OffertePage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/blog" component={BlogIndexPage} />
      <Route path="/blog/:slug" component={BlogArticlePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/">
        <ProtectedRoute component={CustomerDashboard} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/onboarding">
        <ProtectedRoute component={OnboardingPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/addons">
        <ProtectedRoute component={AddOnsPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/analytics">
        <ProtectedRoute component={AnalyticsPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/billing">
        <ProtectedRoute component={BillingPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/changes">
        <ProtectedRoute component={ChangesPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/support">
        <ProtectedRoute component={SupportPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={SettingsPage} roles={["CUSTOMER"]} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AdminRouter() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/">
        <ProtectedRoute component={AdminDashboard} roles={["ADMIN"]} />
      </Route>
      <Route path="/customers">
        <ProtectedRoute component={AdminCustomersPage} roles={["ADMIN"]} />
      </Route>
      <Route path="/changes">
        <ProtectedRoute component={AdminChangesPage} roles={["ADMIN"]} />
      </Route>
      <Route path="/clients/:id">
        <ProtectedRoute component={AdminClientDetailPage} roles={["ADMIN"]} />
      </Route>
      <Route path="/quotes">
        <ProtectedRoute component={AdminQuotesPage} roles={["ADMIN"]} />
      </Route>
      <Route path="/clickup">
        <ProtectedRoute component={AdminClickUpPage} roles={["ADMIN"]} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const site = getSite();
  return (
    <Suspense fallback={<LazyFallback />}>
      {site === "app" ? <AppRouter /> : site === "admin" ? <AdminRouter /> : <PublicRouter />}
    </Suspense>
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
