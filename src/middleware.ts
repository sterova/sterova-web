import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Admin paths that do NOT require authentication
const ADMIN_PUBLIC = ["/admin/login", "/admin/setup"];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Supabase SSR client — refreshes session cookies on every request
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
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
    loginUrl.searchParams.set("from", path);
    return NextResponse.redirect(loginUrl);
  }

  // Add noindex / nofollow for all admin paths
  if (isAdminPath) {
    supabaseResponse.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
