import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminPageHeading,
  AdminSearch,
  AdminTable,
  AdminTableSkeleton,
  AdminToolbar,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminFetchPosts,
  adminUpdateCategory,
  fetchCategories,
} from "@/lib/api";
import { slugify } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { BlogCategoryRow } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/categories")({
  head: () => privateSeo("Categories · CMS"),
  component: () => <AdminCategoriesPage />,
});

interface FormState {
  name: string;
  slug: string;
  description: string;
  display_order: number;
}

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",
  display_order: 0,
};

function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<BlogCategoryRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugLocked, setSlugLocked] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<BlogCategoryRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // Used purely to show how many posts each category holds.
  const { data: posts } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: adminFetchPosts,
  });

  const postCount = (categoryId: string) =>
    posts?.filter((p) => p.category_id === categoryId).length ?? 0;

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["categories"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!slugLocked && !editing) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [form.name, slugLocked, editing]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, display_order: data?.length ?? 0 });
    setSlugLocked(false);
    setDialogOpen(true);
  };

  const openEdit = (category: BlogCategoryRow) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      display_order: category.display_order,
    });
    setSlugLocked(true);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        display_order: Number(form.display_order) || 0,
      };
      return editing ? adminUpdateCategory(editing.id, payload) : adminCreateCategory(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Category updated" : "Category created" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not save category",
        description: err.message,
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteCategory,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Category deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete category",
        description: err.message,
        variant: "destructive",
      }),
  });

  const canSave = form.name.trim().length >= 2 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter(
      (c) => c.name.toLowerCase().includes(term) || c.slug.toLowerCase().includes(term),
    );
  }, [data, search]);

  return (
    <>
      <AdminPageHeading
        eyebrow="Taxonomy"
        title="Categories"
        description={`${data?.length ?? 0} blog categories`}
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New category
          </Button>
        }
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : (
        <AdminCard>
          <AdminToolbar>
            <AdminSearch value={search} onChange={setSearch} placeholder="Search name or slug…" />
          </AdminToolbar>

          {isLoading ? (
            <AdminTableSkeleton rows={5} cols={3} />
          ) : filtered.length === 0 ? (
            <AdminEmpty
              title={(data?.length ?? 0) === 0 ? "No categories yet" : "No matching categories"}
              description={
                (data?.length ?? 0) === 0
                  ? "Categories help readers filter the blog index."
                  : "Try a different search term."
              }
              action={
                (data?.length ?? 0) === 0 ? (
                  <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    New category
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <AdminTable
              head={
                <>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Posts</th>
                  <th>Order</th>
                  <th className="text-right">Actions</th>
                </>
              }
            >
              {filtered.map((category) => {
                const count = postCount(category.id);
                return (
                  <tr
                    key={category.id}
                    className="group transition-colors hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5 [&>td]:align-middle"
                  >
                    <td>
                      <button
                        type="button"
                        onClick={() => openEdit(category)}
                        className="text-sm font-medium hover:text-primary transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        {category.name}
                      </button>
                      {category.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[18rem]">
                          {category.description}
                        </p>
                      )}
                    </td>
                    <td>
                      <span className="text-xs text-muted-foreground">/{category.slug}</span>
                    </td>
                    <td>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {count} {count === 1 ? "post" : "posts"}
                      </span>
                    </td>
                    <td>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {category.display_order}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5 shrink-0">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${category.name}`}
                          onClick={() => openEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${category.name}`}
                          className="text-muted-foreground hover:text-destructive"
                          onClick={() => setPendingDelete(category)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </AdminTable>
          )}
        </AdminCard>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "New category"}</DialogTitle>
            <DialogDescription>Used to group blog posts on the public index.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category-name">Name</Label>
              <Input
                id="category-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Engineering"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category-slug">Slug</Label>
              <Input
                id="category-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="engineering"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={2}
                placeholder="Optional summary for this topic."
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="category-order">Display order</Label>
              <Input
                id="category-order"
                type="number"
                value={form.display_order}
                onChange={(e) => set("display_order", Number(e.target.value))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              disabled={!canSave || save.isPending}
              onClick={() => save.mutate()}
            >
              {save.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  {editing ? "Save changes" : "Create category"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this category?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.name}" will be removed. Posts in it are kept but become uncategorised.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (pendingDelete) deleteMutation.mutate(pendingDelete.id);
              }}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete category"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
