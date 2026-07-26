/**
 * Server-side content fetching utilities.
 * Use these in Server Components and page.tsx to fetch DB-driven content.
 * All functions return empty arrays / empty objects on error.
 * Tables come from migration 002_content_schema.sql.
 */

import { createServiceClient } from "@/lib/supabase/server";
import { PORTFOLIO_ITEMS, TESTIMONIALS, FAQS } from "@/data/constants";
import type {
  DbService,
  DbPortfolioItem,
  DbTestimonial,
  DbFaq,
  DbSiteSetting,
  DbNavigationItem,
} from "@/types";

// Re-export types for consumers
export type { DbService, DbPortfolioItem, DbTestimonial, DbFaq, DbSiteSetting, DbNavigationItem };

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

export async function getAllServices(): Promise<DbService[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("services")
      .select("*")
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
    if (data?.length) return data;
  } catch {
    // Fall through to local fallback.
  }
  return PORTFOLIO_ITEMS.filter((item) => !featuredOnly || item.featured).map((item, index) => ({
    id: item.id, created_at: "", updated_at: "", title: item.title, category: item.category,
    description: item.description, tags: item.tags, image_url: item.image, live_url: null, github_url: null,
    is_featured: item.featured, is_active: true, display_order: index + 1,
  }));
}

export async function getAllPortfolioItems(): Promise<DbPortfolioItem[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order");
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
    if (data?.length) return data;
  } catch {
    // Fall through to local fallback.
  }
  return TESTIMONIALS.map((item, index) => ({
    id: item.id, created_at: "", name: item.name, role: item.role, company: null, content: item.content,
    rating: item.rating, avatar_url: item.avatar, is_active: true, display_order: index + 1,
  }));
}

export async function getAllTestimonials(): Promise<DbTestimonial[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
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
    if (data?.length) return data;
  } catch {
    // Fall through to local fallback.
  }
  return FAQS.slice(0, limit).map((item, index) => ({
    id: `fallback-faq-${index + 1}`, created_at: "", question: item.question, answer: item.answer,
    category: null, display_order: index + 1, is_active: true,
  }));
}

export async function getAllFaqs(): Promise<DbFaq[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order");
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

export async function getAllSiteSettings(): Promise<DbSiteSetting[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("site_settings")
      .select("*")
      .order("group_name")
      .order("key");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getNavItems(): Promise<DbNavigationItem[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("navigation_items")
      .select("*")
      .eq("is_active", true)
      .order("display_order");
    return data ?? [];
  } catch {
    return [];
  }
}
