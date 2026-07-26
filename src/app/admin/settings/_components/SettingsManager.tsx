"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, CheckCircle2 } from "lucide-react";
import type { DbSiteSetting } from "@/types";

function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
  return items.reduce((acc, item) => {
    const group = String(item[key] ?? "other");
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export default function SettingsManager({ initialSettings }: { initialSettings: DbSiteSetting[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(initialSettings.map((s) => [s.key, s.value]))
  );
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState("");

  const groups = groupBy(initialSettings, "group_name");

  async function handleSaveAll() {
    setError("");
    setSaving("all");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings: Object.entries(values).map(([key, value]) => ({ key, value })) }),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to save.");
        return;
      }
      setSaved("all");
      setTimeout(() => setSaved(null), 2000);
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setSaving(null);
    }
  }

  const GROUP_LABELS: Record<string, string> = {
    hero: "Hero Section",
    contact: "Contact Information",
    social: "Social Media",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Site Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All editable site-wide content
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving === "all"}
          className="admin-btn-primary flex items-center gap-2"
        >
          {saved === "all" ? (
            <><CheckCircle2 className="h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> {saving === "all" ? "Saving…" : "Save All"}</>
          )}
        </button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5 mb-4">{error}</p>
      )}

      <div className="space-y-8">
        {Object.entries(groups).map(([group, settings]) => (
          <div key={group} className="rounded-2xl border bg-background overflow-hidden">
            <div className="px-5 py-4 border-b bg-secondary/20">
              <h2 className="font-semibold text-sm">
                {GROUP_LABELS[group] ?? group.charAt(0).toUpperCase() + group.slice(1)}
              </h2>
            </div>
            <div className="p-5 space-y-4">
              {settings.map((setting) => (
                <div key={setting.key}>
                  <label className="label-sm">
                    {setting.label ?? setting.key}
                  </label>
                  {setting.description && (
                    <p className="text-xs text-muted-foreground mb-1.5">{setting.description}</p>
                  )}
                  {setting.type === "textarea" || setting.type === "json" ? (
                    <textarea
                      value={values[setting.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [setting.key]: e.target.value }))}
                      className="admin-input min-h-[80px] resize-y font-mono text-xs"
                      rows={setting.type === "json" ? 4 : 3}
                    />
                  ) : (
                    <input
                      type={setting.type === "email" ? "email" : setting.type === "url" ? "url" : "text"}
                      value={values[setting.key] ?? ""}
                      onChange={(e) => setValues((v) => ({ ...v, [setting.key]: e.target.value }))}
                      className="admin-input"
                    />
                  )}
                  <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{setting.key}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
