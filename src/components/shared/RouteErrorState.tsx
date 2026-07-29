import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Home, RotateCcw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { reportError } from "@/lib/report-error";
import { useRouteRetry } from "@/lib/route-retry";

interface RouteErrorStateProps {
  error: Error;
  reset?: () => void;
  boundary?: string;
  title?: string;
  description?: string;
}

/** Shared premium error surface used by every router error boundary. */
export default function RouteErrorState({
  error,
  reset,
  boundary = "route",
  title = "Something broke on our end",
  description = "This section failed to load. It's not you — try again, or reach out and we'll sort it fast.",
}: RouteErrorStateProps) {
  const { retry, retrying } = useRouteRetry(reset);

  useEffect(() => {
    console.error(error);
    reportError(error, { boundary });
  }, [error, boundary]);

  return (
    <section className="grid-etch flex min-h-[70vh] items-center justify-center px-4 py-24">
      <div className="panel w-full max-w-xl p-8 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-primary">
            <AlertTriangle className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Error / 500
          </span>
        </div>

        <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">{description}</p>

        {error?.message ? (
          <p className="mt-5 rounded-lg border border-border bg-secondary/60 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
            {error.message}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="gradient" onClick={() => void retry()} disabled={retrying}>
            <RotateCcw
              className={`mr-2 h-4 w-4 ${retrying ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            {retrying ? "Retrying…" : "Try again"}
          </Button>
          <Button asChild variant="outline">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" aria-hidden="true" />
              Back home
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/contact">
              <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
              Report it
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
