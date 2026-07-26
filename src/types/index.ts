// ─────────────────────────────────────────────
// Supabase database types
// ─────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  budget: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived";
  ip_address: string | null;
  user_agent: string | null;
}

export interface NewsletterSubscriber {
  id: string;
  created_at: string;
  email: string;
  active: boolean;
  source: string | null;
}

export interface JobApplication {
  id: string;
  created_at: string;
  position: string;
  name: string;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  cover_letter: string | null;
  status: "new" | "reviewing" | "interviewed" | "offered" | "rejected";
}

export interface BlogPost {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category: string;
  tags: string[];
  author_name: string;
  author_avatar_url: string | null;
  published: boolean;
  published_at: string | null;
  read_time_minutes: number;
  views: number;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Review {
  id: string;
  created_at: string;
  name: string;
  content: string;
  rating: number;
  approved: boolean;
  ip_address: string | null;
}

export interface AdminUser {
  id: string;
  created_at: string;
  user_id: string;
  email: string;
  role: "admin" | "super_admin";
}

export interface AuditLog {
  id: string;
  created_at: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  resource: string | null;
  resource_id: string | null;
  metadata: Record<string, unknown> | null;
}

// ─────────────────────────────────────────────
// Content table types (migration 002)
// ─────────────────────────────────────────────

export interface DbService {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  title: string;
  short_description: string;
  description: string;
  icon_name: string;
  features: string[];
  technologies: string[];
  display_order: number;
  is_active: boolean;
}

export interface DbPortfolioItem {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export interface DbTestimonial {
  id: string;
  created_at: string;
  name: string;
  role: string;
  company: string | null;
  content: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
  display_order: number;
}

export interface DbFaq {
  id: string;
  created_at: string;
  question: string;
  answer: string;
  category: string | null;
  display_order: number;
  is_active: boolean;
}

export interface DbSiteSetting {
  id: string;
  key: string;
  value: string;
  type: "text" | "textarea" | "json" | "url" | "email" | "boolean" | "number";
  label: string | null;
  description: string | null;
  group_name: string | null;
}

export interface DbNavigationItem {
  id: string;
  label: string;
  href: string;
  parent_id: string | null;
  display_order: number;
  is_active: boolean;
}

// ─────────────────────────────────────────────
// Form types
// ─────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  budget?: string;
  message: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface JobApplicationFormData {
  position: string;
  name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  cover_letter?: string;
}

// ─────────────────────────────────────────────
// API response types
// ─────────────────────────────────────────────

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}
