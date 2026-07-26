import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export interface AdminSession {
  userId: string;   // Supabase Auth user ID
  adminId: string;  // Row ID in public.admins
  email: string;
  role: "admin" | "super_admin";
}

/**
 * Verify the current request has a valid admin session.
 * Uses cookies from next/headers — safe in Server Components and Route Handlers.
 */
export async function verifyAdminRequest(): Promise<AdminSession | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;

    const { data: admin } = await supabase
      .from("admins")
      .select("id, email, role")
      .eq("user_id", user.id)
      .single();

    if (!admin) return null;

    return {
      userId: user.id,
      adminId: admin.id,
      email: admin.email,
      role: admin.role as "admin" | "super_admin",
    };
  } catch {
    return null;
  }
}

/**
 * Log an admin action to the audit_logs table.
 * Never throws — audit failures must not interrupt admin operations.
 */
export async function logAdminAction(
  userId: string,
  action: string,
  resource?: string,
  resourceId?: string,
  metadata?: Record<string, unknown>
) {
  try {
    const supabase = createServiceClient();
    await supabase.from("audit_logs").insert({
      actor_id: userId,
      action,
      resource: resource ?? null,
      resource_id: resourceId ?? null,
      metadata: metadata ?? null,
    });
  } catch {
    // silent — audit logging must never break admin operations
  }
}

/** Standard 401 response for unauthorized API requests. */
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

/** Standard 400 response for bad requests. */
export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}
