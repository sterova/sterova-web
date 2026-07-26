"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DbFaq } from "@/types";

type Form = Omit<DbFaq, "id" | "created_at">;

const BLANK: Form = { question: "", answer: "", category: null, display_order: 0, is_active: true };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-background rounded-2xl border shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-background z-10">
          <h2 className="font-semibold text-base">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xl leading-none">×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function FaqForm({ initial, onSave, onCancel, saving, error }: { initial: Form; onSave: (d: Form) => void; onCancel: () => void; saving: boolean; error: string }) {
  const [form, setForm] = useState(initial);
  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="label-sm">Question *</label>
        <input required value={form.question} onChange={e => set("question", e.target.value)} className="admin-input" />
      </div>
      <div>
        <label className="label-sm">Answer *</label>
        <textarea required value={form.answer} onChange={e => set("answer", e.target.value)} className="admin-input min-h-[100px] resize-y" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-sm">Category</label>
          <input value={form.category ?? ""} onChange={e => set("category", e.target.value || null)} className="admin-input" placeholder="General, Pricing…" />
        </div>
        <div>
          <label className="label-sm">Display Order</label>
          <input type="number" value={form.display_order} onChange={e => set("display_order", parseInt(e.target.value) || 0)} className="admin-input" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.is_active} onChange={e => set("is_active", e.target.checked)} className="rounded" />
        Active (visible on site)
      </label>
      {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="admin-btn-primary">{saving ? "Saving…" : "Save FAQ"}</button>
        <button type="button" onClick={onCancel} className="admin-btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default function FaqsManager({ initialFaqs }: { initialFaqs: DbFaq[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState(initialFaqs);
  const [modal, setModal] = useState<"create" | { faq: DbFaq } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(data: Form) {
    setError(""); setSaving(true);
    try {
      const isEdit = modal !== "create" && modal !== null;
      const url = isEdit ? `/api/admin/faqs/${modal.faq.id}` : "/api/admin/faqs";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to save."); return; }
      setModal(null);
      const listRes = await fetch("/api/admin/faqs");
      if (listRes.ok) setFaqs(await listRes.json());
      router.refresh();
    } catch { setError("Network error."); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    if (res.ok) { setFaqs(f => f.filter(x => x.id !== id)); router.refresh(); }
  }

  async function toggleActive(faq: DbFaq) {
    const res = await fetch(`/api/admin/faqs/${faq.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active: !faq.is_active }) });
    if (res.ok) setFaqs(f => f.map(x => x.id === faq.id ? { ...x, is_active: !x.is_active } : x));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">FAQs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{faqs.length} FAQ{faqs.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setModal("create")} className="admin-btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add FAQ
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden bg-background">
        {faqs.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No FAQs yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Question</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Order</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {faqs.map(faq => (
                <tr key={faq.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs">
                    <p className="line-clamp-2">{faq.question}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{faq.category ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{faq.display_order}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", faq.is_active ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-secondary text-muted-foreground")}>
                      {faq.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => toggleActive(faq)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                        {faq.is_active ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => setModal({ faq })} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(faq.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
        <Modal title={modal === "create" ? "Add FAQ" : "Edit FAQ"} onClose={() => { setModal(null); setError(""); }}>
          <FaqForm
            initial={modal === "create" ? BLANK : { question: modal.faq.question, answer: modal.faq.answer, category: modal.faq.category, display_order: modal.faq.display_order, is_active: modal.faq.is_active }}
            onSave={handleSave} onCancel={() => { setModal(null); setError(""); }} saving={saving} error={error}
          />
        </Modal>
      )}
    </div>
  );
}
