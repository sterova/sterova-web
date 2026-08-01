import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  CONSENT_EVENT,
  getStoredConsent,
  initAnalytics,
  setConsent,
  trackPageView,
} from "@/lib/analytics";

/**
 * Cookie/analytics consent banner. Analytics scripts stay unloaded until the
 * visitor explicitly accepts, and page views are only reported afterwards.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const consent = getStoredConsent();
    if (consent === "granted") initAnalytics();
    setVisible(consent === null);

    const onChange = () => setVisible(getStoredConsent() === null);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[150] mx-auto max-w-3xl rounded-xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:inset-x-6 sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use analytics cookies to understand how the site is used. They stay off
          until you accept.{" "}
          <Link to="/privacy" className="font-medium text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" onClick={() => setConsent("denied")}>
            Decline
          </Button>
          <Button size="sm" onClick={() => setConsent("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}