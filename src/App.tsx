import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import { Route, Switch, Router as WouterRouter, useLocation } from "wouter";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { HelmetProvider } from "react-helmet-async";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/lib/auth-context";
import RequireAdmin from "@/components/admin/RequireAdmin";
import { ADMIN_BASE, ADMIN_ROUTES } from "@/data/admin-constants";

// ── Lazy-loaded pages ────────────────────────────────────────────────────────
const HomePage      = lazy(() => import("@/pages/HomePage"));
const AboutPage     = lazy(() => import("@/pages/AboutPage"));
const ServicesPage  = lazy(() => import("@/pages/ServicesPage"));
const PortfolioPage = lazy(() => import("@/pages/PortfolioPage"));
const BlogPage      = lazy(() => import("@/pages/BlogPage"));
const BlogPostPage  = lazy(() => import("@/pages/BlogPostPage"));
const ContactPage   = lazy(() => import("@/pages/ContactPage"));
const ProcessPage   = lazy(() => import("@/pages/ProcessPage"));
const CareersPage   = lazy(() => import("@/pages/CareersPage"));
const PrivacyPage   = lazy(() => import("@/pages/PrivacyPage"));
const TermsPage     = lazy(() => import("@/pages/TermsPage"));
const NotFoundPage  = lazy(() => import("@/pages/NotFoundPage"));

// ── Lazy-loaded CMS pages (never bundled with the public site) ───────────────
const AdminLoginPage      = lazy(() => import("@/pages/admin/AdminLoginPage"));
const AdminDashboardPage  = lazy(() => import("@/pages/admin/AdminDashboardPage"));
const AdminPostsPage      = lazy(() => import("@/pages/admin/AdminPostsPage"));
const AdminPostEditorPage = lazy(() => import("@/pages/admin/AdminPostEditorPage"));
const AdminCategoriesPage = lazy(() => import("@/pages/admin/AdminCategoriesPage"));
const AdminProjectsPage   = lazy(() => import("@/pages/admin/AdminProjectsPage"));
const AdminReviewsPage    = lazy(() => import("@/pages/admin/AdminReviewsPage"));
const AdminMessagesPage   = lazy(() => import("@/pages/admin/AdminMessagesPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 1000 * 60 * 5 },
  },
});

// ── Skeleton loader shown while lazy chunks load ──────────────────────────────
function PageSkeleton() {
  return (
    <div className="min-h-[70vh] flex flex-col">
      {/* Hero skeleton */}
      <div className="flex-1 flex items-center justify-center py-32">
        <div className="flex flex-col items-center gap-4 w-full max-w-lg px-6">
          <div className="h-5 w-36 rounded-full bg-muted animate-pulse" />
          <div className="h-12 w-full rounded-xl bg-muted animate-pulse" />
          <div className="h-12 w-4/5 rounded-xl bg-muted animate-pulse" />
          <div className="h-5 w-2/3 rounded-full bg-muted/70 animate-pulse mt-2" />
          <div className="flex gap-3 mt-4 w-full justify-center">
            <div className="h-11 w-40 rounded-xl bg-muted animate-pulse" />
            <div className="h-11 w-40 rounded-xl bg-muted/60 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Smooth page transition wrapper ───────────────────────────────────────────
const pageVariants: Variants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.18, ease: [0.55, 0, 1, 0.45] },
  },
};

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

// ── Scroll / hash handler ────────────────────────────────────────────────────
function ScrollManager() {
  const [location] = useLocation();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const id = hash.slice(1);
      const timer = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
      return undefined;
    }
  }, [location]);

  return null;
}

