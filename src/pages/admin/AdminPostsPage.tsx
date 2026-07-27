import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Eye,
  ExternalLink,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { AdminHeader, useMobileMenu } from "@/components/admin/AdminLayout";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { adminDeletePost, adminFetchPosts, adminUpdatePost } from "@/lib/api";
import { ADMIN_ROUTES } from "@/data/admin-constants";
import { formatDate } from "@/lib/utils";
import type { BlogPostWithCategory } from "@/types/database";

type Filter = "all" | "published" | "draft";

export default function AdminPostsPage() {
  const setMobileMenuOpen = useMobileMenu();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingDelete, setPendingDelete] =
    useState<BlogPostWithCategory | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "posts"],
    queryFn: adminFetchPosts,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "posts"] });
    void queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

  const deleteMutation = useMutation({
    mutationFn: adminDeletePost,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
    },
  });

  const togglePublish = useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      adminUpdatePost(id, {
        published,
        // Stamp the publish date the first time it goes live.
        published_at: published ? new Date().toISOString() : null,
      }),
    onSuccess: invalidate,
  });

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((post) => {
      if (filter === "published" && !post.published) return false;
      if (filter === "draft" && post.published) return false;
      if (!term) return true;
      return (
        post.title.toLowerCase().includes(term) ||
        post.slug.toLowerCase().includes(term) ||
        post.tags.some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [data, search, filter]);

  const counts = useMemo(
    () => ({
      all: data?.length ?? 0,
      published: data?.filter((p) => p.published).length ?? 0,
      draft: data?.filter((p) => !p.published).length ?? 0,
    }),
    [data],
  );

  return (
    <>
      <AdminHeader
        title="Blog Posts"
        description={`${counts.all} total · ${counts.published} published · ${counts.draft} draft`}
        onMenuClick={setMobileMenuOpen}
        actions={
          <Button asChild variant="gradient" size="sm">
            <Link href={ADMIN_ROUTES.postNew}>
              <Plus className="h-4 w-4 mr-1.5" />
              New post
            </Link>
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
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, slug or tag…"
                className="pl-9"
                aria-label="Search posts"
              />
            </div>
            <div className="flex gap-1.5" role="group" aria-label="Filter posts">
              {(["all", "published", "draft"] as Filter[]).map((f) => (
                <Button
                  key={f}
                  type="button"
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  className="capitalize"
                  onClick={() => setFilter(f)}
                >
                  {f} ({counts[f]})
                </Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <AdminCard>
              <AdminEmpty
                title={counts.all === 0 ? "No posts yet" : "No matching posts"}
                description={
                  counts.all === 0
                    ? "Write your first article to get the blog started."
                    : "Try a different search term or filter."
                }
                action={
                  counts.all === 0 ? (
                    <Button asChild variant="gradient" size="sm">
                      <Link href={ADMIN_ROUTES.postNew}>
                        <Plus className="h-4 w-4 mr-1.5" />
                        New post
                      </Link>
                    </Button>
                  ) : undefined
                }
              />
            </AdminCard>
          ) : (
            <AdminCard>
              <ul className="divide-y">
                {filtered.map((post) => (
                  <li
                    key={post.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-4"
                  >
                    {/* Thumbnail */}
                    <div className="hidden sm:block w-14 h-14 rounded-lg bg-secondary shrink-0 overflow-hidden">
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs font-semibold">
                          {post.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          href={ADMIN_ROUTES.postEdit(post.id)}
                          className="text-sm font-medium hover:text-primary transition-colors truncate"
                        >
                          {post.title}
                        </Link>
                        <StatusBadge
                          status={post.published ? "published" : "draft"}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {post.blog_categories?.name ?? "Uncategorised"}
                        {" · "}
                        {post.published_at
                          ? formatDate(post.published_at)
                          : `edited ${formatDate(post.updated_at)}`}
                        {" · "}
                        <span className="inline-flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {post.views.toLocaleString()}
                        </span>
                        {" · "}
                        {post.read_time_minutes} min
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={togglePublish.isPending}
                        onClick={() =>
                          togglePublish.mutate({
                            id: post.id,
                            published: !post.published,
                          })
                        }
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      {post.published && (
                        <Button asChild variant="ghost" size="icon-sm">
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`View ${post.title} on the live site`}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link
                          href={ADMIN_ROUTES.postEdit(post.id)}
                          aria-label={`Edit ${post.title}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete ${post.title}`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setPendingDelete(post)}
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

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.title
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
                "Delete post"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}
