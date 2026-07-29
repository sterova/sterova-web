import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { AdminCard, AdminError, AdminLoading } from "@/components/admin/AdminUI";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ImageUploadField from "@/components/admin/ImageUploadField";
import {
  adminCreatePost,
  adminDeletePost,
  adminFetchPost,
  adminUpdatePost,
  fetchCategories,
} from "@/lib/api";
import { ADMIN_ROUTES, STORAGE_BUCKETS } from "@/data/admin-constants";
import { readingTime, slugify } from "@/lib/utils";
import type { BlogPostRow } from "@/types/database";
import { toast } from "sonner";

const NO_CATEGORY = "__none__";

interface FormState {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  category_id: string | null;
  tags: string;
  author_name: string;
  published: boolean;
  read_time_minutes: number;
  seo_title: string;
  seo_description: string;
}

const EMPTY: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image_url: null,
  category_id: null,
  tags: "",
  author_name: "Sterova Team",
  published: false,
  read_time_minutes: 1,
  seo_title: "",
  seo_description: "",
};

function toForm(post: BlogPostRow): FormState {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt ?? "",
    content: post.content ?? "",
    cover_image_url: post.cover_image_url,
    category_id: post.category_id,
    tags: (post.tags ?? []).join(", "),
    author_name: post.author_name,
    published: post.published,
    read_time_minutes: post.read_time_minutes,
    seo_title: post.seo_title ?? "",
    seo_description: post.seo_description ?? "",
  };
}

