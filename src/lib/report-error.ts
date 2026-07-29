/**
 * Central client-side error sink. Every error boundary funnels through here so
 * a real monitoring provider (Sentry, Logtail, …) can be wired up in one place.
 */
export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  console.error("[app-error]", detail, context);
}
