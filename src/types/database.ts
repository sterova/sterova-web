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

export type BrandLinkCategory = "social" | "contact";

export interface BrandLinkRow {
  id: string;
  category: BrandLinkCategory;
  key: string;
  label: string;
  value: string;
  href: string | null;
  description: string | null;
  icon_key: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Chatbot (sql/0006_chatbot.sql) ───────────────────────────────────────────

export type ChatbotLeadStatus = "new" | "contacted" | "qualified" | "won" | "lost" | "spam";

export interface ChatbotLeadRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service: string | null;
  timeline: string | null;
  message: string;
  source_node: string | null;
  page_url: string | null;
  session_id: string | null;
  status: ChatbotLeadStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type ConsultationStatus = "pending" | "confirmed" | "completed" | "cancelled" | "no_show";

export interface ConsultationBookingRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  topic: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  notes: string | null;
  page_url: string | null;
  session_id: string | null;
  status: ConsultationStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ChatbotEventRow {
  id: string;
  session_id: string;
  event_type: string;
  value: string | null;
  page_url: string | null;
  created_at: string;
}

/** One Project Estimator (/estimate) submission. */
export interface EstimatorSubmissionRow {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  project_type: string;
  features: string[];
  design_need: string | null;
  timeline_pref: string | null;
  estimate_cost: string | null;
  estimate_weeks: string | null;
  page_url: string | null;
  status: ChatbotLeadStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Phase 2 — settings, testimonials, careers, notifications, roles, audit
// mirrors sql/0009_phase2.sql
// ─────────────────────────────────────────────

export type SettingsKey = "company" | "website" | "features";

export interface CompanySettings {
  legal_name?: string;
  tagline?: string;
  founded_year?: string;
  registration_no?: string;
  gst_no?: string;
  support_email?: string;
  sales_email?: string;
  phone?: string;
  address?: string;
  working_hours?: string;
}

export interface WebsiteSettings {
  maintenance_mode?: boolean;
  maintenance_message?: string;
  announcement?: string;
  default_meta_title?: string;
  default_meta_description?: string;
  analytics_id?: string;
}

export interface FeatureSettings {
  chatbot?: boolean;
  estimator?: boolean;
  reviews?: boolean;
  blog?: boolean;
  careers?: boolean;
  services?: boolean;
  portfolio?: boolean;
  industries?: boolean;
}

export interface SiteSettingsMap {
  company: CompanySettings;
  website: WebsiteSettings;
  features: FeatureSettings;
}

export interface SiteSettingRow {
  key: SettingsKey;
  value: Record<string, unknown>;
  updated_at: string;
}

export interface TestimonialRow {
  id: string;
  name: string;
  role: string | null;
  company: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type EmploymentType = "full_time" | "part_time" | "contract" | "internship";

export interface JobOpeningRow {
  id: string;
  title: string;
  slug: string;
  department: string | null;
  location: string | null;
  employment_type: EmploymentType;
  experience: string | null;
  description: string;
  requirements: string[];
  is_open: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export type ApplicationStatus = "new" | "screening" | "interview" | "offer" | "hired" | "rejected";

export interface JobApplicationRow {
  id: string;
  job_id: string | null;
  job_title: string | null;
  name: string;
  email: string;
  phone: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  cover_letter: string;
  status: ApplicationStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export type NotificationKind =
  "info" | "lead" | "booking" | "estimate" | "application" | "review" | "message" | "system";

export interface AdminNotificationRow {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export type AppRole = "super_admin" | "admin" | "editor";

export interface UserRoleRow {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
}

export interface AuditLogRow {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity: string;
  entity_id: string | null;
  summary: string | null;
  created_at: string;
}

/** A blog post joined with its category record. */
export type BlogPostWithCategory = BlogPostRow & {
  blog_categories: Pick<BlogCategoryRow, "id" | "name" | "slug"> | null;
};

export interface ServiceRow {
  id: string;
  title: string;
  slug: string;
  overview: string;
  benefits: string[];
  process: string[];

  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyRow {
  id: string;
  title: string;
  slug: string;
  client_name: string;
  problem: string;
  research: string;
  design: string;
  development: string;
  deployment: string;
  results: string;
  cover_image: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface IndustryRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_key: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectIndustryRow {
  project_id: string;
  industry_id: string;
}

export interface FAQRow {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaAssetRow {
  id: string;
  file_name: string;
  file_type: string;
  url: string;
  alt_text: string | null;
  uploaded_at: string;
}

export interface SEOMetadataRow {
  id: string;
  route_path: string;
  title: string;
  description: string;
  keywords: string[];
  og_image: string | null;
  created_at: string;
  updated_at: string;
}

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
      brand_links: {
        Row: BrandLinkRow;
        Insert: Insertable<BrandLinkRow, "category" | "key" | "label">;
        Update: Partial<BrandLinkRow>;
      };
      chatbot_leads: {
        Row: ChatbotLeadRow;
        Insert: Insertable<ChatbotLeadRow, "name" | "email" | "message">;
        Update: Partial<ChatbotLeadRow>;
      };
      consultation_bookings: {
        Row: ConsultationBookingRow;
        Insert: Insertable<ConsultationBookingRow, "name" | "email" | "phone">;
        Update: Partial<ConsultationBookingRow>;
      };
      chatbot_events: {
        Row: ChatbotEventRow;
        Insert: Insertable<ChatbotEventRow, "session_id" | "event_type">;
        Update: Partial<ChatbotEventRow>;
      };
      estimator_submissions: {
        Row: EstimatorSubmissionRow;
        Insert: Insertable<EstimatorSubmissionRow, "email" | "project_type">;
        Update: Partial<EstimatorSubmissionRow>;
      };
      site_settings: {
        Row: SiteSettingRow;
        Insert: Insertable<SiteSettingRow, "key" | "value">;
        Update: Partial<SiteSettingRow>;
      };
      testimonials: {
        Row: TestimonialRow;
        Insert: Insertable<TestimonialRow, "name" | "content">;
        Update: Partial<TestimonialRow>;
      };
      job_openings: {
        Row: JobOpeningRow;
        Insert: Insertable<JobOpeningRow, "title" | "slug">;
        Update: Partial<JobOpeningRow>;
      };
      job_applications: {
        Row: JobApplicationRow;
        Insert: Insertable<JobApplicationRow, "name" | "email">;
        Update: Partial<JobApplicationRow>;
      };
      admin_notifications: {
        Row: AdminNotificationRow;
        Insert: Insertable<AdminNotificationRow, "title">;
        Update: Partial<AdminNotificationRow>;
      };
      user_roles: {
        Row: UserRoleRow;
        Insert: Insertable<UserRoleRow, "user_id" | "role">;
        Update: Partial<UserRoleRow>;
      };
      services: {
        Row: ServiceRow;
        Insert: Insertable<ServiceRow, "title" | "slug" | "overview">;
        Update: Partial<ServiceRow>;
      };
      case_studies: {
        Row: CaseStudyRow;
        Insert: Insertable<
          CaseStudyRow,
          | "title"
          | "slug"
          | "client_name"
          | "problem"
          | "research"
          | "design"
          | "development"
          | "deployment"
          | "results"
        >;
        Update: Partial<CaseStudyRow>;
      };
      industries: {
        Row: IndustryRow;
        Insert: Insertable<IndustryRow, "name" | "slug" | "description">;
        Update: Partial<IndustryRow>;
      };
      project_industries: {
        Row: ProjectIndustryRow;
        Insert: ProjectIndustryRow;
        Update: Partial<ProjectIndustryRow>;
      };
      faqs: {
        Row: FAQRow;
        Insert: Insertable<FAQRow, "question" | "answer">;
        Update: Partial<FAQRow>;
      };
      media_assets: {
        Row: MediaAssetRow;
        Insert: Insertable<MediaAssetRow, "file_name" | "file_type" | "url">;
        Update: Partial<MediaAssetRow>;
      };
      seo_metadata: {
        Row: SEOMetadataRow;
        Insert: Insertable<SEOMetadataRow, "route_path" | "title" | "description">;
        Update: Partial<SEOMetadataRow>;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: Insertable<AuditLogRow, "action" | "entity">;
        Update: Partial<AuditLogRow>;
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