// ── Routes ───────────────────────────────────────────────────────────────────
function AppRoutes() {
  const [location] = useLocation();

  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageSkeleton />}>
        <AnimatePresence mode="wait" initial={false}>
          <Switch key={location} location={location}>
            <Route path="/">
              <PageTransition><HomePage /></PageTransition>
            </Route>
            <Route path="/about">
              <PageTransition><AboutPage /></PageTransition>
            </Route>
            <Route path="/services">
              <PageTransition><ServicesPage /></PageTransition>
            </Route>
            <Route path="/portfolio">
              <PageTransition><PortfolioPage /></PageTransition>
            </Route>
            <Route path="/blog">
              <PageTransition><BlogPage /></PageTransition>
            </Route>
            <Route path="/blog/:slug">
              <PageTransition><BlogPostPage /></PageTransition>
            </Route>
            <Route path="/contact">
              <PageTransition><ContactPage /></PageTransition>
            </Route>
            <Route path="/process">
              <PageTransition><ProcessPage /></PageTransition>
            </Route>
            <Route path="/careers">
              <PageTransition><CareersPage /></PageTransition>
            </Route>
            <Route path="/privacy">
              <PageTransition><PrivacyPage /></PageTransition>
            </Route>
            <Route path="/terms">
              <PageTransition><TermsPage /></PageTransition>
            </Route>
            <Route>
              <PageTransition><NotFoundPage /></PageTransition>
            </Route>
          </Switch>
        </AnimatePresence>
      </Suspense>
    </>
  );
}

// ── CMS routes ───────────────────────────────────────────────────────────────
/**
 * Every route except the login screen is wrapped in RequireAdmin. That is the
 * UX gate; the real boundary is the RLS policies in Postgres, which reject
 * reads and writes for any user missing from the admin_users allowlist.
 */
function AdminBoot() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-6 w-6 animate-spin text-primary" />
      <span className="sr-only">Loading the content management system</span>
    </div>
  );
}

import AdminLayout from "@/components/admin/AdminLayout";

function AdminRoutes() {
  return (
    <Switch>
      <Route path={ADMIN_ROUTES.login}>
        <Suspense fallback={<AdminBoot />}>
          <AdminLoginPage />
        </Suspense>
      </Route>

      <Route>
        <AdminLayout>
          <Suspense
            fallback={
              <div className="flex-1 flex items-center justify-center p-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            }
          >
            <Switch>
              <Route path={ADMIN_ROUTES.dashboard}>
                <RequireAdmin><AdminDashboardPage /></RequireAdmin>
              </Route>

              {/* Static /posts/new must be declared before the /posts/:id pattern. */}
              <Route path={ADMIN_ROUTES.postNew}>
                <RequireAdmin><AdminPostEditorPage /></RequireAdmin>
              </Route>
              <Route path={`${ADMIN_BASE}/posts/:id`}>
                {(params: { id: string }) => (
                  <RequireAdmin><AdminPostEditorPage id={params.id} /></RequireAdmin>
                )}
              </Route>
              <Route path={ADMIN_ROUTES.posts}>
                <RequireAdmin><AdminPostsPage /></RequireAdmin>
              </Route>

              <Route path={ADMIN_ROUTES.categories}>
                <RequireAdmin><AdminCategoriesPage /></RequireAdmin>
              </Route>
              <Route path={ADMIN_ROUTES.projects}>
                <RequireAdmin><AdminProjectsPage /></RequireAdmin>
              </Route>
              <Route path={ADMIN_ROUTES.reviews}>
                <RequireAdmin><AdminReviewsPage /></RequireAdmin>
              </Route>
              <Route path={ADMIN_ROUTES.messages}>
                <RequireAdmin><AdminMessagesPage /></RequireAdmin>
              </Route>

              <Route>
                <RequireAdmin><AdminDashboardPage /></RequireAdmin>
              </Route>
            </Switch>
          </Suspense>
        </AdminLayout>
      </Route>
    </Switch>
  );
}

// ── Shell switch: the CMS renders without the marketing navbar/footer ────────
function AppShell() {
  const [location] = useLocation();
  const isAdminRoute =
    location === ADMIN_BASE || location.startsWith(`${ADMIN_BASE}/`);

  if (isAdminRoute) return <AdminRoutes />;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1">
        <AppRoutes />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────
function App() {
  return (
    <HelmetProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <TooltipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <AppShell />
                <Toaster />
              </WouterRouter>
            </TooltipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
