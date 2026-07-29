export function initAnalytics() {
  if (typeof window === "undefined") return;

  const ga4Id = import.meta.env.VITE_GA4_ID;
  const clarityId = import.meta.env.VITE_CLARITY_ID;

  if (ga4Id) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: unknown[]) {
      window.dataLayer.push(args);
    }
    gtag("js", new Date());
    gtag("config", ga4Id);
  }

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

export function trackLead() {
  if (typeof window === "undefined") return;
  const ga4Id = import.meta.env.VITE_GA4_ID;
  if (ga4Id && typeof window.gtag === "function") {
    window.gtag("event", "generate_lead");
  }
}

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}
