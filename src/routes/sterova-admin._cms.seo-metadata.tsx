import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import {
  AdminPageHeading,
  AdminCard,
  AdminTable,
  AdminTableSkeleton,
  AdminEmpty,
  AdminToolbar,
  AdminSearch,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  adminFetchSEOMetadata,
  adminCreateSEOMetadata,
  adminUpdateSEOMetadata,
  adminDeleteSEOMetadata,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { SEOMetadataRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/seo-metadata")({
  head: () => privateSeo("SEO Metadata · CMS"),
  component: () => <AdminSEOMetadataPage />,
});

interface FormState {
  route_path: string;
  title: string;
  description: string;
  keywords: string;
  og_image: string;
}

const EMPTY_FORM: FormState = {
  route_path: "/",
  title: "",
  description: "",
  keywords: "",
  og_image: "",
};

function toForm(meta: SEOMetadataRow): FormState {
  return {
    route_path: meta.route_path,
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords.join(", "),
    og_image: meta.og_image ?? "",
  };
}

function AdminSEOMetadataPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<SEOMetadataRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [pendingDelete, setPendingDelete] = useState<SEOMetadataRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "seo-metadata"],
    queryFn: adminFetchSEOMetadata,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "seo-metadata"] });
    void queryClient.invalidateQueries({ queryKey: ["seo-metadata"] });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (meta: SEOMetadataRow) => {
    setEditing(meta);
    setForm(toForm(meta));
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        route_path: form.route_path.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        keywords: form.keywords
          .split(",")
          .map((k) => k.trim())
          .filter(Boolean),
        og_image: form.og_image.trim() || null,
      };
      return editing
        ? adminUpdateSEOMetadata(editing.id, payload)
        : adminCreateSEOMetadata(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "SEO Metadata updated" : "SEO Metadata created" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save metadata", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteSEOMetadata,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "SEO Metadata deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete metadata",
        description: err.message,
        variant: "destructive",
      }),
  });

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (p) => p.route_path.toLowerCase().includes(term) || p.title.toLowerCase().includes(term),
      );
    }
    return list;
  }, [data, search]);

  const canSave =
    form.route_path.trim().length > 0 &&
    form.title.trim().length > 0 &&
    form.description.trim().length > 0;

  return (
    <>
      <AdminPageHeading
        eyebrow="Growth"
        title="SEO Metadata"
        description="Manage page-specific SEO overrides."
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New override
          </Button>
        }
      />

      <AdminCard>
        <AdminToolbar>
          <AdminSearch value={search} onChange={setSearch} placeholder="Search routes or titles…" />
        </AdminToolbar>

        {isLoading ? (
          <AdminTableSkeleton rows={5} cols={3} />
        ) : filtered.length === 0 ? (
          <AdminEmpty
            title="No SEO metadata found"
            description="Create an SEO override for a specific page route."
            action={
              <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                New override
              </Button>
            }
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Route Path</th>
                <th>Meta Title</th>
                <th className="text-right">Actions</th>
              </>
            }
          >
            {filtered.map((meta) => (
              <tr key={meta.id} className="group hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5">
                <td className="font-medium text-primary">{meta.route_path}</td>
                <td className="text-muted-foreground truncate max-w-sm">{meta.title}</td>
                <td className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(meta)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingDelete(meta)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit SEO Metadata" : "New SEO Metadata"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>Route Path</Label>
              <Input
                value={form.route_path}
                placeholder="e.g. /services/web-development"
                onChange={(e) => set("route_path", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Meta Title</Label>
              <Input
                value={form.title}
                placeholder="60 chars max recommended"
                onChange={(e) => set("title", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Meta Description</Label>
              <Textarea
                rows={3}
                placeholder="160 chars max recommended"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Keywords (Comma separated)</Label>
              <Input
                value={form.keywords}
                placeholder="web design, ecommerce, custom software"
                onChange={(e) => set("keywords", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>OG Image URL</Label>
              <Input
                value={form.og_image}
                placeholder="https://example.com/image.jpg"
                onChange={(e) => set("og_image", e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gradient"
              disabled={!canSave || save.isPending}
              onClick={() => save.mutate()}
            >
              {save.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete SEO Metadata?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
