import { supabase, isSupabaseConfigured, SUPABASE_NOT_CONFIGURED_MESSAGE } from "@/lib/supabase";
import { ACCEPTED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/data/admin-constants";
import { SERVICES, PROCESS_STEPS } from "@/data/constants";
import type {
  BlogCategoryRow,
  BlogPostRow,
  BlogPostWithCategory,
  BrandLinkRow,
  ContactMessageRow,
  ContactStatus,
  ProjectRow,
  ReviewRow,
  ReviewStatus,
  AdminSessionRow,
  SiteStatRow,
  TeamMemberRow,
} from "@/types/database";

const POST_WITH_CATEGORY = "*, blog_categories ( id, name, slug )" as const;

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("No data returned");
  return data;
}

/**
 * Public reads degrade to an empty result when the Supabase env vars are
 * absent, so the marketing site still renders its static content instead of
 * throwing a query error on every section.
 */
function offlineFallback<T>(value: T): T | undefined {
  return isSupabaseConfigured ? undefined : value;
}

/** Writes and admin calls cannot degrade — surface a clear, actionable error. */
function assertConfigured(): void {
  if (!isSupabaseConfigured) throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public reads — RLS restricts these to published / active / approved rows
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchPublishedPosts(): Promise<BlogPostWithCategory[]> {
  const fallback = offlineFallback<BlogPostWithCategory[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_WITH_CATEGORY)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  return unwrap(data as BlogPostWithCategory[] | null, error);
}

export async function fetchPostBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<BlogPostWithCategory | null> {
  if (!isSupabaseConfigured) return null;
  let query = supabase
    .from("blog_posts")
    .select(POST_WITH_CATEGORY)
    .eq("slug", slug)
    .eq("published", true);
  if (signal) query = query.abortSignal(signal) as typeof query;
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return (data as BlogPostWithCategory | null) ?? null;
}

export async function fetchCategories(): Promise<BlogCategoryRow[]> {
  const fallback = offlineFallback<BlogCategoryRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("display_order")
    .order("name");
  return unwrap(data, error);
}

export async function fetchServices(): Promise<ServiceRow[]> {
  let data = null;
  if (isSupabaseConfigured) {
    const res = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (!res.error) data = res.data;
  }

  if (!data || data.length === 0) {
    return SERVICES.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      overview: s.description,
      benefits: s.features,
      process: PROCESS_STEPS.map((p) => p.title),
      pricing_approach: "We offer fixed-price quotes based on detailed scoping, ensuring transparency and predictability.",
      display_order: s.display_order,
      is_active: s.is_active,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }));
  }
  return data;
}

