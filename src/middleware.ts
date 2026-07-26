import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Only the login page is publicly reachable under /admin.
const ADMIN_PUBLIC = ["/admin/login"];

export async function middleware(request: NextRequest) {
  // Clone request headers and inject x-pathname so server components can
  // detect admin routes without restructuring into route groups.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  // Supabase SSR client — refreshes session cookies on every request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{
            name: string;
            value: string;
            options?: Record<string, unknown>;
          }>
        ) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(
              name,
              value,
              options as Parameters<typeof supabaseResponse.cookies.set>[2]
            )
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() must be called to refresh the session token.
  // Do NOT use getSession() — it is not authenticated server-side.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isAdminPath = path.startsWith("/admin");
  const isPublicAdminPath = ADMIN_PUBLIC.some((p) => path.startsWith(p));

  // Redirect unauthenticated users away from protected admin routes
  if (isAdminPath && !isPublicAdminPath && !user) {
    const loginUrl = new URL("/admin/login", request.url);
    // Only preserve internal redirects — prevents open-redirect
    if (path !== "/admin/login") {
      loginUrl.searchParams.set("from", path);
    }
    return NextResponse.redirect(loginUrl);
  }

  // Security headers for all admin paths
  if (isAdminPath) {
    supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
    supabaseResponse.headers.set("Cache-Control", "no-store, private");
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
