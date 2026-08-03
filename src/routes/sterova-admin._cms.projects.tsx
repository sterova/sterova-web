import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
// lucide dropped brand marks; the public portfolio uses react-icons for this too.
import { FaGithub as Github } from "react-icons/fa";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeading,
  AdminSearch,
  AdminTable,
  AdminTableSkeleton,
  AdminToolbar,
  StatusBadge,
} from "@/components/admin/AdminUI";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  adminCreateProject,
  adminDeleteProject,
  adminFetchProjects,
  adminUpdateProject,
} from "@/lib/api";
import { STORAGE_BUCKETS } from "@/data/admin-constants";
import { slugify } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ProjectRow } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/projects")({
  head: () => privateSeo("Projects · CMS"),
  component: () => <AdminProjectsPage />,
});

interface FormState {
  title: string;
  slug: string;
  category: string;
  description: string;
  tags: string;
  image_url: string | null;
  live_url: string;
  github_url: string;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  category: "General",
  description: "",
  tags: "",
  image_url: null,
  live_url: "",
  github_url: "",
  is_featured: false,
  is_active: true,
  display_order: 0,
};

type FilterValue = "all" | "active" | "hidden" | "featured";

function toForm(project: ProjectRow): FormState {
  return {
    title: project.title,
    slug: project.slug,
    category: project.category,
    description: project.description,
    tags: project.tags.join(", "),
    image_url: project.image_url,
    live_url: project.live_url ?? "",
    github_url: project.github_url ?? "",
    is_featured: project.is_featured,
    is_active: project.is_active,
    display_order: project.display_order,
  };
}

