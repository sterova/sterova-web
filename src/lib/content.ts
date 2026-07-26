/**
 * Server-side content fetching utilities.
 * Use these in Server Components and page.tsx to fetch DB-driven content.
 * All functions return empty arrays on error — the UI handles empty states.
 */

import { createServiceClient } from "@/lib/supabase/server";

export interface DbService {
  id: string;
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
  type: string;
  description: string | null;
}

export async function getServices(): Promise<DbService[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPortfolioItems(
  featuredOnly = false
): Promise<DbPortfolioItem[]> {
  try {
    const supabase = createServiceClient();
    let query = supabase
      .from("portfolio_items")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (featuredOnly) query = query.eq("is_featured", true);
    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getTestimonials(): Promise<DbTestimonial[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getFaqs(limit?: number): Promise<DbFaq[]> {
  try {
    const supabase = createServiceClient();
    let query = supabase
      .from("faqs")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    if (limit) query = query.limit(limit);
    const { data } = await query;
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase.from("site_settings").select("key, value");
    if (!data) return {};
    return Object.fromEntries(data.map((s) => [s.key, s.value]));
  } catch {
    return {};
  }
}
