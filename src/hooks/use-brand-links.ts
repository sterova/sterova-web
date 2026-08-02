import { useQuery } from "@tanstack/react-query";
import { fetchBrandLinks } from "@/lib/api";
import { isSupabaseConfigured } from "@/lib/supabase";
import { SITE, SOCIAL_LINKS } from "@/data/constants";
import { getWhatsAppUrl } from "@/lib/utils";
import type { BrandLinkRow, BrandLinkCategory } from "@/types/database";

// ─────────────────────────────────────────────────────────────────────────────
// Static fallbacks — built from the same constants the site used before Supabase
// ─────────────────────────────────────────────────────────────────────────────

const STATIC_SOCIAL: BrandLinkRow[] = SOCIAL_LINKS.map((s, i) => ({
  id: `static-social-${s.key}`,
  category: "social" as const,
  key: s.key,
  label: s.label,
  value: s.handle,
  href: s.href,
  description: null,
  icon_key: s.key,
  display_order: i,
  is_active: true,
  created_at: "",
  updated_at: "",
}));

const waUrl = getWhatsAppUrl(SITE.whatsapp);

const STATIC_CONTACT: BrandLinkRow[] = [
  {
    id: "static-contact-email",
    category: "contact",
    key: "email",
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    description: null,
    icon_key: "mail",
    display_order: 0,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  {
    id: "static-contact-whatsapp",
    category: "contact",
    key: "whatsapp",
    label: "WhatsApp",
    value: SITE.whatsappDisplay,
    href: waUrl,
    description: null,
    icon_key: "message-circle",
    display_order: 1,
    is_active: true,
    created_at: "",
    updated_at: "",
  },
  ...(SITE.phone
    ? [
        {
          id: "static-contact-phone",
          category: "contact" as const,
          key: "phone",
          label: "Phone",
          value: SITE.phone,
          href: `tel:${SITE.phone.replace(/\s/g, "")}`,
          description: null,
          icon_key: "phone",
          display_order: 2,
          is_active: true,
          created_at: "",
          updated_at: "",
        },
      ]
    : []),
];

const STATIC_ALL = [...STATIC_CONTACT, ...STATIC_SOCIAL];

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export interface GroupedBrandLinks {
  all: BrandLinkRow[];
  social: BrandLinkRow[];
  contact: BrandLinkRow[];
  isLoading: boolean;
  /** The contact details helper values derived from the contact links. */
  email: string;
  whatsapp: string;
  whatsappDisplay: string;
  whatsappHref: string;
  phone: string | null;
  address: string | null;
}

function group(links: BrandLinkRow[]): Record<BrandLinkCategory, BrandLinkRow[]> {
  const out: Record<BrandLinkCategory, BrandLinkRow[]> = {
    social: [],
    contact: [],
  };
  for (const link of links) {
    if (out[link.category]) {
      out[link.category].push(link);
    }
  }
  return out;
}

/**
 * Fetches brand links from Supabase and groups them by category.
 * Falls back to the static constants when Supabase is unavailable.
 */
export function useBrandLinks(): GroupedBrandLinks {
  const { data, isLoading } = useQuery({
    queryKey: ["brand-links"],
    queryFn: fetchBrandLinks,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000,
    enabled: isSupabaseConfigured,
    retry: 1,
  });

  const links = data ?? STATIC_ALL;
  const grouped = group(links);

  const emailLink = grouped.contact.find((l) => l.key === "email");
  const waLink = grouped.contact.find((l) => l.key === "whatsapp");
  const phoneLink = grouped.contact.find((l) => l.key === "phone");
  const addressLink = grouped.contact.find((l) => l.key === "address");

  return {
    all: links,
    social: grouped.social,
    contact: grouped.contact,
    isLoading: isLoading && !data,
    email: emailLink?.value ?? SITE.email,
    whatsapp: waLink?.value?.replace(/\s/g, "") ?? SITE.whatsapp,
    whatsappDisplay: waLink?.value ?? SITE.whatsappDisplay,
    whatsappHref: waLink?.href ?? waUrl,
    phone: phoneLink?.value ?? SITE.phone ?? null,
    address: addressLink?.value ?? (SITE.address || null),
  };
}
