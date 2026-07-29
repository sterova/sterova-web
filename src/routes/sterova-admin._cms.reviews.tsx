import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Star, Trash2, Undo2, X } from "lucide-react";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeading,
  AdminSearch,
  AdminTableSkeleton,
  AdminToolbar,
  StatTile,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
  adminDeleteReview,
  adminFetchReviews,
  adminSetReviewStatus,
  adminUpdateReview,
} from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ReviewRow, ReviewStatus } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/reviews")({
  head: () => privateSeo("Reviews · CMS"),
  component: () => <AdminReviewsPage />,
});

type Filter = "pending" | "approved" | "rejected" | "all";

/** Read-only star row for a submitted rating. */
function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "h-3.5 w-3.5 fill-brand-amber text-brand-amber"
              : "h-3.5 w-3.5 text-muted-foreground/30"
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

function AdminReviewsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  // Pending first — moderation is the primary job on this screen.
  const [filter, setFilter] = useState<Filter>("pending");
  const [pendingDelete, setPendingDelete] = useState<ReviewRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "reviews"],
    queryFn: adminFetchReviews,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "reviews"] });
    // The public site reads approved reviews from a separate cache key.
    void queryClient.invalidateQueries({ queryKey: ["reviews"] });
  };

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ReviewStatus }) =>
      adminSetReviewStatus(id, status),
    onSuccess: (_data, variables) => {
      invalidate();
      toast({
        title:
          variables.status === "approved"
            ? "Review approved"
            : variables.status === "rejected"
              ? "Review rejected"
              : "Review moved back to pending",
        description:
          variables.status === "approved"
            ? "It is now visible on the public site."
            : "It will not appear on the public site.",
      });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not update review",
        description: err.message,
        variant: "destructive",
      }),
  });

  const setFeatured = useMutation({
    mutationFn: ({ id, is_featured }: { id: string; is_featured: boolean }) =>
      adminUpdateReview(id, { is_featured }),
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({
        title: "Could not update review",
        description: err.message,
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteReview,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Review deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete review",
        description: err.message,
        variant: "destructive",
      }),
  });

  const counts = useMemo(
    () => ({
      all: data?.length ?? 0,
      pending: data?.filter((r) => r.status === "pending").length ?? 0,
      approved: data?.filter((r) => r.status === "approved").length ?? 0,
      rejected: data?.filter((r) => r.status === "rejected").length ?? 0,
    }),
    [data],
  );

  const averageRating = useMemo(() => {
    const approved = data?.filter((r) => r.status === "approved") ?? [];
    if (approved.length === 0) return 0;
    return approved.reduce((sum, r) => sum + r.rating, 0) / approved.length;
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((r) => {
      if (filter !== "all" && r.status !== filter) return false;
      if (!term) return true;
      return (
        r.name.toLowerCase().includes(term) ||
        r.content.toLowerCase().includes(term) ||
        (r.company ?? "").toLowerCase().includes(term)
      );
    });
  }, [data, search, filter]);

  return (
    <>
      <AdminPageHeading
        eyebrow="Moderation"
        title="Reviews"
        description="Approve, reject and feature testimonials submitted through the public site."
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatTile label="Total reviews" value={counts.all} icon={Star} />
            <StatTile
              label="Pending"
              value={counts.pending}
              icon={Loader2}
              hint={counts.pending > 0 ? "Awaiting moderation" : "All caught up"}
              accent={counts.pending > 0}
            />
            <StatTile
              label="Average rating"
              value={averageRating ? averageRating.toFixed(1) : "—"}
              icon={Star}
              hint="Across approved reviews"
            />
          </div>

          <AdminCard>
            <AdminToolbar>
              <AdminSearch
                value={search}
                onChange={setSearch}
                placeholder="Search name, company or text…"
              />
              <AdminFilterTabs
                label="Filter reviews"
                value={filter}
                onChange={setFilter}
                options={[
                  { value: "pending", label: "Pending", count: counts.pending },
                  { value: "approved", label: "Approved", count: counts.approved },
                  { value: "rejected", label: "Rejected", count: counts.rejected },
                  { value: "all", label: "All", count: counts.all },
                ]}
              />
            </AdminToolbar>

            {isLoading ? (
              <AdminTableSkeleton rows={5} cols={4} />
            ) : filtered.length === 0 ? (
              <AdminEmpty
                title={counts.all === 0 ? "No reviews yet" : "Nothing matches here"}
                description={
                  counts.all === 0
                    ? "Reviews submitted through the site will land here for moderation."
                    : "Try another search term or filter."
                }
                icon={Star}
              />
            ) : (
              <ul className="divide-y divide-border/70">
                {filtered.map((review) => (
                  <li
                    key={review.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/20"
                      aria-hidden="true"
                    >
                      {review.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium">{review.name}</p>
                        <StatusBadge status={review.status} />
                        {review.is_featured && <StatusBadge status="featured" />}
                        <Stars rating={review.rating} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[review.role, review.company].filter(Boolean).join(" · ") ||
                          "No role provided"}
                        {" · "}
                        {formatDate(review.created_at)}
                      </p>

                      <blockquote className="mt-2 border-l-2 border-border pl-3 text-sm leading-relaxed text-muted-foreground">
                        {review.content}
                      </blockquote>

                      {review.email && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Contact:{" "}
                          <a
                            href={`mailto:${review.email}`}
                            className="text-primary hover:underline"
                          >
                            {review.email}
                          </a>
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/70 pt-3">
                        {review.status !== "approved" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="gradient"
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ id: review.id, status: "approved" })}
                          >
                            <Check className="mr-1.5 h-4 w-4" />
                            Approve
                          </Button>
                        )}
                        {review.status !== "rejected" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ id: review.id, status: "rejected" })}
                          >
                            <X className="mr-1.5 h-4 w-4" />
                            Reject
                          </Button>
                        )}
                        {review.status !== "pending" && (
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={setStatus.isPending}
                            onClick={() => setStatus.mutate({ id: review.id, status: "pending" })}
                          >
                            <Undo2 className="mr-1.5 h-4 w-4" />
                            Reset
                          </Button>
                        )}

                        {review.status === "approved" && (
                          <div className="ml-auto flex items-center gap-2">
                            <Label
                              htmlFor={`featured-${review.id}`}
                              className="text-xs text-muted-foreground"
                            >
                              Featured
                            </Label>
                            <Switch
                              id={`featured-${review.id}`}
                              checked={review.is_featured}
                              disabled={setFeatured.isPending}
                              onCheckedChange={(checked) =>
                                setFeatured.mutate({ id: review.id, is_featured: checked })
                              }
                            />
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete review from ${review.name}`}
                          className={cn(
                            "text-muted-foreground hover:text-destructive",
                            review.status !== "approved" && "ml-auto",
                          )}
                          onClick={() => setPendingDelete(review)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </>
      )}

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this review?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `The review from ${pendingDelete.name} will be permanently removed. This cannot be undone.`
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
                "Delete review"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