export async function fetchServiceBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<ServiceRow | null> {
  let data = null;
  if (isSupabaseConfigured) {
    let query = supabase.from("services").select("*").eq("slug", slug).eq("is_active", true);
    if (signal) query = query.abortSignal(signal) as typeof query;
    const res = await query.maybeSingle();
    if (!res.error) data = res.data;
  }

  if (!data) {
    const s = SERVICES.find((service) => service.slug === slug);
    if (!s) return null;
    return {
      id: s.id,
      title: s.title,
      slug: s.slug,
      overview: s.description,
      benefits: s.features,
      process: PROCESS_STEPS.map((p) => p.title),
      pricing_approach: "We offer fixed-price quotes based on detailed scoping, ensuring transparency and predictability.",
      display_order: s.display_order,
      is_active: s.is_active,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  return data;
}

export async function fetchCaseStudies(): Promise<CaseStudyRow[]> {
  const fallback = offlineFallback<CaseStudyRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("case_studies")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return unwrap(data, error);
}

export async function fetchCaseStudyBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<CaseStudyRow | null> {
  if (!isSupabaseConfigured) return null;
  let query = supabase.from("case_studies").select("*").eq("slug", slug).eq("is_active", true);
  if (signal) query = query.abortSignal(signal) as typeof query;
  const { data, error } = await query.maybeSingle();
  if (error) throw new Error(error.message);
  return data ?? null;
}

export async function fetchIndustries(): Promise<IndustryRow[]> {
  const fallback = offlineFallback<IndustryRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("industries")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return unwrap(data, error);
}

export async function fetchFAQs(): Promise<FAQRow[]> {
  const fallback = offlineFallback<FAQRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("display_order");
  return unwrap(data, error);
}

export async function fetchActiveProjects(): Promise<ProjectRow[]> {
  const fallback = offlineFallback<ProjectRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("display_order")
    .order("created_at", { ascending: false });
  return unwrap(data, error);
}

export async function fetchApprovedReviews(): Promise<ReviewRow[]> {
  const fallback = offlineFallback<ReviewRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .order("display_order")
    .order("created_at", { ascending: false });
  return unwrap(data, error);
}

export async function fetchActiveStats(): Promise<SiteStatRow[]> {
  const fallback = offlineFallback<SiteStatRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("site_stats")
    .select("*")
    .eq("is_active", true)
    .order("display_order")
    .order("created_at");
  return unwrap(data as SiteStatRow[] | null, error);
}

export async function fetchActiveTeamMembers(): Promise<TeamMemberRow[]> {
  const fallback = offlineFallback<TeamMemberRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("display_order")
    .order("created_at");
  return unwrap(data as TeamMemberRow[] | null, error);
}

/** Fire-and-forget view counter; failures must never break the page. */
export async function incrementPostViews(slug: string): Promise<void> {
  if (!isSupabaseConfigured) return;
  const { error } = await supabase.rpc("increment_post_views", {
    p_slug: slug,
  });
  if (error) console.error("[v0] view increment failed:", error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public writes — insert-only, forced into a moderated state by RLS
// ─────────────────────────────────────────────────────────────────────────────

const ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/28402671/46o5srb/";

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  assertConfigured();
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject?.trim() || null,
    message: input.message.trim(),
    source: "contact",
  });
  if (error && isMissingColumn(error.message)) {
    const retryBase = {
      name: input.name.trim(),
      email: input.email.trim(),
      subject: input.subject?.trim() || null,
      message: input.message.trim(),
    };
    const retry = await supabase.from("contact_messages").insert(retryBase);

    if (!retry.error) {
      // Fire and forget webhook
      fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({ ...retryBase, source: "contact" }),
      }).catch(console.error);
    }

    if (retry.error) throw new Error(retry.error.message);
    return;
  }
  if (error) throw new Error(error.message);

  // Fire and forget webhook on success
  fetch(ZAPIER_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({
      name: input.name.trim(),
      email: input.email.trim(),
      subject: input.subject?.trim() || null,
      message: input.message.trim(),
      source: "contact",
    }),
  }).catch(console.error);
}

/** True when Postgres/PostgREST rejects a payload because a column is absent. */
function isMissingColumn(message: string): boolean {
  return /column .* does not exist|could not find the .* column/i.test(message);
}

export interface ServiceInquiryInput {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  serviceSlug?: string;
  serviceTitle?: string;
  message: string;
}

/**
 * Service enquiries live in the same inbox as contact messages but are tagged
 * with `source = 'service'` plus the selected service so the CMS can split them.
 * If the richer columns are not present yet the details are folded into the
 * message body so nothing is ever lost.
 */
export async function submitServiceInquiry(input: ServiceInquiryInput): Promise<void> {
  assertConfigured();
  const clean = (v?: string) => v?.trim() || null;
  const subject = input.serviceTitle
    ? `Service enquiry — ${input.serviceTitle}`
    : "Service enquiry";

  const base = {
    name: input.name.trim(),
    email: input.email.trim(),
    subject,
    message: input.message.trim(),
  };

  const { error } = await supabase.from("contact_messages").insert({
    ...base,
    source: "service",
    service_slug: clean(input.serviceSlug),
    service_title: clean(input.serviceTitle),
    company: clean(input.company),
    phone: clean(input.phone),
  });

  if (error && isMissingColumn(error.message)) {
    const details = [
      input.serviceTitle && `Service: ${input.serviceTitle}`,
      input.company && `Company: ${input.company}`,
      input.phone && `Phone: ${input.phone}`,
    ]
      .filter(Boolean)
      .join("\n");

    const retryPayload = {
      ...base,
      message: details ? `${details}\n\n${base.message}` : base.message,
    };
    const retry = await supabase.from("contact_messages").insert(retryPayload);

    if (!retry.error) {
      // Fire and forget webhook
      fetch(ZAPIER_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify({ ...retryPayload, source: "service" }),
      }).catch(console.error);
    }

    if (retry.error) throw new Error(retry.error.message);
    return;
  }
  if (error) throw new Error(error.message);

  // Fire and forget webhook on success
  fetch(ZAPIER_WEBHOOK_URL, {
    method: "POST",
    body: JSON.stringify({
      ...base,
      source: "service",
      service_slug: clean(input.serviceSlug),
      service_title: clean(input.serviceTitle),
      company: clean(input.company),
      phone: clean(input.phone),
    }),
  }).catch(console.error);
}

