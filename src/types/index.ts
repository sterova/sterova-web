// ─────────────────────────────────────────────
// Frontend-only data types (no Supabase dependency)
// ─────────────────────────────────────────────

export interface BlogPost {
  id: string;
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

export interface Review {
  id: string;
  created_at: string;
  name: string;
  content: string;
  rating: number;
}

export interface Service {
  id: string;
  slug: string;
  icon_name: string;
  title: string;
  short_description: string;
  description: string;
  features: string[];
  technologies: string[];
  display_order: number;
  is_active: boolean;
}

export interface PortfolioItem {
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
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string | null;
  avatar_url: string | null;
  content: string;
  rating: number;
  is_active: boolean;
  display_order: number;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
  is_active: boolean;
  display_order: number;
}

// Form types
export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ReviewFormData {
  name: string;
  content: string;
  rating: number;
}
