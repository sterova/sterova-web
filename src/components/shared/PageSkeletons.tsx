import { Skeleton } from "@/components/ui/skeleton";

/**
 * Page-level skeletons. These are only rendered on genuinely cold loads
 * (route chunk not yet downloaded); warm/prefetched routes render instantly.
 * Each variant mirrors the real page's layout rhythm so the swap is calm.
 */

function Shell({ children }: { children: React.ReactNode }) {
  return (
    // Tall enough to keep scroll restoration from clamping to 0.
    <div className="min-h-[100svh]" aria-hidden="true">
      <div className="container-custom py-16 sm:py-24">{children}</div>
    </div>
  );
}

function CardGrid({ count = 6, height = "h-56" }: { count?: number; height?: string }) {
  return (
    <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={`${height} w-full rounded-2xl`} />
      ))}
    </div>
  );
}

function HeadingBlock({ align = "left" }: { align?: "left" | "center" }) {
  const wrap = align === "center" ? "mx-auto text-center items-center flex flex-col" : "";
  return (
    <div className={wrap}>
      <Skeleton className="h-7 w-40 rounded-full" />
      <Skeleton className="mt-6 h-12 w-[min(100%,34rem)] rounded-xl" />
      <Skeleton className="mt-3 h-12 w-[min(100%,26rem)] rounded-xl" />
      <Skeleton className="mt-6 h-5 w-[min(100%,40rem)] rounded-lg" />
      <Skeleton className="mt-2 h-5 w-[min(100%,32rem)] rounded-lg" />
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <Shell>
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <HeadingBlock />
          <div className="mt-8 flex flex-wrap gap-3">
            <Skeleton className="h-12 w-44 rounded-xl" />
            <Skeleton className="h-12 w-36 rounded-xl" />
          </div>
        </div>
        <div className="hidden lg:col-span-6 lg:block">
          <Skeleton className="aspect-[7/5.4] w-full rounded-3xl" />
        </div>
      </div>
      <CardGrid />
    </Shell>
  );
}

export function ListingSkeleton() {
  return (
    <Shell>
      <HeadingBlock align="center" />
      <CardGrid count={6} height="h-64" />
    </Shell>
  );
}

export function ArticleSkeleton() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="mt-6 h-12 w-full rounded-xl" />
        <Skeleton className="mt-3 h-12 w-3/4 rounded-xl" />
        <div className="mt-6 flex gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-10 w-40 rounded-lg" />
        </div>
        <Skeleton className="mt-10 aspect-[16/9] w-full rounded-2xl" />
        <div className="mt-10 space-y-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 rounded ${i % 4 === 3 ? "w-2/3" : "w-full"}`} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function FormSkeleton() {
  return (
    <Shell>
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <HeadingBlock />
          <div className="mt-10 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-5 rounded-3xl border border-border p-6 sm:p-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-12 w-40 rounded-xl" />
        </div>
      </div>
    </Shell>
  );
}

export function ProseSkeleton() {
  return (
    <Shell>
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="mt-8 space-y-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <Skeleton key={i} className={`h-4 rounded ${i % 5 === 4 ? "w-1/2" : "w-full"}`} />
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function AdminSkeleton() {
  return (
    <div className="min-h-[100svh] p-6 sm:p-8" aria-hidden="true">
      <Skeleton className="h-8 w-56 rounded-lg" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </div>
      <div className="mt-8 space-y-3 rounded-2xl border border-border p-4 sm:p-6">
        <Skeleton className="h-10 w-full rounded-lg" />
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

/** Picks the closest-matching skeleton for a destination pathname. */
export function skeletonForPath(pathname: string) {
  if (pathname.startsWith("/sterova-admin")) return <AdminSkeleton />;
  if (pathname === "/") return <HomeSkeleton />;
  if (pathname.startsWith("/blog/")) return <ArticleSkeleton />;
  if (
    pathname.startsWith("/blog") ||
    pathname.startsWith("/portfolio") ||
    pathname.startsWith("/services") ||
    pathname.startsWith("/careers")
  )
    return <ListingSkeleton />;
  if (pathname.startsWith("/contact")) return <FormSkeleton />;
  if (pathname.startsWith("/privacy") || pathname.startsWith("/terms")) return <ProseSkeleton />;
  return <ListingSkeleton />;
}
