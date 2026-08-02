import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Star, Trash2 } from "lucide-react";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeading,
  AdminRow,
  AdminSearch,
  AdminTable,
  AdminTableSkeleton,
  AdminToolbar,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminCreateTestimonial,
  adminDeleteTestimonial,
  adminFetchTestimonials,
  adminUpdateTestimonial,
  recordAudit,
} from "@/lib/cms-api";
import { exportToCsv } from "@/lib/export";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { TestimonialRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/testimonials")({
  head: () => privateSeo("Testimonials · CMS"),
  component: () => <TestimonialsPage />,
});

type Filter = "all" | "published" | "draft" | "featured";
type Draft = {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar_url: string;
  is_published: boolean;
  is_featured: boolean;
  display_order: number;
};

const EMPTY: Draft = {
  name: "",
  role: "",
  company: "",
  content: "",
  rating: 5,
  avatar_url: "",
  is_published: true,
  is_featured: false,
  display_order: 0,
};

function TestimonialsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editing, setEditing] = useState<TestimonialRow | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [open, setOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "testimonials"],
    queryFn: adminFetchTestimonials,
    retry: false,
  });

  const rows = useMemo(() => {
    const list = data ?? [];
    const term = search.trim().toLowerCase();
    return list.filter((row) => {
      if (filter === "published" && !row.is_published) return false;
      if (filter === "draft" && row.is_published) return false;
      if (filter === "featured" && !row.is_featured) return false;
      if (!term) return true;
      return [row.name, row.company, row.role, row.content]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [data, filter, search]);

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "testimonials"] });
    void queryClient.invalidateQueries({ queryKey: ["testimonials"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...draft,
        role: draft.role || null,
        company: draft.company || null,
        avatar_url: draft.avatar_url || null,
      };
      if (editing) {
        await adminUpdateTestimonial(editing.id, payload);
        await recordAudit({
          action: "update",
          entity: "testimonials",
          entity_id: editing.id,
          summary: draft.name,
        });
      } else {
        await adminCreateTestimonial(payload);
        await recordAudit({ action: "create", entity: "testimonials", summary: draft.name });
      }
    },
    onSuccess: () => {
      invalidate();
      setOpen(false);
      toast({ title: editing ? "Testimonial updated" : "Testimonial added" });
    },
    onError: (err: Error) =>
      toast({ title: "Save failed", description: err.message, variant: "destructive" }),
  });

  const toggle = useMutation({
    mutationFn: async (input: { row: TestimonialRow; patch: Partial<TestimonialRow> }) => {
      await adminUpdateTestimonial(input.row.id, input.patch);
    },
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: async (row: TestimonialRow) => {
      await adminDeleteTestimonial(row.id);
      await recordAudit({
        action: "delete",
        entity: "testimonials",
        entity_id: row.id,
        summary: row.name,
      });
    },
    onSuccess: () => {
      invalidate();
      toast({ title: "Testimonial deleted" });
    },
    onError: (err: Error) =>
      toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  const startCreate = () => {
    setEditing(null);
    setDraft({ ...EMPTY, display_order: (data?.length ?? 0) + 1 });
    setOpen(true);
  };

  const startEdit = (row: TestimonialRow) => {
    setEditing(row);
    setDraft({
      name: row.name,
      role: row.role ?? "",
      company: row.company ?? "",
      content: row.content,
      rating: row.rating,
      avatar_url: row.avatar_url ?? "",
      is_published: row.is_published,
      is_featured: row.is_featured,
      display_order: row.display_order,
    });
    setOpen(true);
  };

  return (
    <>
      <AdminPageHeading
        eyebrow="Social proof"
        title="Testimonials"
        description="Curate the client quotes shown across the marketing site."
        actions={
          <Button size="sm" onClick={startCreate}>
            <Plus className="h-4 w-4" />
            New testimonial
          </Button>
        }
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : (
        <AdminCard>
          <AdminToolbar>
            <AdminSearch value={search} onChange={setSearch} placeholder="Search testimonials…" />
            <AdminFilterTabs
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All", count: data?.length },
                {
                  value: "published",
                  label: "Published",
                  count: data?.filter((r) => r.is_published).length,
                },
                {
                  value: "draft",
                  label: "Draft",
                  count: data?.filter((r) => !r.is_published).length,
                },
                {
                  value: "featured",
                  label: "Featured",
                  count: data?.filter((r) => r.is_featured).length,
                },
              ]}
            />
            <Button
              size="sm"
              variant="outline"
              className="ml-auto"
              disabled={!rows.length}
              onClick={() =>
                exportToCsv("testimonials", rows, [
                  { header: "Name", value: (r) => r.name },
                  { header: "Role", value: (r) => r.role ?? "" },
                  { header: "Company", value: (r) => r.company ?? "" },
                  { header: "Rating", value: (r) => r.rating },
                  { header: "Published", value: (r) => (r.is_published ? "yes" : "no") },
                  { header: "Content", value: (r) => r.content },
                  { header: "Created", value: (r) => r.created_at },
                ])
              }
            >
              Export CSV
            </Button>
          </AdminToolbar>

          {isLoading ? (
            <AdminTableSkeleton cols={5} />
          ) : rows.length === 0 ? (
            <AdminEmpty
              title="No testimonials yet"
              description="Add your first client quote to display it on the site."
            />
          ) : (
            <AdminTable
              head={
                <>
                  <th>Client</th>
                  <th>Quote</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </>
              }
            >
              {rows.map((row) => (
                <AdminRow key={row.id}>
                  <td>
                    <button
                      type="button"
                      onClick={() => startEdit(row)}
                      className="text-left font-medium hover:underline"
                    >
                      {row.name}
                    </button>
                    <p className="text-xs text-muted-foreground">
                      {[row.role, row.company].filter(Boolean).join(" · ") || "—"}
                    </p>
                    <p className="text-[0.7rem] text-muted-foreground">
                      {formatDate(row.created_at)}
                    </p>
                  </td>
                  <td className="max-w-md">
                    <p className="line-clamp-2 text-sm text-muted-foreground">{row.content}</p>
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-sm tabular-nums">
                      <Star
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                        aria-hidden="true"
                      />
                      {row.rating}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <StatusBadge status={row.is_published ? "published" : "draft"} />
                      {row.is_featured && <StatusBadge status="featured" />}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Switch
                        checked={row.is_published}
                        aria-label={`Toggle published for ${row.name}`}
                        onCheckedChange={(checked) =>
                          toggle.mutate({ row, patch: { is_published: checked } })
                        }
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${row.name}`}
                        onClick={() => remove.mutate(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </AdminRow>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit testimonial" : "New testimonial"}</DialogTitle>
            <DialogDescription>
              Quotes marked as published appear on the public site.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="t-name">Name</Label>
              <Input
                id="t-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-role">Role</Label>
              <Input
                id="t-role"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-company">Company</Label>
              <Input
                id="t-company"
                value={draft.company}
                onChange={(e) => setDraft({ ...draft, company: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-rating">Rating (1–5)</Label>
              <Input
                id="t-rating"
                type="number"
                min={1}
                max={5}
                value={draft.rating}
                onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="t-content">Quote</Label>
              <Textarea
                id="t-content"
                rows={4}
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-avatar">Avatar URL</Label>
              <Input
                id="t-avatar"
                value={draft.avatar_url}
                onChange={(e) => setDraft({ ...draft, avatar_url: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-order">Display order</Label>
              <Input
                id="t-order"
                type="number"
                value={draft.display_order}
                onChange={(e) => setDraft({ ...draft, display_order: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center gap-3 sm:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={draft.is_published}
                  onCheckedChange={(checked) => setDraft({ ...draft, is_published: checked })}
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch
                  checked={draft.is_featured}
                  onCheckedChange={(checked) => setDraft({ ...draft, is_featured: checked })}
                />
                Featured
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={save.isPending || !draft.name.trim() || !draft.content.trim()}
              onClick={() => save.mutate()}
            >
              {save.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Save changes" : "Add testimonial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
