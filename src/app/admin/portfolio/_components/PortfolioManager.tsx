"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DbPortfolioItem } from "@/types";

type ItemForm = Omit<DbPortfolioItem, "id" | "created_at" | "updated_at">;

const BLANK: ItemForm = {
  title: "",
  category: "",
  description: "",
  tags: [],
  image_url: null,
  live_url: null,
  github_url: null,
  is_featured: false,
  is_active: true,
  display_order: 0,
};

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-2xl border shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-background z-10">
          <h2 className="font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function ItemForm({ initial, onSave, onCancel, saving, error }: {
  initial: ItemForm; onSave: (d: ItemForm) => void; onCancel: () => void; saving: boolean; error: string;
}) {
  const [form, setForm] = useState(initial);
  function set<K extends keyof ItemForm>(k: K, v: ItemForm[K]) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-sm">Title *</label>
          <input required value={form.title} onChange={e => set("title", e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="label-sm">Category *</label>
          <input required value={form.category} onChange={e => set("category", e.target.value)} className="admin-input" placeholder="SaaS · FinTech" />
        </div>
      </div>

      <div>
        <label className="label-sm">Description *</label>
        <textarea required value={form.description} onChange={e => set("description", e.target.value)} className="admin-input min-h-[80px] resize-y" />
      </div>

      <div>
        <label className="label-sm">Tags (comma-separated)</label>
        <input
          value={form.tags.join(", ")}
          onChange={e => set("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
          className="admin-input"
          placeholder="Next.js, Supabase, TypeScript"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="label-sm">Image URL</label>
          <input type="url" value={form.image_url ?? ""} onChange={e => set("image_url", e.target.value || null)} className="admin-input" placeholder="https://…" />
        </div>
        <div>
          <label className="label-sm">Live URL</label>
          <input type="url" value={form.live_url ?? ""} onChange={e => set("live_url", e.target.value || null)} className="admin-input" placeholder="https://…" />
        </div>
        <div>
          <label className="label-sm">GitHub URL</label>
          <input type="url" value={form.github_url ?? ""} onChange={e => set("github_url", e.target.value || null)} className="admin-input" placeholder="https://github.com/…" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-sm">Display Order</label>
          <input type="number" value={form.display_order} onChange={e => set("display_order", parseInt(e.target.value) || 0)} className="admin-input" />
        </div>
      </div>

      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_featured} onChange={e => set("is_featured", e.target.checked)} className="rounded" />
          Featured (homepage)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} className="rounded" />
          Active
        </label>
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5">{error}</p>}

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="admin-btn-primary">{saving ? "Saving…" : "Save Project"}</button>
        <button type="button" onClick={onCancel} className="admin-btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default function PortfolioManager({ initialItems }: { initialItems: DbPortfolioItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [modal, setModal] = useState<"create" | { item: DbPortfolioItem } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(data: ItemForm) {
    setError(""); setSaving(true);
    try {
      const isEdit = modal !== "create" && modal !== null;
      const url = isEdit ? `/api/admin/portfolio/${modal.item.id}` : "/api/admin/portfolio";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to save."); return; }
      setModal(null);
      const listRes = await fetch("/api/admin/portfolio");
      if (listRes.ok) setItems(await listRes.json());
      router.refresh();
    } catch { setError("Network error."); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/admin/portfolio/${id}`, { method: "DELETE" });
    if (res.ok) { setItems(i => i.filter(x => x.id !== id)); router.refresh(); }
  }

  async function toggleActive(item: DbPortfolioItem) {
    const res = await fetch(`/api/admin/portfolio/${item.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !item.is_active }) });
    if (res.ok) setItems(i => i.map(x => x.id === item.id ? { ...x, is_active: !x.is_active } : x));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{items.length} project{items.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setModal("create")} className="admin-btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Project
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden bg-background">
        {items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No projects yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Featured</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{item.category}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {item.is_featured && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", item.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-secondary text-muted-foreground")}>
                      {item.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleActive(item)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title={item.is_active ? "Hide" : "Show"}>
                        {item.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => setModal({ item })} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
        <Modal title={modal === "create" ? "Add Project" : "Edit Project"} onClose={() => { setModal(null); setError(""); }}>
          <ItemForm
            initial={modal === "create" ? BLANK : { title: modal.item.title, category: modal.item.category, description: modal.item.description, tags: modal.item.tags, image_url: modal.item.image_url, live_url: modal.item.live_url, github_url: modal.item.github_url, is_featured: modal.item.is_featured, is_active: modal.item.is_active, display_order: modal.item.display_order }}
            onSave={handleSave} onCancel={() => { setModal(null); setError(""); }} saving={saving} error={error}
          />
        </Modal>
      )}
    </div>
  );
}
