import { skeletonForPath } from "./PageSkeletons";

/**
 * Page-level pending state. Only visible on genuinely cold loads (route chunk
 * still downloading) — prefetched routes render immediately. The skeleton
 * mirrors the destination's layout so the real content swaps in without jump,
 * and the wrapper stays full height so scroll restoration doesn't clamp to 0.
 */
export default function RoutePending({ pathname = "" }: { pathname?: string }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading page…</span>
      {skeletonForPath(pathname)}
    </div>
  );
}
