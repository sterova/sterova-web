import { supabase } from "@/lib/supabase";
import type {
  CompanySettings,
  FeatureSettings,
  SettingsKey,
  SiteSettingRow,
  SiteSettingsMap,
  WebsiteSettings,
} from "@/types/database";

/**
 * Site settings live as three JSON rows in `public.site_settings`
 * (see sql/0009_phase2.sql). Reads are public — the marketing site needs the
 * maintenance flag and feature toggles — while writes are admin-only via RLS.
 */

export const MISSING_PHASE2_HINT =
  "Settings tables are not created yet. Run sql/0009_phase2.sql in the Supabase SQL editor.";

export function isMissingTable(message: string): boolean {
  return /could not find the table|relation .* does not exist|schema cache/i.test(message);
}

export function phase2Error(message: string): Error {
  return new Error(isMissingTable(message) ? MISSING_PHASE2_HINT : message);
}

export const DEFAULT_SETTINGS: SiteSettingsMap = {
  company: {},
  website: {
    maintenance_mode: false,
    maintenance_message: "Sterova is undergoing scheduled maintenance. We will be back shortly.",
  },
  features: {
    chatbot: true,
    estimator: true,
    reviews: true,
    blog: true,
    careers: true,
    portfolio: true,
    process: true,
    technologies: true,
    faq: true,
  },
};

/** Public read. Never throws — the site must render even without the tables. */
export async function fetchSiteSettings(): Promise<SiteSettingsMap> {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error || !data) return DEFAULT_SETTINGS;
  const rows = data as SiteSettingRow[];
  const pick = <K extends SettingsKey>(key: K) =>
    ({
      ...DEFAULT_SETTINGS[key],
      ...(rows.find((r) => r.key === key)?.value ?? {}),
    }) as SiteSettingsMap[K];
  return {
    company: pick("company") as CompanySettings,
    website: pick("website") as WebsiteSettings,
    features: pick("features") as FeatureSettings,
  };
}

/** Admin read — surfaces a setup hint when the migration has not been run. */
export async function adminFetchSiteSettings(): Promise<SiteSettingsMap> {
  const { data, error } = await supabase.from("site_settings").select("*");
  if (error) throw phase2Error(error.message);
  const rows = (data ?? []) as SiteSettingRow[];
  return {
    company: {
      ...DEFAULT_SETTINGS.company,
      ...(rows.find((r) => r.key === "company")?.value ?? {}),
    },
    website: {
      ...DEFAULT_SETTINGS.website,
      ...(rows.find((r) => r.key === "website")?.value ?? {}),
    },
    features: {
      ...DEFAULT_SETTINGS.features,
      ...(rows.find((r) => r.key === "features")?.value ?? {}),
    },
  };
}

export async function adminSaveSettings<K extends SettingsKey>(
  key: K,
  value: SiteSettingsMap[K],
): Promise<void> {
  const { error } = await supabase
    .from("site_settings")
    .upsert({ key, value: value as Record<string, unknown> }, { onConflict: "key" });
  if (error) throw phase2Error(error.message);
}
