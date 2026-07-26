import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

export interface AdminSession {
  userId: string;
  email: string;
}

/**
 * Verify the current request is from a logged-in admin.
 * Returns the session object, or null if not authenticated / not an admin.
 */
export async function verifyAdminRequest(): Promise<AdminSession | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Check admins table (service client bypasses RLS)
    const service = createServiceClient();
    const { data, error } = await service
      .from("admins")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return null;

    return { userId: user.id, email: user.email ?? "" };
  } catch {
    return null;
  }
}

/**
 * Write an audit log entry. Fails silently.
 */
export async function writeAuditLog(opts: {
  action: string;
  resource?: string;
  resource_id?: string;
  actor_email?: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    const service = createServiceClient();
    await service.from("audit_logs").insert({
      action: opts.action,
      resource: opts.resource ?? null,
      resource_id: opts.resource_id ?? null,
      actor_email: opts.actor_email ?? null,
      metadata: opts.metadata ?? null,
    });
  } catch {
    // silent
  }
}
