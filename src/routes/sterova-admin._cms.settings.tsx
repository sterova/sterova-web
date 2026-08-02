import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, TriangleAlert } from "lucide-react";
import {
  AdminCard,
  AdminCardHeader,
  AdminError,
  AdminLoading,
  AdminPageHeading,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { adminFetchSiteSettings, adminSaveSettings } from "@/lib/settings-api";
import { recordAudit } from "@/lib/cms-api";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type {
  CompanySettings,
  FeatureSettings,
  SiteSettingsMap,
  WebsiteSettings,
} from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/settings")({
  head: () => privateSeo("Settings · CMS"),
  component: () => <AdminSettingsPage />,
});

const COMPANY_FIELDS: { key: keyof CompanySettings; label: string; placeholder?: string }[] = [
  { key: "legal_name", label: "Legal name", placeholder: "Sterova Technologies" },
  { key: "tagline", label: "Tagline" },
  { key: "founded_year", label: "Founded" },
  { key: "registration_no", label: "Registration no." },
  { key: "gst_no", label: "GST / VAT no." },
  { key: "support_email", label: "Support email" },
  { key: "sales_email", label: "Sales email" },
  { key: "phone", label: "Phone" },
  { key: "working_hours", label: "Working hours" },
];

const FEATURE_FIELDS: { key: keyof FeatureSettings; label: string; hint: string }[] = [
  { key: "chatbot", label: "Chat assistant", hint: "Show the floating chatbot launcher" },
  { key: "estimator", label: "Project estimator", hint: "Enable the /estimate calculator" },
  { key: "reviews", label: "Reviews", hint: "Accept and display client reviews" },
  { key: "blog", label: "Blog", hint: "Surface blog links across the site" },
  { key: "careers", label: "Careers", hint: "Show open roles and accept applications" },
];

function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "site-settings"],
    queryFn: adminFetchSiteSettings,
    retry: false,
  });

  const [company, setCompany] = useState<CompanySettings>({});
  const [website, setWebsite] = useState<WebsiteSettings>({});
  const [features, setFeatures] = useState<FeatureSettings>({});

  useEffect(() => {
    if (!data) return;
    setCompany(data.company);
    setWebsite(data.website);
    setFeatures(data.features);
  }, [data]);

  const save = useMutation({
    mutationFn: async (group: keyof SiteSettingsMap) => {
      const value = group === "company" ? company : group === "website" ? website : features;
      await adminSaveSettings(group, value as never);
      await recordAudit({ action: "update", entity: "site_settings", entity_id: group });
      return group;
    },
    onSuccess: (group) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "site-settings"] });
      void queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: `${group[0].toUpperCase()}${group.slice(1)} settings saved` });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save settings", description: err.message, variant: "destructive" }),
  });

  const saving = save.isPending;

  return (
    <>
      <AdminPageHeading
        eyebrow="Configuration"
        title="Settings"
        description="Company details, website behaviour, maintenance mode and feature toggles."
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : isLoading ? (
        <AdminLoading label="Loading settings…" />
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <AdminCard>
            <AdminCardHeader
              title="Company"
              description="Used across contracts and contact blocks"
            />
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              {COMPANY_FIELDS.map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label htmlFor={`company-${field.key}`}>{field.label}</Label>
                  <Input
                    id={`company-${field.key}`}
                    value={company[field.key] ?? ""}
                    placeholder={field.placeholder}
                    onChange={(e) => setCompany({ ...company, [field.key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="company-address">Address</Label>
                <Textarea
                  id="company-address"
                  rows={2}
                  value={company.address ?? ""}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end border-t border-border/70 px-5 py-3">
              <Button size="sm" disabled={saving} onClick={() => save.mutate("company")}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save company
              </Button>
            </div>
          </AdminCard>

          <AdminCard>
            <AdminCardHeader
              title="Website"
              description="Maintenance mode, announcement bar and default metadata"
            />
            <div className="space-y-4 p-5">
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-muted/30 p-4">
                <TriangleAlert
                  className="mt-0.5 h-4 w-4 shrink-0 text-amber-500"
                  aria-hidden="true"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Maintenance mode</p>
                  <p className="text-xs text-muted-foreground">
                    Visitors see a maintenance screen. The CMS stays reachable.
                  </p>
                </div>
                <Switch
                  checked={Boolean(website.maintenance_mode)}
                  onCheckedChange={(checked) =>
                    setWebsite({ ...website, maintenance_mode: checked })
                  }
                  aria-label="Toggle maintenance mode"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="maintenance-message">Maintenance message</Label>
                <Textarea
                  id="maintenance-message"
                  rows={2}
                  value={website.maintenance_message ?? ""}
                  onChange={(e) => setWebsite({ ...website, maintenance_message: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="announcement">Announcement bar</Label>
                <Input
                  id="announcement"
                  value={website.announcement ?? ""}
                  placeholder="Leave empty to hide"
                  onChange={(e) => setWebsite({ ...website, announcement: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meta-title">Default meta title</Label>
                <Input
                  id="meta-title"
                  value={website.default_meta_title ?? ""}
                  onChange={(e) => setWebsite({ ...website, default_meta_title: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="meta-description">Default meta description</Label>
                <Textarea
                  id="meta-description"
                  rows={2}
                  value={website.default_meta_description ?? ""}
                  onChange={(e) =>
                    setWebsite({ ...website, default_meta_description: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex justify-end border-t border-border/70 px-5 py-3">
              <Button size="sm" disabled={saving} onClick={() => save.mutate("website")}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save website
              </Button>
            </div>
          </AdminCard>

          <AdminCard className="xl:col-span-2">
            <AdminCardHeader
              title="Feature toggles"
              description="Switch whole surfaces of the public site on or off"
            />
            <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
              {FEATURE_FIELDS.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{field.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{field.hint}</p>
                  </div>
                  <Switch
                    checked={features[field.key] !== false}
                    onCheckedChange={(checked) =>
                      setFeatures({ ...features, [field.key]: checked })
                    }
                    aria-label={`Toggle ${field.label}`}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end border-t border-border/70 px-5 py-3">
              <Button size="sm" disabled={saving} onClick={() => save.mutate("features")}>
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save features
              </Button>
            </div>
          </AdminCard>
        </div>
      )}
    </>
  );
}
