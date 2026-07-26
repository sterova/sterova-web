"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

type Form = {
  title: string; slug: string; excerpt: string; content: string;
  category: string; author_name: string; cover_image_url: string | null;
  tags: string[]; published: boolean; read_time_minutes: number;
};

const BLANK: Form = {
  title: "", slug: "", excerpt: "", content: "", category: "Engineering",
  author_name: "Sterova Team", cover_image_url: null, tags: [],
  published: false, read_time_minutes: 5,
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

function PostForm({ initial, onSave, onCancel, saving, error }: { initial: Form; onSave: (d: Form) => void; onCancel: () => void; saving: boolean; error: string }) {
  const [form, setForm] = useState(initial);
  function set<K extends keyof Form>(k: K, v: Form[K]) { setForm(f => ({ ...f, [k]: v })); }

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form); }} className="space-y-4">
      <div>
        <label className="label-sm">Title *</label>
        <input required value={form.title} onChange={e => { set("title", e.target.value); if (!form.slug) set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); }} className="admin-input" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-sm">Slug *</label>
          <input required value={form.slug} onChange={e => set("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} className="admin-input font-mono text-xs" />
        </div>
        <div>
          <label className="label-sm">Category *</label>
          <input required value={form.category} onChange={e => set("category", e.target.value)} className="admin-input" placeholder="Engineering" />
        </div>
      </div>
      <div>
        <label className="label-sm">Excerpt *</label>
        <textarea required value={form.excerpt} onChange={e => set("excerpt", e.target.value)} className="admin-input min-h-[60px] resize-y" maxLength={1000} />
      </div>
      <div>
        <label className="label-sm">Content (Markdown / HTML) *</label>
        <textarea required value={form.content} onChange={e => set("content", e.target.value)} className="admin-input min-h-[200px] resize-y font-mono text-xs" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-sm">Author Name *</label>
          <input required value={form.author_name} onChange={e => set("author_name", e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="label-sm">Read Time (min)</label>
          <input type="number" min={1} value={form.read_time_minutes} onChange={e => set("read_time_minutes", parseInt(e.target.value) || 5)} className="admin-input" />
        </div>
      </div>
      <div>
        <label className="label-sm">Cover Image URL</label>
        <input type="url" value={form.cover_image_url ?? ""} onChange={e => set("cover_image_url", e.target.value || null)} className="admin-input" placeholder="https://…" />
      </div>
      <div>
        <label className="label-sm">Tags (comma-separated)</label>
        <input value={form.tags.join(", ")} onChange={e => set("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} className="admin-input" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} className="rounded" />
        Published (visible on site)
      </label>
      {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5">{error}</p>}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving} className="admin-btn-primary">{saving ? "Saving…" : "Save Post"}</button>
        <button type="button" onClick={onCancel} className="admin-btn-secondary">Cancel</button>
      </div>
    </form>
  );
}

export default function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [modal, setModal] = useState<"create" | { post: BlogPost } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave(data: Form) {
    setError(""); setSaving(true);
    try {
      const isEdit = modal !== "create" && modal !== null;
      const url = isEdit ? `/api/admin/blog/${modal.post.id}` : "/api/admin/blog";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Failed to save."); return; }
      setModal(null);
      const listRes = await fetch("/api/admin/blog");
      if (listRes.ok) setPosts(await listRes.json());
      router.refresh();
    } catch { setError("Network error."); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (res.ok) { setPosts(p => p.filter(x => x.id !== id)); router.refresh(); }
  }

  async function togglePublish(post: BlogPost) {
    const res = await fetch(`/api/admin/blog/${post.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !post.published, published_at: !post.published ? new Date().toISOString() : post.published_at }) });
    if (res.ok) setPosts(p => p.map(x => x.id === post.id ? { ...x, published: !x.published } : x));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Blog Posts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{posts.filter(p => p.published).length} published · {posts.length} total</p>
        </div>
        <button onClick={() => setModal("create")} className="admin-btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden bg-background">
        {posts.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground text-sm">No posts yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-xs">
                    <p className="line-clamp-1">{post.title}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{post.category}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell whitespace-nowrap">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", post.published ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-secondary text-muted-foreground")}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => togglePublish(post)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors" title={post.published ? "Unpublish" : "Publish"}>
                        {post.published ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      </button>
                      <button onClick={() => setModal({ post })} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
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
        <Modal title={modal === "create" ? "New Blog Post" : "Edit Post"} onClose={() => { setModal(null); setError(""); }}>
          <PostForm
            initial={modal === "create" ? BLANK : { title: modal.post.title, slug: modal.post.slug, excerpt: modal.post.excerpt, content: modal.post.content, category: modal.post.category, author_name: modal.post.author_name, cover_image_url: modal.post.cover_image_url, tags: modal.post.tags, published: modal.post.published, read_time_minutes: modal.post.read_time_minutes ?? 5 }}
            onSave={handleSave} onCancel={() => { setModal(null); setError(""); }} saving={saving} error={error}
          />
        </Modal>
      )}
    </div>
  );
}
