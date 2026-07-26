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
