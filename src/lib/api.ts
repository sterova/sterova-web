import { supabase } from "@/lib/supabase";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_UPLOAD_BYTES,
} from "@/data/admin-constants";
import type {
  BlogCategoryRow,
  BlogPostRow,
  BlogPostWithCategory,
  ContactMessageRow,
  ContactStatus,
  ProjectRow,
  ReviewRow,
  ReviewStatus,
} from "@/types/database";

const POST_WITH_CATEGORY =
  "*, blog_categories ( id, name, slug )" as const;

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(error.message);
  if (data === null) throw new Error("No data returned");
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// Public reads — RLS restricts these to published / active / approved rows
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchPublishedPosts(): Promise<BlogPostWithCategory[]> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_WITH_CATEGORY)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false });
  return unwrap(data as BlogPostWithCategory[] | null, error);
}

export async function fetchPostBySlug(
  slug: string,
): Promise<BlogPostWithCategory | null> {
  const { data, error } = await supabase
    .from("blog_posts")
    .select(POST_WITH_CATEGORY)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return (data as BlogPostWithCategory | null) ?? null;
}

export async function fetchCategories(): Promise<BlogCategoryRow[]> {
  const { data, error } = await supabase
    .from("blog_categories")
    .select("*")
    .order("display_order")
    .order("name");
  return unwrap(data, error);
}

export async function fetchActiveProjects(): Promise<ProjectRow[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_active", true)
    .order("display_order")
    .order("created_at", { ascending: false });
  return unwrap(data, error);
}

export async function fetchApprovedReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "approved")
    .order("display_order")
    .order("created_at", { ascending: false });
  return unwrap(data, error);
}

/** Fire-and-forget view counter; failures must never break the page. */
export async function incrementPostViews(slug: string): Promise<void> {
  const { error } = await supabase.rpc("increment_post_views", {
    p_slug: slug,
  });
  if (error) console.error("[v0] view increment failed:", error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Public writes — insert-only, forced into a moderated state by RLS
// ─────────────────────────────────────────────────────────────────────────────

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name.trim(),
    email: input.email.trim(),
    subject: input.subject?.trim() || null,
    message: input.message.trim(),
  });
  if (error) throw new Error(error.message);
}

export async function submitReview(input: {
  name: string;
  content: string;
  rating: number;
  email?: string;
  role?: string;
  company?: string;
}): Promise<void> {
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
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .single();
  return unwrap(data, error);
}

export async function adminCreatePost(
  input: Partial<BlogPostRow> & { title: string; slug: string },
): Promise<BlogPostRow> {
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(input)
    .select()
    .single();
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
  const { data, error } = await supabase
    .from("blog_categories")
    .insert(input)
    .select()
    .single();
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
  const { error } = await supabase
    .from("blog_categories")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function adminFetchReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });
  return unwrap(data, error);
}

export async function adminUpdateReview(
  id: string,
  input: Partial<ReviewRow>,
): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from("reviews")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  return unwrap(data, error);
}

export async function adminSetReviewStatus(
  id: string,
  status: ReviewStatus,
): Promise<ReviewRow> {
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
  const { data, error } = await supabase
    .from("projects")
    .insert(input)
    .select()
    .single();
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
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);
  if (error) throw new Error(error.message);
}

// ─────────────────────────────────────────────────────────────────────────────
// Storage
// ─────────────────────────────────────────────────────────────────────────────

export async function uploadImage(
  bucket: string,
  file: File,
): Promise<string> {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type. Use JPEG, PNG, WebP, AVIF or GIF.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `Image is too large. Maximum size is ${MAX_UPLOAD_BYTES / 1024 / 1024}MB.`,
    );
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
