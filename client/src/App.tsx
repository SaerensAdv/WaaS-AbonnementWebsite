import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { PageLoader } from "@/components/page-loader";
import NotFound from "@/pages/not-found";

import HomePage from "@/pages/home";
import PricingPage from "@/pages/pricing";
import AboutPage from "@/pages/about";
import TemplatesPage from "@/pages/templates";
import ProjectenPage from "@/pages/projecten";
import ContactPage from "@/pages/contact";
import SpecialistsPage from "@/pages/specialists";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import CookiesPage from "@/pages/cookies";
import LoginPage from "@/pages/auth/login";
import SignupPage from "@/pages/auth/signup";
import ForgotPasswordPage from "@/pages/auth/forgot-password";
import ResetPasswordPage from "@/pages/auth/reset-password";
import CheckoutSuccessPage from "@/pages/checkout-success";

import CustomerDashboard from "@/pages/dashboard/customer-dashboard";
import ProjectPage from "@/pages/dashboard/project";
import AddOnsPage from "@/pages/dashboard/addons";
import ReportsPage from "@/pages/dashboard/reports";
import BillingPage from "@/pages/dashboard/billing";

import AdminDashboard from "@/pages/admin/admin-dashboard";
import AdminCustomersPage from "@/pages/admin/customers";
import AdminProjectsPage from "@/pages/admin/projects";
import AdminSpecialistsPage from "@/pages/admin/specialists";
import AdminAssignmentsPage from "@/pages/admin/assignments";

import SpecialistDashboard from "@/pages/specialist/specialist-dashboard";
import SpecialistAssignmentsPage from "@/pages/specialist/assignments";
import SpecialistReportsPage from "@/pages/specialist/reports";
import SpecialistProfilePage from "@/pages/specialist/profile";

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
    } else if (user.role === "SPECIALIST") {
      return <Redirect to="/specialist" />;
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
      <Route path="/pricing" component={PricingPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/templates" component={TemplatesPage} />
      <Route path="/projecten" component={ProjectenPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/specialists" component={SpecialistsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/cookies" component={CookiesPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/forgot-password" component={ForgotPasswordPage} />
      <Route path="/reset-password" component={ResetPasswordPage} />
      <Route path="/checkout-success" component={CheckoutSuccessPage} />

      <Route path="/app">
        <ProtectedRoute component={CustomerDashboard} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/project">
        <ProtectedRoute component={ProjectPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/addons">
        <ProtectedRoute component={AddOnsPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/reports">
        <ProtectedRoute component={ReportsPage} roles={["CUSTOMER"]} />
      </Route>
      <Route path="/app/billing">
        <ProtectedRoute component={BillingPage} roles={["CUSTOMER"]} />
      </Route>

      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} roles={["ADMIN"]} />
      </Route>
      <Route path="/admin/customers">
        <ProtectedRoute component={AdminCustomersPage} roles={["ADMIN"]} />
      </Route>
      <Route path="/admin/projects">
        <ProtectedRoute component={AdminProjectsPage} roles={["ADMIN"]} />
      </Route>
      <Route path="/admin/specialists">
        <ProtectedRoute component={AdminSpecialistsPage} roles={["ADMIN"]} />
      </Route>
      <Route path="/admin/assignments">
        <ProtectedRoute component={AdminAssignmentsPage} roles={["ADMIN"]} />
      </Route>

      <Route path="/specialist">
        <ProtectedRoute component={SpecialistDashboard} roles={["SPECIALIST"]} />
      </Route>
      <Route path="/specialist/assignments">
        <ProtectedRoute component={SpecialistAssignmentsPage} roles={["SPECIALIST"]} />
      </Route>
      <Route path="/specialist/reports">
        <ProtectedRoute component={SpecialistReportsPage} roles={["SPECIALIST"]} />
      </Route>
      <Route path="/specialist/profile">
        <ProtectedRoute component={SpecialistProfilePage} roles={["SPECIALIST"]} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="website-abonnementen-theme">
        <TooltipProvider>
          <AuthProvider>
            <PageLoader />
            <Router />
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
