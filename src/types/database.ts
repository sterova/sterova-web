// ─────────────────────────────────────────────
// Supabase schema types — mirrors supabase/migrations/0001_init.sql
// ─────────────────────────────────────────────

export type ContactStatus = "new" | "read" | "replied" | "archived";
export type MessageSource = "contact" | "service";
export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: ContactStatus;
  admin_note: string | null;
  created_at: string;
  updated_at: string;
  /** "contact" = normal contact page, "service" = service enquiry form. */
  source?: MessageSource | null;
  service_slug?: string | null;
  service_title?: string | null;
  company?: string | null;
  phone?: string | null;
}

export interface ReviewRow {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  status: ReviewStatus;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  tags: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string[];
  author_name: string;
  author_avatar_url: string | null;
  published: boolean;
  published_at: string | null;
  read_time_minutes: number;
  views: number;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminUserRow {
  user_id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

/** A single "Results that speak for themselves" metric. */
export interface SiteStatRow {
  id: string;
  title: string;
  value: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TeamMemberLinks {
  [key: string]: string | { label: string; url: string }[] | undefined;
  custom?: { label: string; url: string }[];
}

export interface TeamMemberRow {
  id: string;
  full_name: string;
  position: string;
  bio: string | null;
  photo_url: string | null;
  links: TeamMemberLinks;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/** A blog post joined with its category record. */
export type BlogPostWithCategory = BlogPostRow & {
  blog_categories: Pick<BlogCategoryRow, "id" | "name" | "slug"> | null;
};

type Insertable<T, Required extends keyof T> = Partial<T> & Pick<T, Required>;

export interface Database {
  public: {
    Tables: {
      admin_users: {
        Row: AdminUserRow;
        Insert: Insertable<AdminUserRow, "user_id" | "email">;
        Update: Partial<AdminUserRow>;
      };
      contact_messages: {
        Row: ContactMessageRow;
        Insert: Insertable<ContactMessageRow, "name" | "email" | "message">;
        Update: Partial<ContactMessageRow>;
      };
      reviews: {
        Row: ReviewRow;
        Insert: Insertable<ReviewRow, "name" | "content" | "rating">;
        Update: Partial<ReviewRow>;
      };
      projects: {
        Row: ProjectRow;
        Insert: Insertable<ProjectRow, "title" | "slug">;
        Update: Partial<ProjectRow>;
      };
      blog_categories: {
        Row: BlogCategoryRow;
        Insert: Insertable<BlogCategoryRow, "name" | "slug">;
        Update: Partial<BlogCategoryRow>;
      };
      blog_posts: {
        Row: BlogPostRow;
        Insert: Insertable<BlogPostRow, "title" | "slug">;
        Update: Partial<BlogPostRow>;
      };
      site_stats: {
        Row: SiteStatRow;
        Insert: Insertable<SiteStatRow, "title" | "value">;
        Update: Partial<SiteStatRow>;
      };
      team_members: {
        Row: TeamMemberRow;
        Insert: Insertable<TeamMemberRow, "full_name" | "position">;
        Update: Partial<TeamMemberRow>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      increment_post_views: {
        Args: { p_slug: string };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

/** One Supabase auth session belonging to a CMS administrator. */
export interface AdminSessionRow {
  session_id: string;
  user_id: string;
  email: string;
  user_agent: string | null;
  created_at: string;
  last_seen_at: string;
  revoked_at: string | null;
  revoked_by: string | null;
}
