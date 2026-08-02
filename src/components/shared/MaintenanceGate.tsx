import type { ReactNode } from "react";
import { Wrench } from "lucide-react";

import { useSiteSettings } from "@/hooks/use-site-settings";
import { DEFAULT_SETTINGS } from "@/lib/settings-api";
import { SITE } from "@/data/constants";
import BrandLogo from "@/components/shared/BrandLogo";

/**
 * Renders the maintenance screen for public visitors when an admin has flipped
 * the maintenance toggle in Settings. The CMS (/sterova-admin) never mounts
 * this gate, so the team can always turn it back off.
 */
export default function MaintenanceGate({ children }: { children: ReactNode }) {
  const { website } = useSiteSettings();

  if (!website.maintenance_mode) return <>{children}</>;

  const message =
    website.maintenance_message?.trim() || DEFAULT_SETTINGS.website.maintenance_message;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <BrandLogo size={40} priority />
      <div className="flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-card/70 backdrop-blur">
        <Wrench className="size-6 text-primary" aria-hidden="true" />
      </div>
      <div className="max-w-md space-y-3">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          We&apos;ll be right back
        </h1>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      <p className="text-xs text-muted-foreground">
        {SITE.name} — {SITE.tagline}
      </p>
    </div>
  );
}
