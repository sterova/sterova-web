export const CONSENT_STORAGE_KEY = "sterova:cookie-consent";
export const CONSENT_EVENT = "sterova:cookie-consent-change";

export type ConsentValue = "granted" | "denied";

/** GA4 measurement IDs are public by design; env var can override per-env. */
export const GA4_MEASUREMENT_ID =
  import.meta.env.VITE_GA4_ID || "G-CSVTF2FTC4";

let initialized = false;

export function getStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function setConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    /* storage unavailable — consent stays session-only */
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
  if (value === "granted") initAnalytics();
}

/**
 * Loads GA4 / Clarity. Never call directly on page load — analytics may only
 * run once the visitor has explicitly opted in via the consent banner.
 */
export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (initialized) return;
  if (getStoredConsent() !== "granted") return;
  initialized = true;

  const ga4Id = GA4_MEASUREMENT_ID;
  const clarityId = import.meta.env.VITE_CLARITY_ID;

  if (ga4Id) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    // gtag.js only processes dataLayer entries that are real `arguments`
    // objects — pushing a plain array silently drops the command. Must also
    // live on window so trackLead/trackPageView can reach it.
    if (typeof window.gtag !== "function") {
      window.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
      } as (...args: unknown[]) => void;
    }
    window.gtag("js", new Date());
    if (isDebugMode()) {
      // `set` is what actually flips the transport-level `_dbg=1` flag that
      // GA4 DebugView filters on; passing debug_mode only in `config` sends it
      // as an ordinary event parameter and DebugView stays empty.
      window.gtag("set", "debug_mode", true);
    }
    window.gtag("config", ga4Id);
  }

  // Expose a manual trigger for GA4 DebugView verification from the console.
  window.__sterovaTestEvent = trackTestEvent;

  if (clarityId) {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.innerHTML = `
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "${clarityId}");
    `;
    document.head.appendChild(script);
  }
}

/** GA4 DebugView opt-in: ?ga_debug=1 in the URL, or VITE_GA4_DEBUG=true. */
export function isDebugMode(): boolean {
  if (typeof window === "undefined") return false;
  if (import.meta.env.VITE_GA4_DEBUG === "true") return true;
  try {
    return new URLSearchParams(window.location.search).get("ga_debug") === "1";
  } catch {
    return false;
  }
}

/** Fires a named test event (visible in GA4 DebugView when debug mode is on). */
export function trackTestEvent(name = "sterova_test_event") {
  if (typeof window === "undefined") return false;
  if (getStoredConsent() !== "granted") return false;
  if (typeof window.gtag !== "function") return false;
  window.gtag("event", name, {
    test_source: "manual_verification",
  });
  return true;
}

export function trackLead() {
  if (typeof window === "undefined") return;
  if (getStoredConsent() !== "granted") return;
  if (GA4_MEASUREMENT_ID && typeof window.gtag === "function") {
    window.gtag("event", "generate_lead");
  }
}

export function trackPageView(path: string) {
  if (typeof window === "undefined") return;
  if (getStoredConsent() !== "granted") return;
  if (typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_path: path,
    });
  }
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
    __sterovaTestEvent?: (name?: string) => boolean;
  }
}
