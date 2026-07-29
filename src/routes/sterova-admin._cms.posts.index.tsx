import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, ExternalLink, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/posts/")({
  head: () => privateSeo("Blog posts · CMS"),
  component: () => <AdminPostsPage />,
});

type Filter = "all" | "published" | "draft";

function AdminPostsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [pendingDelete, setPendingDelete] = useState<BlogPostWithCategory | null>(null);

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
      <AdminPageHeading
        eyebrow="Content"
        title="Blog posts"
        description={`${counts.all} total · ${counts.published} published · ${counts.draft} draft`}
        actions={
          <Button asChild size="sm">
            <Link to={ADMIN_ROUTES.postNew}>
              <Plus className="mr-1.5 h-4 w-4" />
              New post
            </Link>
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
              placeholder="Search title, slug or tag…"
            />
            <AdminFilterTabs
              value={filter}
              onChange={setFilter}
              label="Filter posts"
              options={[
                { value: "all", label: "All", count: counts.all },
                { value: "published", label: "Published", count: counts.published },
                { value: "draft", label: "Draft", count: counts.draft },
              ]}
            />
          </AdminToolbar>

          {isLoading ? (
            <AdminTableSkeleton rows={6} cols={5} />
          ) : filtered.length === 0 ? (
            <AdminEmpty
              title={counts.all === 0 ? "No posts yet" : "No matching posts"}
              description={
                counts.all === 0
                  ? "Write your first article to get the blog started."
                  : "Try a different search term or filter."
              }
              action={
                counts.all === 0 ? (
                  <Button asChild size="sm">
                    <Link to={ADMIN_ROUTES.postNew}>
                      <Plus className="mr-1.5 h-4 w-4" />
                      New post
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <AdminTable
              head={
                <>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Updated</th>
                  <th className="text-right">Actions</th>
                </>
              }
            >
              {filtered.map((post) => (
                <AdminRow key={post.id}>
                  <td className="min-w-0 max-w-xs">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-secondary sm:block">
                        {post.cover_image_url ? (
                          <img
                            src={post.cover_image_url}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-muted-foreground">
                            {post.title.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <Link
                        to={ADMIN_ROUTES.postEdit(post.id)}
                        className="truncate text-sm font-medium transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </td>
                  <td className="text-sm text-muted-foreground">
                    {post.blog_categories?.name ?? "Uncategorised"}
                  </td>
                  <td>
                    <StatusBadge status={post.published ? "published" : "draft"} />
                  </td>
                  <td className="text-sm tabular-nums text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {post.views.toLocaleString()}
                    </span>
                  </td>
                  <td className="whitespace-nowrap text-sm text-muted-foreground">
                    {post.published_at
                      ? formatDate(post.published_at)
                      : formatDate(post.updated_at)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={togglePublish.isPending}
                        onClick={() =>
                          togglePublish.mutate({ id: post.id, published: !post.published })
                        }
                      >
                        {post.published ? "Unpublish" : "Publish"}
                      </Button>
                      {post.published && (
                        <Button asChild variant="ghost" size="icon">
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
                      <Button asChild variant="ghost" size="icon">
                        <Link to={ADMIN_ROUTES.postEdit(post.id)} aria-label={`Edit ${post.title}`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${post.title}`}
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => setPendingDelete(post)}
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

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
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
    </>
  );
}