function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [editing, setEditing] = useState<ProjectRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugLocked, setSlugLocked] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ProjectRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: adminFetchProjects,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    // Public portfolio pages read from this key.
    void queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Auto-derive the slug from the title until the user edits it by hand.
  useEffect(() => {
    if (!slugLocked && !editing) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, slugLocked, editing]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, display_order: data?.length ?? 0 });
    setSlugLocked(false);
    setDialogOpen(true);
  };

  const openEdit = (project: ProjectRow) => {
    setEditing(project);
    setForm(toForm(project));
    setSlugLocked(true);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        category: form.category.trim() || "General",
        description: form.description.trim(),
        tags: form.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        image_url: form.image_url,
        live_url: form.live_url.trim() || null,
        github_url: form.github_url.trim() || null,
        is_featured: form.is_featured,
        is_active: form.is_active,
        display_order: Number(form.display_order) || 0,
      };
      return editing ? adminUpdateProject(editing.id, payload) : adminCreateProject(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Project updated" : "Project created" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not save project",
        description: err.message,
        variant: "destructive",
      }),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminUpdateProject(id, { is_active }),
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({
        title: "Could not update project",
        description: err.message,
        variant: "destructive",
      }),
  });

  const reorder = useMutation({
    mutationFn: ({ id, display_order }: { id: string; display_order: number }) =>
      adminUpdateProject(id, { display_order }),
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({
        title: "Could not reorder project",
        description: err.message,
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteProject,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Project deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete project",
        description: err.message,
        variant: "destructive",
      }),
  });

  const activeCount = data?.filter((p) => p.is_active).length ?? 0;
  const hiddenCount = (data?.length ?? 0) - activeCount;
  const featuredCount = data?.filter((p) => p.is_featured).length ?? 0;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = data ?? [];
    if (filter === "active") list = list.filter((p) => p.is_active);
    if (filter === "hidden") list = list.filter((p) => !p.is_active);
    if (filter === "featured") list = list.filter((p) => p.is_featured);
    if (!term) return list;
    return list.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)),
    );
  }, [data, search, filter]);

  const canSave = form.title.trim().length >= 2 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug);

  const move = (project: ProjectRow, direction: -1 | 1) => {
    const sorted = [...(data ?? [])].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((p) => p.id === project.id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    reorder.mutate({ id: project.id, display_order: swapWith.display_order });
    reorder.mutate({ id: swapWith.id, display_order: project.display_order });
  };

  return (
    <>
      <AdminPageHeading
        eyebrow="Portfolio"
        title="Projects"
        description={`${data?.length ?? 0} total · ${activeCount} visible · ${featuredCount} featured on homepage`}
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New project
          </Button>
        }
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : (
        <AdminCard>
          <AdminToolbar>
            <AdminSearch
              value={search}
              onChange={setSearch}
              placeholder="Search title, category or tag…"
            />
            <AdminFilterTabs<FilterValue>
              value={filter}
              onChange={setFilter}
              label="Filter projects"
              options={[
                { value: "all", label: "All", count: data?.length ?? 0 },
                { value: "active", label: "Active", count: activeCount },
                { value: "featured", label: "Featured", count: featuredCount },
                { value: "hidden", label: "Hidden", count: hiddenCount },
              ]}
            />
          </AdminToolbar>

          {isLoading ? (
            <AdminTableSkeleton rows={6} cols={4} />
          ) : filtered.length === 0 ? (
            <AdminEmpty
              title={(data?.length ?? 0) === 0 ? "No projects yet" : "No matching projects"}
              description={
                (data?.length ?? 0) === 0
                  ? "Add your first case study to populate the portfolio."
                  : "Try a different search term or filter."
              }
              action={
                (data?.length ?? 0) === 0 ? (
                  <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    New project
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <AdminTable
              head={
                <>
                  <th>Project</th>
                  <th>Category / tags</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th className="text-right">Actions</th>
                </>
              }
            >
              {filtered.map((project) => (
                <tr
                  key={project.id}
                  className="group transition-colors hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5 [&>td]:align-middle"
                >
                  <td>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="hidden sm:block w-14 h-10 rounded-lg bg-secondary shrink-0 overflow-hidden">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-semibold">
                            {project.title.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => openEdit(project)}
                        className="text-sm font-medium hover:text-primary transition-colors truncate text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        {project.title}
                      </button>
                    </div>
                  </td>
                  <td>
                    <p className="text-xs text-muted-foreground truncate max-w-[16rem]">
                      {project.category}
                      {project.tags.length > 0 && ` · ${project.tags.join(", ")}`}
                    </p>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <StatusBadge status={project.is_active ? "active" : "hidden"} />
                      {project.is_featured && <StatusBadge status="featured" />}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Move ${project.title} up`}
                        disabled={reorder.isPending}
                        onClick={() => move(project, -1)}
                      >
                        ↑
                      </Button>
                      <span className="text-xs tabular-nums text-muted-foreground w-4 text-center">
                        {project.display_order}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Move ${project.title} down`}
                        disabled={reorder.isPending}
                        onClick={() => move(project, 1)}
                      >
                        ↓
                      </Button>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={toggleActive.isPending}
                        onClick={() =>
                          toggleActive.mutate({
                            id: project.id,
                            is_active: !project.is_active,
                          })
                        }
                      >
                        {project.is_active ? "Hide" : "Show"}
                      </Button>
                      {project.live_url && (
                        <Button asChild variant="ghost" size="icon">
                          <a
                            href={project.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open the live site for ${project.title}`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      {project.github_url && (
                        <Button asChild variant="ghost" size="icon">
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Open the repository for ${project.title}`}
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${project.title}`}
                        onClick={() => openEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${project.title}`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setPendingDelete(project)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      )}

      {/* Create / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit project" : "New project"}</DialogTitle>
            <DialogDescription>
              Projects marked visible appear on the public portfolio page.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="project-title">Title</Label>
              <Input
                id="project-title"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="FinTech Analytics Dashboard"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-slug">Slug</Label>
                <Input
                  id="project-slug"
                  value={form.slug}
                  onChange={(e) => {
                    setSlugLocked(true);
                    set("slug", slugify(e.target.value));
                  }}
                  placeholder="fintech-dashboard"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-category">Category</Label>
                <Input
                  id="project-category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="SaaS · FinTech"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="project-description">Description</Label>
              <Textarea
                id="project-description"
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                placeholder="What the product does and the outcome it delivered."
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="project-tags">Tags</Label>
              <Input
                id="project-tags"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="Next.js, Supabase, TypeScript"
              />
              <p className="text-xs text-muted-foreground">Separate with commas.</p>
            </div>

            <ImageUploadField
              label="Cover image"
              bucket={STORAGE_BUCKETS.project}
              value={form.image_url}
              onChange={(url) => set("image_url", url)}
              hint="Shown on the portfolio grid."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-live">Live URL</Label>
                <Input
                  id="project-live"
                  value={form.live_url}
                  onChange={(e) => set("live_url", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-github">Repository URL</Label>
                <Input
                  id="project-github"
                  value={form.github_url}
                  onChange={(e) => set("github_url", e.target.value)}
                  placeholder="https://github.com/…"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 items-end">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-order">Display order</Label>
                <Input
                  id="project-order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2.5">
                <Switch
                  id="project-active"
                  checked={form.is_active}
                  onCheckedChange={(v) => set("is_active", v)}
                />
                <Label htmlFor="project-active">Visible</Label>
              </div>
              <div className="flex items-center gap-2.5">
                <Switch
                  id="project-featured"
                  checked={form.is_featured}
                  onCheckedChange={(v) => set("is_featured", v)}
                />
                <Label htmlFor="project-featured">Featured</Label>
              </div>
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
                  {editing ? "Save changes" : "Create project"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `"${pendingDelete.title}" will be permanently removed. This cannot be undone.`
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
                "Delete project"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
