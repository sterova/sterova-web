import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { Suspense, lazy, type ReactNode } from "react";

import appCss from "../styles.css?url";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NotFoundPage from "@/pages/NotFoundPage";
import RouteErrorState from "@/components/shared/RouteErrorState";
import { THEME_SCRIPT } from "@/components/shared/ThemeToggle";
import AppErrorBoundary from "@/components/shared/AppErrorBoundary";
import ScrollRestoration from "@/components/shared/ScrollRestoration";
import RoutePending from "@/components/shared/RoutePending";
import NavigationErrorBoundary from "@/components/shared/NavigationErrorBoundary";
import { SITE } from "@/data/constants";
import { SterovaChatbot } from "@/components/chatbot/SterovaChatbot";
import MaintenanceGate from "@/components/shared/MaintenanceGate";
import { useFeatureEnabled } from "@/hooks/use-site-settings";
// Client-only UI enhancements are lazy-loaded to keep the initial SSR bundle
// small. They are not needed in the first server render.
const RouteProgress = lazy(() => import("@/components/shared/RouteProgress"));
const RouteFocus = lazy(() => import("@/components/shared/RouteFocus"));
const RoutePrefetcher = lazy(() => import("@/components/shared/RoutePrefetcher"));
const WhatsAppButton = lazy(() => import("@/components/shared/WhatsAppButton"));
const CookieConsent = lazy(() => import("@/components/shared/CookieConsent"));
const Toaster = lazy(() => import("@/components/ui/sonner").then((m) => ({ default: m.Toaster })));

const lazyFallback = <div className="fixed inset-x-0 top-0 z-[200] h-0.5" aria-hidden="true" />;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" },
      { title: `${SITE.name} — ${SITE.tagline}` },
      { name: "description", content: SITE.description },
      { name: "author", content: SITE.name },
      { property: "og:site_name", content: SITE.name },
      { name: "theme-color", content: "#17181b" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=IBM+Plex+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", sizes: "any" },
      { rel: "icon", href: "/icons/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { rel: "apple-touch-icon", href: "/icons/apple-touch-icon.png" },
      { rel: "icon", href: "/icons/favicon-48x48.png", type: "image/png", sizes: "48x48" },
      { rel: "icon", href: "/icons/favicon-64x64.png", type: "image/png", sizes: "64x64" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => <NotFoundPage />,
  errorComponent: ({ error, reset }) => (
    <RouteErrorState error={error} reset={reset} boundary="tanstack_root_error_component" />
  ),
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // Re-keying the boundary per destination guarantees the latest destination
  // wins during rapid clicks. Chunks are prewarmed, so in practice the new
  // route renders on the same frame and the fallback never appears.
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // The CMS ships its own chrome (sidebar + topbar) and must never render the
  // marketing navbar/footer around it.
  const isAdmin = pathname.startsWith("/sterova-admin");

  if (isAdmin) {
    return (
      <QueryClientProvider client={queryClient}>
        <AppErrorBoundary boundary="admin_shell" resetKey={pathname}>
          <Suspense fallback={lazyFallback}>
            <RouteProgress />
          </Suspense>
          <ScrollRestoration />
          <NavigationErrorBoundary resetKey={pathname}>
            {/* No key here: the CMS shell must stay mounted across navigations
                so only the page content inside <Outlet /> swaps. */}
            <Suspense fallback={<RoutePending pathname={pathname} />}>
              <Outlet />
            </Suspense>
          </NavigationErrorBoundary>
          <Suspense>
            <Toaster />
          </Suspense>
        </AppErrorBoundary>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MaintenanceGate>
        <PublicShell pathname={pathname} />
      </MaintenanceGate>
    </QueryClientProvider>
  );
}

function PublicShell({ pathname }: { pathname: string }) {
  const chatbotEnabled = useFeatureEnabled("chatbot");

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <AppErrorBoundary boundary="app_shell" resetKey={pathname}>
        <Suspense fallback={lazyFallback}>
          <RouteProgress />
        </Suspense>
        <ScrollRestoration />
        <Suspense>
          <RoutePrefetcher />
        </Suspense>
        <Suspense>
          <RouteFocus />
        </Suspense>
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">
          {/* Required: nested routes render here. */}
          <NavigationErrorBoundary resetKey={pathname}>
            <Suspense key={pathname} fallback={<RoutePending pathname={pathname} />}>
              <Outlet />
            </Suspense>
          </NavigationErrorBoundary>
        </main>
        <Footer />
        <WhatsAppButton />
        {chatbotEnabled ? (
          <Suspense>
            <SterovaChatbot />
          </Suspense>
        ) : null}
        <Suspense>
          <CookieConsent />
        </Suspense>
        <Suspense>
          <Toaster />
        </Suspense>
      </AppErrorBoundary>
    </>
  );
}