export async function submitReview(input: {
  name: string;
  content: string;
  rating: number;
  email?: string;
  role?: string;
  company?: string;
}): Promise<void> {
  assertConfigured();
  const { error } = await supabase.from("reviews").insert({
    name: input.name.trim(),
    content: input.content.trim(),
    rating: input.rating,
    email: input.email?.trim() || null,
    role: input.role?.trim() || null,
    company: input.company?.trim() || null,
    // Explicit so it matches the RLS WITH CHECK constraint exactly.
    status: "pending",
    is_featured: false,
  });
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin reads / writes — every one of these requires is_admin() to pass in RLS
// ─────────────────────────────────────────────────────────────────────────────

export async function adminFetchPosts(): Promise<BlogPostWithCategory[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_WITH_CATEGORY)
    .order("updated_at", { ascending: false });
  return unwrap(data as BlogPostWithCategory[] | null, error);
}

export async function adminFetchPost(id: string): Promise<BlogPostRow> {
  const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  return unwrap(data, error);
}

export async function adminCreatePost(
  input: Partial<BlogPostRow> & { title: string; slug: string },
): Promise<BlogPostRow> {
  const { data, error } = await supabase.from("blog_posts").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminUpdatePost(
  id: string,
  input: Partial<BlogPostRow>,
): Promise<BlogPostRow> {
  const { data, error } = await supabase
    .from("blog_posts")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminDeletePost(id: string): Promise<void> {
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminCreateCategory(input: {
  name: string;
  slug: string;
  description?: string | null;
  display_order?: number;
}): Promise<BlogCategoryRow> {
  const { data, error } = await supabase.from("blog_categories").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminUpdateCategory(
  id: string,
  input: Partial<BlogCategoryRow>,
): Promise<BlogCategoryRow> {
  const { data, error } = await supabase
    .from("blog_categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminDeleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("blog_categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  return unwrap(data, error);
}

export async function adminUpdateReview(id: string, input: Partial<ReviewRow>): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from("reviews")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminSetReviewStatus(id: string, status: ReviewStatus): Promise<ReviewRow> {
  return adminUpdateReview(id, { status });
}

export async function adminDeleteReview(id: string): Promise<void> {
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("display_order")
    .order("created_at", { ascending: false });
  return unwrap(data, error);
}

export async function adminCreateProject(
  input: Partial<ProjectRow> & { title: string; slug: string },
): Promise<ProjectRow> {
  const { data, error } = await supabase.from("projects").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminUpdateProject(
  id: string,
  input: Partial<ProjectRow>,
): Promise<ProjectRow> {
  const { data, error } = await supabase
    .from("projects")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminDeleteProject(id: string): Promise<void> {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchMessages(): Promise<ContactMessageRow[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return unwrap(data, error);
}

export async function adminUpdateMessage(
  id: string,
  input: Partial<ContactMessageRow>,
): Promise<ContactMessageRow> {
  const { data, error } = await supabase
    .from("contact_messages")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminSetMessageStatus(
  id: string,
  status: ContactStatus,
): Promise<ContactMessageRow> {
  return adminUpdateMessage(id, { status });
}

export async function adminDeleteMessage(id: string): Promise<void> {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Results (site_stats) — admin CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function adminFetchStats(): Promise<SiteStatRow[]> {
  const { data, error } = await supabase
    .from("site_stats")
    .select("*")
    .order("display_order")
    .order("created_at");
  return unwrap(data as SiteStatRow[] | null, error);
}

export async function adminCreateStat(
  input: Partial<SiteStatRow> & { title: string; value: string },
): Promise<SiteStatRow> {
  const { data, error } = await supabase.from("site_stats").insert(input).select().single();
  return unwrap(data as SiteStatRow | null, error);
}

export async function adminUpdateStat(
  id: string,
  input: Partial<SiteStatRow>,
): Promise<SiteStatRow> {
  const { data, error } = await supabase
    .from("site_stats")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data as SiteStatRow | null, error);
}

export async function adminDeleteStat(id: string): Promise<void> {
  const { error } = await supabase.from("site_stats").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Team — admin CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function adminFetchTeamMembers(): Promise<TeamMemberRow[]> {
  const { data, error } = await supabase
    .from("team_members")
    .select("*")
    .order("display_order")
    .order("created_at");
  return unwrap(data as TeamMemberRow[] | null, error);
}

export async function adminCreateTeamMember(
  input: Partial<TeamMemberRow> & { full_name: string; position: string },
): Promise<TeamMemberRow> {
  const { data, error } = await supabase.from("team_members").insert(input).select().single();
  return unwrap(data as TeamMemberRow | null, error);
}

export async function adminUpdateTeamMember(
  id: string,
  input: Partial<TeamMemberRow>,
): Promise<TeamMemberRow> {
  const { data, error } = await supabase
    .from("team_members")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data as TeamMemberRow | null, error);
}

export async function adminDeleteTeamMember(id: string): Promise<void> {
  const { error } = await supabase.from("team_members").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Best-effort removal of an image that is no longer referenced. Failures are
 * swallowed: an orphaned object is far less harmful than a failed save.
 */
export async function removeStorageObjectByUrl(bucket: string, url: string | null): Promise<void> {
  if (!url) return;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const index = url.indexOf(marker);
  if (index === -1) return;
  const path = decodeURIComponent(url.slice(index + marker.length).split("?")[0]);
  if (!path) return;
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.warn("[cms] could not remove old image:", error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage
// ─────────────────────────────────────────────────────────────────────────────

export async function uploadImage(bucket: string, file: File): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Use JPEG, PNG, WebP, AVIF or GIF.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`Image is too large. Maximum size is ${MAX_UPLOAD_BYTES / 1024 / 1024}MB.`);
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "31536000", upsert: false });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin sessions — who is signed in to the CMS, and remote logout
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Registers (or refreshes) the caller's session row. Returns false once the
 * session has been revoked elsewhere, which is the browser's cue to sign out.
 */
export async function recordAdminSession(): Promise<boolean> {
  const userAgent = typeof navigator === "undefined" ? null : navigator.userAgent;
  const { data, error } = await supabase.rpc("record_admin_session", {
    p_user_agent: userAgent,
  });
  if (error) throw new Error(error.message);
  return data === true;
}

export async function adminFetchSessions(): Promise<AdminSessionRow[]> {
  const { data, error } = await supabase
    .from("admin_sessions")
    .select("*")
    .order("last_seen_at", { ascending: false });
  return unwrap(data as AdminSessionRow[] | null, error);
}

/** Remote logout of a single session. */
export async function adminRevokeSession(sessionId: string): Promise<number> {
  const { data, error } = await supabase.rpc("revoke_admin_session", {
    p_session_id: sessionId,
  });
  if (error) throw new Error(error.message);
  return (data as number | null) ?? 0;
}

/** Remote logout of every session for an admin account. */
export async function adminRevokeUserSessions(
  userId: string,
  keepCurrent = false,
): Promise<number> {
  const { data, error } = await supabase.rpc("revoke_admin_user_sessions", {
    p_user_id: userId,
    p_keep_current: keepCurrent,
  });
  if (error) throw new Error(error.message);
  return (data as number | null) ?? 0;
}

/** Deletes session rows untouched for 30 days. */
export async function adminPruneSessions(): Promise<number> {
  const { data, error } = await supabase.rpc("prune_admin_sessions");
  if (error) throw new Error(error.message);
  return (data as number | null) ?? 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Brand links — public read + admin CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchBrandLinks(): Promise<BrandLinkRow[]> {
  const fallback = offlineFallback<BrandLinkRow[]>([]);
  if (fallback) return fallback;
  const { data, error } = await supabase
    .from("brand_links")
    .select("*")
    .eq("is_active", true)
    .order("category")
    .order("display_order");
  return unwrap(data as BrandLinkRow[] | null, error);
}

export async function adminFetchBrandLinks(): Promise<BrandLinkRow[]> {
  const { data, error } = await supabase
    .from("brand_links")
    .select("*")
    .order("category")
    .order("display_order")
    .order("created_at");
  return unwrap(data as BrandLinkRow[] | null, error);
}

export async function adminCreateBrandLink(
  input: Partial<BrandLinkRow> & { category: string; key: string; label: string },
): Promise<BrandLinkRow> {
  const { data, error } = await supabase.from("brand_links").insert(input).select().single();
  return unwrap(data as BrandLinkRow | null, error);
}

export async function adminUpdateBrandLink(
  id: string,
  input: Partial<BrandLinkRow>,
): Promise<BrandLinkRow> {
  const { data, error } = await supabase
    .from("brand_links")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data as BrandLinkRow | null, error);
}

export async function adminDeleteBrandLink(id: string): Promise<void> {
  const { error } = await supabase.from("brand_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Enterprise Expansion — Admin CRUD
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ServiceRow,
  CaseStudyRow,
  IndustryRow,
  FAQRow,
  MediaAssetRow,
  SEOMetadataRow,
} from "@/types/database";

// Services
export async function adminFetchServices(): Promise<ServiceRow[]> {
  const { data, error } = await supabase.from("services").select("*").order("display_order");
  return unwrap(data, error);
}

export async function adminCreateService(
  input: Partial<ServiceRow> & { title: string; slug: string; overview: string },
): Promise<ServiceRow> {
  const { data, error } = await supabase.from("services").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminUpdateService(
  id: string,
  input: Partial<ServiceRow>,
): Promise<ServiceRow> {
  const { data, error } = await supabase
    .from("services")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminDeleteService(id: string): Promise<void> {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Case Studies
export async function adminFetchCaseStudies(): Promise<CaseStudyRow[]> {
  const { data, error } = await supabase.from("case_studies").select("*").order("display_order");
  return unwrap(data, error);
}

export async function adminCreateCaseStudy(
  input: Partial<CaseStudyRow> & {
    title: string;
    slug: string;
    client_name: string;
    problem: string;
    research: string;
    design: string;
    development: string;
    deployment: string;
    results: string;
  },
): Promise<CaseStudyRow> {
  const { data, error } = await supabase.from("case_studies").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminUpdateCaseStudy(
  id: string,
  input: Partial<CaseStudyRow>,
): Promise<CaseStudyRow> {
  const { data, error } = await supabase
    .from("case_studies")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminDeleteCaseStudy(id: string): Promise<void> {
  const { error } = await supabase.from("case_studies").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Industries
export async function adminFetchIndustries(): Promise<IndustryRow[]> {
  const { data, error } = await supabase.from("industries").select("*").order("display_order");
  return unwrap(data, error);
}

export async function adminCreateIndustry(
  input: Partial<IndustryRow> & { name: string; slug: string; description: string },
): Promise<IndustryRow> {
  const { data, error } = await supabase.from("industries").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminUpdateIndustry(
  id: string,
  input: Partial<IndustryRow>,
): Promise<IndustryRow> {
  const { data, error } = await supabase
    .from("industries")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminDeleteIndustry(id: string): Promise<void> {
  const { error } = await supabase.from("industries").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// FAQs
export async function adminFetchFAQs(): Promise<FAQRow[]> {
  const { data, error } = await supabase.from("faqs").select("*").order("display_order");
  return unwrap(data, error);
}

export async function adminCreateFAQ(
  input: Partial<FAQRow> & { question: string; answer: string },
): Promise<FAQRow> {
  const { data, error } = await supabase.from("faqs").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminUpdateFAQ(id: string, input: Partial<FAQRow>): Promise<FAQRow> {
  const { data, error } = await supabase.from("faqs").update(input).eq("id", id).select().single();
  return unwrap(data, error);
}

export async function adminDeleteFAQ(id: string): Promise<void> {
  const { error } = await supabase.from("faqs").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// Media Assets
export async function adminFetchMediaAssets(): Promise<MediaAssetRow[]> {
  const { data, error } = await supabase
    .from("media_assets")
    .select("*")
    .order("uploaded_at", { ascending: false });
  return unwrap(data, error);
}

export async function adminCreateMediaAsset(
  input: Partial<MediaAssetRow> & { file_name: string; file_type: string; url: string },
): Promise<MediaAssetRow> {
  const { data, error } = await supabase.from("media_assets").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminUpdateMediaAsset(
  id: string,
  input: Partial<MediaAssetRow>,
): Promise<MediaAssetRow> {
  const { data, error } = await supabase
    .from("media_assets")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminDeleteMediaAsset(id: string): Promise<void> {
  const { error } = await supabase.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// SEO Metadata
export async function adminFetchSEOMetadata(): Promise<SEOMetadataRow[]> {
  const { data, error } = await supabase.from("seo_metadata").select("*");
  return unwrap(data, error);
}

export async function adminUpdateSEOMetadata(
  id: string,
  input: Partial<SEOMetadataRow>,
): Promise<SEOMetadataRow> {
  const { data, error } = await supabase
    .from("seo_metadata")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminCreateSEOMetadata(
  input: Partial<SEOMetadataRow> & { route_path: string; title: string; description: string },
): Promise<SEOMetadataRow> {
  const { data, error } = await supabase.from("seo_metadata").insert(input).select().single();
  return unwrap(data, error);
}

export async function adminDeleteSEOMetadata(id: string): Promise<void> {
  const { error } = await supabase.from("seo_metadata").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
