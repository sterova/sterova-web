/**
 * Smooth scrolling is opt-in, not global.
 *
 * A global `html { scroll-behavior: smooth }` makes *every* programmatic
 * scroll animate — including the router's scroll restoration on back/forward
 * and the scroll-to-top on route change — which reads as jank. Instead the
 * base stylesheet keeps `auto`, and in-page anchor navigation briefly opts
 * into smooth behaviour through this helper.
 */
const CLASS = "scroll-smooth-anchor";
let timeout: ReturnType<typeof setTimeout> | undefined;

export function withSmoothAnchorScroll() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.add(CLASS);
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => root.classList.remove(CLASS), 1000);
}
