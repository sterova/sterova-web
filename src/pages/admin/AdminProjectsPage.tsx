import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
} from "lucide-react";
// lucide dropped brand marks; the public portfolio uses react-icons for this too.
import { FaGithub as Github } from "react-icons/fa";
import { AdminHeader, useMobileMenu } from "@/components/admin/AdminLayout";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
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

export default function AdminProjectsPage() {
  const setMobileMenuOpen = useMobileMenu();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
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
      return editing
        ? adminUpdateProject(editing.id, payload)
        : adminCreateProject(payload);
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

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)),
    );
  }, [data, search]);

  const activeCount = data?.filter((p) => p.is_active).length ?? 0;
  const canSave =
    form.title.trim().length >= 2 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(form.slug);

  return (
    <>
      <AdminHeader
        title="Projects"
        description={`${data?.length ?? 0} total · ${activeCount} visible on the site`}
        onMenuClick={setMobileMenuOpen}
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New project
          </Button>
        }
      />
      
      <div className="flex-1 p-4 sm:p-6 overflow-x-hidden flex flex-col">
        {error ? (
          <AdminError message={(error as Error).message} />
        ) : isLoading ? (
          <AdminLoading />
        ) : (
        <div className="flex flex-col gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, category or tag…"
              className="pl-9"
              aria-label="Search projects"
            />
          </div>

          {filtered.length === 0 ? (
            <AdminCard>
              <AdminEmpty
                title={
                  (data?.length ?? 0) === 0
                    ? "No projects yet"
                    : "No matching projects"
                }
                description={
                  (data?.length ?? 0) === 0
                    ? "Add your first case study to populate the portfolio."
                    : "Try a different search term."
                }
                action={
                  (data?.length ?? 0) === 0 ? (
                    <Button
                      type="button"
                      variant="gradient"
                      size="sm"
                      onClick={openNew}
                    >
                      <Plus className="h-4 w-4 mr-1.5" />
                      New project
                    </Button>
                  ) : undefined
                }
              />
            </AdminCard>
          ) : (
            <AdminCard>
              <ul className="divide-y">
                {filtered.map((project) => (
                  <li
                    key={project.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-4"
                  >
                    <div className="hidden sm:block w-16 h-12 rounded-lg bg-secondary shrink-0 overflow-hidden">
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

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          type="button"
                          onClick={() => openEdit(project)}
                          className="text-sm font-medium hover:text-primary transition-colors truncate text-left"
                        >
                          {project.title}
                        </button>
                        <StatusBadge
                          status={project.is_active ? "active" : "hidden"}
                        />
                        {project.is_featured && (
                          <StatusBadge status="featured" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {project.category}
                        {project.tags.length > 0 &&
                          ` · ${project.tags.join(", ")}`}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
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
                        <Button asChild variant="ghost" size="icon-sm">
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
                        <Button asChild variant="ghost" size="icon-sm">
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
                        size="icon-sm"
                        aria-label={`Edit ${project.title}`}
                        onClick={() => openEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${project.title}`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setPendingDelete(project)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </AdminCard>
          )}
        </div>
      )}

      {/* Create / edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit project" : "New project"}
            </DialogTitle>
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
              <p className="text-xs text-muted-foreground">
                Separate with commas.
              </p>
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
                  onChange={(e) =>
                    set("display_order", Number(e.target.value))
                  }
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
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
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

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `“${pendingDelete.title}” will be permanently removed. This cannot be undone.`
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
      </div>
    </>
  );
}
