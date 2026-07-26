"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DbService } from "@/types";

type ServiceForm = Omit<DbService, "id" | "created_at" | "updated_at">;

const BLANK: ServiceForm = {
  slug: "",
  title: "",
  short_description: "",
  description: "",
  icon_name: "Code2",
  features: [],
  technologies: [],
  display_order: 0,
  is_active: true,
};

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-2xl border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-background z-10">
          <h2 className="font-semibold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ServiceForm({
  initial,
  onSave,
  onCancel,
  saving,
  error,
}: {
  initial: ServiceForm;
  onSave: (data: ServiceForm) => void;
  onCancel: () => void;
  saving: boolean;
  error: string;
}) {
  const [form, setForm] = useState<ServiceForm>(initial);

  function set<K extends keyof ServiceForm>(key: K, value: ServiceForm[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleArrayChange(key: "features" | "technologies", raw: string) {
    set(key, raw.split("\n").map((l) => l.trim()).filter(Boolean));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
      className="space-y-4"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-sm">Title *</label>
          <input
            required
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            className="admin-input"
            placeholder="Web Development"
          />
        </div>
        <div>
          <label className="label-sm">Slug *</label>
          <input
            required
            value={form.slug}
            onChange={(e) => set("slug", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            className="admin-input"
            placeholder="web-development"
          />
        </div>
      </div>

      <div>
        <label className="label-sm">Short Description *</label>
        <input
          required
          value={form.short_description}
          onChange={(e) => set("short_description", e.target.value)}
          className="admin-input"
          placeholder="One-line description shown on cards"
          maxLength={500}
        />
      </div>

      <div>
        <label className="label-sm">Full Description *</label>
        <textarea
          required
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          className="admin-input min-h-[80px] resize-y"
          placeholder="Detailed description shown on the services page"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-sm">Icon Name</label>
          <input
            value={form.icon_name}
            onChange={(e) => set("icon_name", e.target.value)}
            className="admin-input"
            placeholder="Code2, Globe, Smartphone…"
          />
          <p className="text-xs text-muted-foreground mt-1">Lucide icon name</p>
        </div>
        <div>
          <label className="label-sm">Display Order</label>
          <input
            type="number"
            value={form.display_order}
            onChange={(e) => set("display_order", parseInt(e.target.value) || 0)}
            className="admin-input"
          />
        </div>
      </div>

      <div>
        <label className="label-sm">Features (one per line)</label>
        <textarea
          value={form.features.join("\n")}
          onChange={(e) => handleArrayChange("features", e.target.value)}
          className="admin-input min-h-[100px] resize-y font-mono text-xs"
          placeholder={"Requirements analysis\nFull-stack development\nAPI design"}
        />
      </div>

      <div>
        <label className="label-sm">Technologies (one per line)</label>
        <textarea
          value={form.technologies.join("\n")}
          onChange={(e) => handleArrayChange("technologies", e.target.value)}
          className="admin-input min-h-[80px] resize-y font-mono text-xs"
          placeholder={"Next.js\nTypeScript\nPostgreSQL"}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="is_active"
          checked={form.is_active}
          onChange={(e) => set("is_active", e.target.checked)}
          className="rounded"
        />
        <label htmlFor="is_active" className="text-sm">Active (visible on site)</label>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="admin-btn-primary">
          {saving ? "Saving…" : "Save Service"}
        </button>
        <button type="button" onClick={onCancel} className="admin-btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function ServicesManager({ initialServices }: { initialServices: DbService[] }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [modal, setModal] = useState<"create" | { service: DbService } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(data: ServiceForm) {
    setError("");
    setSaving(true);
    try {
      const isEdit = modal !== "create" && modal !== null;
      const url = isEdit ? `/api/admin/services/${modal.service.id}` : "/api/admin/services";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const d = await res.json();
        setError(d.error ?? "Failed to save.");
        return;
      }
      setModal(null);
      router.refresh();
      // Optimistic: refetch
      const listRes = await fetch("/api/admin/services");
      if (listRes.ok) setServices(await listRes.json());
    } catch {
      setError("Network error.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this service? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) {
      setServices((s) => s.filter((x) => x.id !== id));
      router.refresh();
    }
  }

  async function toggleActive(service: DbService) {
    const res = await fetch(`/api/admin/services/${service.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !service.is_active }),
    });
    if (res.ok) {
      setServices((s) =>
        s.map((x) => (x.id === service.id ? { ...x, is_active: !x.is_active } : x))
      );
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {services.length} service{services.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={() => setModal("create")} className="admin-btn-primary gap-2 flex items-center">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden bg-background">
        {services.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">
            No services yet. Add your first one.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-8"></th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Order</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {services.map((svc) => (
                <tr key={svc.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    <GripVertical className="h-4 w-4 text-muted-foreground/40" />
                  </td>
                  <td className="px-4 py-3 font-medium">{svc.title}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell font-mono text-xs">
                    {svc.slug}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {svc.display_order}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        svc.is_active
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {svc.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(svc)}
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title={svc.is_active ? "Hide" : "Show"}
                      >
                        {svc.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={() => setModal({ service: svc })}
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(svc.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal !== null && (
        <Modal
          title={modal === "create" ? "Add Service" : "Edit Service"}
          onClose={() => { setModal(null); setError(""); }}
        >
          <ServiceForm
            initial={modal === "create" ? BLANK : {
              slug: modal.service.slug,
              title: modal.service.title,
              short_description: modal.service.short_description,
              description: modal.service.description,
              icon_name: modal.service.icon_name,
              features: modal.service.features,
              technologies: modal.service.technologies,
              display_order: modal.service.display_order,
              is_active: modal.service.is_active,
            }}
            onSave={handleSave}
            onCancel={() => { setModal(null); setError(""); }}
            saving={saving}
            error={error}
          />
        </Modal>
      )}
    </div>
  );
}