export default function PostEditor({ postId }: { postId?: string }) {
  const isNew = !postId;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormState>(EMPTY);
  // Once the title has produced a slug the user may hand-edit it; after that we
  // stop syncing so their custom permalink is never silently overwritten.
  const [slugLocked, setSlugLocked] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const postQuery = useQuery({
    queryKey: ["admin", "post", postId],
    queryFn: () => adminFetchPost(postId as string),
    enabled: !isNew,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  useEffect(() => {
    if (postQuery.data) {
      setForm(toForm(postQuery.data));
      setSlugLocked(true);
    }
  }, [postQuery.data]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTitle = (title: string) =>
    setForm((prev) => ({
      ...prev,
      title,
      slug: slugLocked ? prev.slug : slugify(title),
    }));

  // Reading time is derived from the editor's text so it stays honest.
  const estimatedMinutes = useMemo(() => {
    const text = form.content.replace(/<[^>]*>/g, " ");
    return Math.max(1, readingTime(text));
  }, [form.content]);

  const buildPayload = (publishOverride?: boolean) => {
    const published = publishOverride ?? form.published;
    return {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      excerpt: form.excerpt.trim(),
      content: form.content,
      cover_image_url: form.cover_image_url,
      category_id: form.category_id,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      author_name: form.author_name.trim() || "Sterova Team",
      published,
      read_time_minutes: form.read_time_minutes || estimatedMinutes,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      // Stamp the publish date the first time a post actually goes live.
      published_at:
        published && !postQuery.data?.published_at
          ? new Date().toISOString()
          : (postQuery.data?.published_at ?? null),
    };
  };

  const save = useMutation({
    mutationFn: async (publishOverride?: boolean) => {
      const payload = buildPayload(publishOverride);
      if (!payload.title) throw new Error("A title is required.");
      if (!payload.slug) throw new Error("A slug is required.");
      return isNew ? adminCreatePost(payload) : adminUpdatePost(postId as string, payload);
    },
    onSuccess: (saved) => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(saved.published ? "Post published" : "Draft saved", {
        description: saved.title,
      });
      if (isNew) {
        navigate({ to: ADMIN_ROUTES.postEdit(saved.id), replace: true });
      } else {
        setForm(toForm(saved));
      }
    },
    onError: (err: Error) => toast.error("Could not save", { description: err.message }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => adminDeletePost(postId as string),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted", { description: form.title });
      navigate({ to: ADMIN_ROUTES.posts });
    },
    onError: (err: Error) => toast.error("Could not delete", { description: err.message }),
  });

  if (!isNew && postQuery.isLoading) return <AdminLoading label="Loading post…" />;
  if (!isNew && postQuery.isError)
    return <AdminError message={(postQuery.error as Error).message} />;

  const categories = categoriesQuery.data ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: ADMIN_ROUTES.posts })}
            aria-label="Back to posts"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-0">
            <h1 className="font-display truncate text-xl font-bold">
              {isNew ? "New post" : form.title || "Untitled post"}
            </h1>
            <p className="text-xs text-muted-foreground">
              {form.published ? "Published" : "Draft"} · ~{estimatedMinutes} min read
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isNew && form.published && (
            <Button variant="outline" size="sm" asChild>
              <a href={`/blog/${form.slug}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
                View
              </a>
            </Button>
          )}
          {!isNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={() => setConfirmDelete(true)}
              aria-label="Delete post"
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              Delete
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={save.isPending}
            onClick={() => save.mutate(false)}
          >
            Save draft
          </Button>
          <Button size="sm" disabled={save.isPending} onClick={() => save.mutate(true)}>
            {save.isPending ? (
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="mr-1.5 h-3.5 w-3.5" />
            )}
            {form.published ? "Update" : "Publish"}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Main editor column */}
        <div className="flex min-w-0 flex-col gap-5">
          <AdminCard className="flex flex-col gap-4 p-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => handleTitle(e.target.value)}
                placeholder="A headline worth clicking"
                className="font-medium md:text-lg"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  set("slug", slugify(e.target.value));
                }}
                placeholder="my-post-slug"
                className="font-mono text-xs"
              />
              <p className="truncate text-xs text-muted-foreground">/blog/{form.slug || "…"}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                placeholder="One or two sentences shown on cards and in search results."
                rows={3}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Content</Label>
              <RichTextEditor value={form.content} onChange={(html) => set("content", html)} />
            </div>
          </AdminCard>
        </div>

        {/* Settings sidebar */}
        <div className="flex flex-col gap-5 lg:sticky lg:top-24">
          <AdminCard className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Label htmlFor="published" className="cursor-pointer">
                  Published
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Drafts stay invisible to visitors.
                </p>
              </div>
              <Switch
                id="published"
                checked={form.published}
                onCheckedChange={(v) => set("published", v)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.category_id ?? NO_CATEGORY}
                onValueChange={(v) => set("category_id", v === NO_CATEGORY ? null : v)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Uncategorised" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NO_CATEGORY}>Uncategorised</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="react, performance"
              />
              <p className="text-xs text-muted-foreground">Comma separated.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="readtime">Read time</Label>
                <Input
                  id="readtime"
                  type="number"
                  min={1}
                  value={form.read_time_minutes}
                  onChange={(e) => set("read_time_minutes", Number(e.target.value) || 1)}
                />
              </div>
              <div className="flex flex-col justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("read_time_minutes", estimatedMinutes)}
                >
                  Use ~{estimatedMinutes}
                </Button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                value={form.author_name}
                onChange={(e) => set("author_name", e.target.value)}
              />
            </div>
          </AdminCard>

          <AdminCard className="p-5">
            <ImageUploadField
              label="Cover image"
              bucket={STORAGE_BUCKETS.blog}
              value={form.cover_image_url}
              onChange={(url) => set("cover_image_url", url)}
              hint="Shown on blog cards and at the top of the post."
            />
          </AdminCard>

          <AdminCard className="flex flex-col gap-4 p-5">
            <div>
              <h2 className="text-sm font-semibold">SEO</h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Falls back to the title and excerpt when left empty.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="seo-title">Meta title</Label>
              <Input
                id="seo-title"
                value={form.seo_title}
                onChange={(e) => set("seo_title", e.target.value)}
                placeholder={form.title || "Post title"}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="seo-description">Meta description</Label>
              <Textarea
                id="seo-description"
                value={form.seo_description}
                onChange={(e) => set("seo_description", e.target.value)}
                placeholder={form.excerpt || "Short search-result summary"}
                rows={3}
              />
            </div>
          </AdminCard>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              {form.title
                ? `“${form.title}” will be permanently removed. This cannot be undone.`
                : "This post will be permanently removed. This cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                deleteMutation.mutate();
              }}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete post"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
