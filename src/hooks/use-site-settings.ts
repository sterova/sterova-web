import { useQuery } from "@tanstack/react-query";

import { DEFAULT_SETTINGS, fetchSiteSettings } from "@/lib/settings-api";
import type { SiteSettingsMap } from "@/types/database";

/**
 * Public read of the site settings row set (company / website / features).
 * Never throws: the marketing site must render even when the settings table
 * has not been created yet, so failures fall back to the defaults.
 */
export function useSiteSettings(): SiteSettingsMap {
  const { data } = useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return data ?? DEFAULT_SETTINGS;
}

/** Feature toggles default to enabled when settings are unavailable. */
export function useFeatureEnabled(feature: keyof SiteSettingsMap["features"]): boolean {
  const settings = useSiteSettings();
  return settings.features[feature] !== false;
}
