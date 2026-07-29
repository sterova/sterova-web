import { Component, type ErrorInfo, type ReactNode } from "react";
import { useRouterState, Link } from "@tanstack/react-router";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/report-error";
import { useRouteRetry } from "@/lib/route-retry";

/** True for Vite/browser dynamic-import (route chunk) failures. */
function isChunkLoadError(error: Error) {
  const message = `${error?.name ?? ""} ${error?.message ?? ""}`.toLowerCase();
  return (
    message.includes("dynamically imported module") ||
    message.includes("failed to fetch dynamically") ||
    message.includes("chunkloaderror") ||
    message.includes("importing a module script failed") ||
    message.includes("error loading dynamically imported")
  );
}

function NavigationErrorFallback({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const chunkFailure = isChunkLoadError(error);
  const { retry: rerunLoader, retrying } = useRouteRetry(onRetry);

  const retry = () => {
    // A missing/stale route chunk can't recover in-memory — reload the URL.
    if (chunkFailure && typeof window !== "undefined") {
      try {
        sessionStorage.setItem("sterova:retry-scroll", String(window.scrollY));
      } catch {
        /* storage unavailable */
      }
      window.location.reload();
      return;
    }
    void rerunLoader();
  };

  return (
    <section
      role="alert"
      aria-live="polite"
      className="grid-etch flex min-h-[70vh] items-center justify-center px-4 py-24"
    >
      <div className="panel w-full max-w-xl p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Page didn’t load
          </span>
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {chunkFailure ? "This page couldn’t finish loading" : "Something went wrong here"}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          {chunkFailure
            ? "The connection dropped while loading this page, or a newer version was deployed. Retrying usually fixes it."
            : "We hit an unexpected error while opening this page. You can retry, or head back home."}
        </p>

        <p className="mt-5 rounded-lg border border-border bg-secondary/60 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
          {pathname}
          {error?.message ? ` — ${error.message}` : ""}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="gradient" onClick={retry} disabled={retrying}>
            <RotateCcw
              className={`mr-2 h-4 w-4 ${retrying ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {retrying ? "Retrying…" : "Retry"}
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Back home
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

interface Props {
  children: ReactNode;
  /** Changing this value (route pathname) clears a stale error automatically. */
  resetKey?: string;
}

interface State {
  error: Error | null;
  resetKey?: string;
}

/**
 * Navigation-level boundary: wraps the routed <Outlet /> so a failed route
 * chunk, loader throw, or render crash shows a friendly retryable fallback
 * instead of blanking the app shell. Navigating elsewhere clears it.
 */
export default class NavigationErrorBoundary extends Component<Props, State> {
  state: State = { error: null, resetKey: this.props.resetKey };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey };
    }
    return null;
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("NavigationErrorBoundary caught:", error, info.componentStack);
    reportError(error, { boundary: "navigation" });
  }

  render() {
    if (this.state.error) {
      return (
        <NavigationErrorFallback
          error={this.state.error}
          onRetry={() => this.setState({ error: null })}
        />
      );
    }
    return this.props.children;
  }
}
