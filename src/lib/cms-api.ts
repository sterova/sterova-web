import { supabase } from "@/lib/supabase";
import { phase2Error } from "@/lib/settings-api";
import type {
  AdminNotificationRow,
  ApplicationStatus,
  AppRole,
  AuditLogRow,
  JobApplicationRow,
  JobOpeningRow,
  TestimonialRow,
  UserRoleRow,
} from "@/types/database";

/**
 * Phase 2 CMS data access: testimonials, careers, notifications, roles and the
 * audit trail. Backed by sql/0009_phase2.sql; every call runs under RLS.
 */

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw phase2Error(error.message);
  return (data ?? []) as T;
}

/* ── Testimonials ─────────────────────────────────────────────────────── */

export async function fetchPublishedTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("display_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as TestimonialRow[];
}

export async function adminFetchTestimonials(): Promise<TestimonialRow[]> {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  return unwrap(data as TestimonialRow[] | null, error);
}

export async function adminCreateTestimonial(
  input: Partial<TestimonialRow> & { name: string; content: string },
): Promise<void> {
  const { error } = await supabase.from("testimonials").insert(input);
  if (error) throw phase2Error(error.message);
}

export async function adminUpdateTestimonial(
  id: string,
  input: Partial<TestimonialRow>,
): Promise<void> {
  const { error } = await supabase.from("testimonials").update(input).eq("id", id);
  if (error) throw phase2Error(error.message);
}

export async function adminDeleteTestimonial(id: string): Promise<void> {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw phase2Error(error.message);
}

/* ── Careers ──────────────────────────────────────────────────────────── */

export async function fetchOpenRoles(): Promise<JobOpeningRow[]> {
  const { data, error } = await supabase
    .from("job_openings")
    .select("*")
    .eq("is_open", true)
    .order("display_order", { ascending: true });
  if (error) return [];
  return (data ?? []) as JobOpeningRow[];
}

export async function adminFetchJobOpenings(): Promise<JobOpeningRow[]> {
  const { data, error } = await supabase
    .from("job_openings")
    .select("*")
    .order("display_order", { ascending: true })
    .order("created_at", { ascending: false });
  return unwrap(data as JobOpeningRow[] | null, error);
}

export async function adminCreateJobOpening(
  input: Partial<JobOpeningRow> & { title: string; slug: string },
): Promise<void> {
  const { error } = await supabase.from("job_openings").insert(input);
  if (error) throw phase2Error(error.message);
}

export async function adminUpdateJobOpening(
  id: string,
  input: Partial<JobOpeningRow>,
): Promise<void> {
  const { error } = await supabase.from("job_openings").update(input).eq("id", id);
  if (error) throw phase2Error(error.message);
}

export async function adminDeleteJobOpening(id: string): Promise<void> {
  const { error } = await supabase.from("job_openings").delete().eq("id", id);
  if (error) throw phase2Error(error.message);
}

export async function adminFetchApplications(): Promise<JobApplicationRow[]> {
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .order("created_at", { ascending: false });
  return unwrap(data as JobApplicationRow[] | null, error);
}

export async function adminUpdateApplication(
  id: string,
  input: Partial<JobApplicationRow>,
): Promise<void> {
  const { error } = await supabase.from("job_applications").update(input).eq("id", id);
  if (error) throw phase2Error(error.message);
}

export function adminSetApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
  return adminUpdateApplication(id, { status });
}

export async function adminDeleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from("job_applications").delete().eq("id", id);
  if (error) throw phase2Error(error.message);
}

/* ── Notifications ────────────────────────────────────────────────────── */

export async function adminFetchNotifications(limit = 100): Promise<AdminNotificationRow[]> {
  const { data, error } = await supabase
    .from("admin_notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return unwrap(data as AdminNotificationRow[] | null, error);
}

/** Fire-and-forget: a failed notification must never break a submission. */
export async function raiseNotification(
  input: Partial<AdminNotificationRow> & { title: string },
): Promise<void> {
  try {
    await supabase.from("admin_notifications").insert(input);
  } catch {
    /* ignore */
  }
}

export async function adminMarkNotificationRead(id: string, isRead = true): Promise<void> {
  const { error } = await supabase
    .from("admin_notifications")
    .update({ is_read: isRead })
    .eq("id", id);
  if (error) throw phase2Error(error.message);
}

export async function adminMarkAllNotificationsRead(): Promise<void> {
  const { error } = await supabase
    .from("admin_notifications")
    .update({ is_read: true })
    .eq("is_read", false);
  if (error) throw phase2Error(error.message);
}

export async function adminDeleteNotification(id: string): Promise<void> {
  const { error } = await supabase.from("admin_notifications").delete().eq("id", id);
  if (error) throw phase2Error(error.message);
}

/* ── Roles ────────────────────────────────────────────────────────────── */

export async function adminFetchUserRoles(): Promise<UserRoleRow[]> {
  const { data, error } = await supabase
    .from("user_roles")
    .select("*")
    .order("created_at", { ascending: false });
  return unwrap(data as UserRoleRow[] | null, error);
}

export async function adminAssignRole(userId: string, role: AppRole): Promise<void> {
  const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
  if (error) throw phase2Error(error.message);
}

export async function adminRevokeRole(id: string): Promise<void> {
  const { error } = await supabase.from("user_roles").delete().eq("id", id);
  if (error) throw phase2Error(error.message);
}

/* ── Audit log ────────────────────────────────────────────────────────── */

export async function adminFetchAuditLogs(limit = 200): Promise<AuditLogRow[]> {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return unwrap(data as AuditLogRow[] | null, error);
}

/** Best-effort append. Logging must never block the action it describes. */
export async function recordAudit(input: {
  action: string;
  entity: string;
  entity_id?: string | null;
  summary?: string | null;
}): Promise<void> {
  try {
    const { data } = await supabase.auth.getUser();
    await supabase.from("audit_logs").insert({
      ...input,
      actor_id: data.user?.id ?? null,
      actor_email: data.user?.email ?? null,
    });
  } catch {
    /* ignore */
  }
}
