import { AlertCircle, Inbox, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shared loading / error / empty presentation for Supabase-backed sections.
 * Keeping these in one place means the blog and portfolio grids stay visually
 * consistent while they resolve.
 */

export function CardGridSkeleton({ count = 6, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading content…</span>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col rounded-2xl border bg-background overflow-hidden">
          <div className="h-44 bg-muted animate-pulse" />
          <div className="p-5 flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
              <div className="h-5 w-14 rounded-full bg-muted/70 animate-pulse" />
            </div>
            <div className="h-5 w-full rounded bg-muted animate-pulse" />
            <div className="h-4 w-11/12 rounded bg-muted/70 animate-pulse" />
            <div className="h-4 w-4/6 rounded bg-muted/70 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorState({
  message = "We couldn't load this content right now.",
  error,
  onRetry,
}: {
  message?: string;
  error?: Error | null;
  onRetry?: () => void;
}) {
  return (
    <div role="alert" className="flex flex-col items-center text-center py-20 px-6">
      <AlertCircle className="h-10 w-10 text-destructive mb-4" aria-hidden="true" />
      <p className="font-medium mb-1">Something went wrong</p>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
      {error && (
        <div className="mt-4 text-xs font-mono text-destructive/80 bg-destructive/10 p-3 rounded-md max-w-md text-left overflow-auto border border-destructive/20">
          {error.message}
        </div>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-6" onClick={onRetry}>
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({
  title = "Nothing here yet",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="dot-grid mx-auto flex max-w-xl flex-col items-center rounded-3xl border border-dashed border-border-strong bg-surface px-8 py-16 text-center">
      <span className="mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-border bg-background">
        <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </span>
      <p className="font-display text-lg font-semibold tracking-tight">{title}</p>
      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
