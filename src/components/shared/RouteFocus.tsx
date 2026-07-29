import { useEffect, useRef, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/**
 * Keeps keyboard focus and screen-reader context intact across navigations.
 *
 * When a route swaps, the element the user was on (a nav link, a card, a
 * button inside the old page) can unmount — the browser then drops focus onto
 * <body>, so the next Tab starts from the very top of the document. This
 * detects that case and parks focus on the <main> landmark instead, which is
 * where the new page's content begins. It also announces the new page title in
 * a polite live region, since a client-side route change is silent otherwise.
 *
 * Focus is only moved when it was actually lost, so an intentional focus (for
 * example the nav trigger a user re-opened) is never stolen.
 */
export default function RouteFocus() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [announcement, setAnnouncement] = useState("");
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    const frame = requestAnimationFrame(() => {
      const active = document.activeElement;
      const lost = !active || active === document.body || !document.contains(active);

      if (lost) {
        const main = document.getElementById("main");
        // preventScroll keeps scroll restoration in charge of the offset.
        main?.focus({ preventScroll: true });
      }

      setAnnouncement(document.title || pathname);
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only">
      {announcement}
    </div>
  );
}
