import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, Search, Star, Trash2, Undo2, X } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ReviewRow, ReviewStatus } from "@/types/database";

type Filter = "pending" | "approved" | "rejected" | "all";

/** Read-only star row for a submitted rating. */
function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={
            i < rating
              ? "h-3.5 w-3.5 fill-amber-400 text-amber-400"
              : "h-3.5 w-3.5 text-muted-foreground/30"
          }
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

export default function AdminReviewsPage() {
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
    <AdminLayout
      title="Reviews"
      description={`${counts.pending} pending · ${counts.approved} approved · ${counts.all} total`}
    >
      {error ? (
        <AdminError message={(error as Error).message} />
      ) : isLoading ? (
        <AdminLoading />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, company or text…"
                className="pl-9"
                aria-label="Search reviews"
              />
            </div>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filter reviews"
            >
              {(["pending", "approved", "rejected", "all"] as Filter[]).map(
                (f) => (
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
                ),
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <AdminCard>
              <AdminEmpty
                title={
                  counts.all === 0 ? "No reviews yet" : "Nothing matches here"
                }
                description={
                  counts.all === 0
                    ? "Reviews submitted through the site will land here for moderation."
                    : "Try another search term or filter."
                }
              />
            </AdminCard>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((review) => (
                <AdminCard key={review.id}>
                  <div className="p-4 sm:p-5 flex flex-col gap-3">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{review.name}</p>
                          <StatusBadge status={review.status} />
                          {review.is_featured && (
                            <StatusBadge status="featured" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {[review.role, review.company]
                            .filter(Boolean)
                            .join(" · ") || "No role provided"}
                          {" · "}
                          {formatDate(review.created_at)}
                        </p>
                      </div>
                      <Stars rating={review.rating} />
                    </div>

                    {/* Body */}
                    <blockquote className="text-sm leading-relaxed text-muted-foreground border-l-2 border-border pl-3">
                      {review.content}
                    </blockquote>

                    {review.email && (
                      <p className="text-xs text-muted-foreground">
                        Contact:{" "}
                        <a
                          href={`mailto:${review.email}`}
                          className="text-primary hover:underline"
                        >
                          {review.email}
                        </a>
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap pt-1 border-t mt-1">
                      {review.status !== "approved" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="gradient"
                          disabled={setStatus.isPending}
                          onClick={() =>
                            setStatus.mutate({
                              id: review.id,
                              status: "approved",
                            })
                          }
                        >
                          <Check className="h-4 w-4 mr-1.5" />
                          Approve
                        </Button>
                      )}
                      {review.status !== "rejected" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={setStatus.isPending}
                          onClick={() =>
                            setStatus.mutate({
                              id: review.id,
                              status: "rejected",
                            })
                          }
                        >
                          <X className="h-4 w-4 mr-1.5" />
                          Reject
                        </Button>
                      )}
                      {review.status !== "pending" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={setStatus.isPending}
                          onClick={() =>
                            setStatus.mutate({
                              id: review.id,
                              status: "pending",
                            })
                          }
                        >
                          <Undo2 className="h-4 w-4 mr-1.5" />
                          Reset
                        </Button>
                      )}

                      {/* Featuring only makes sense once a review is public. */}
                      {review.status === "approved" && (
                        <div className="flex items-center gap-2 ml-auto">
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
                              setFeatured.mutate({
                                id: review.id,
                                is_featured: checked,
                              })
                            }
                          />
                        </div>
                      )}

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete review from ${review.name}`}
                        className={
                          review.status === "approved"
                            ? "text-muted-foreground hover:text-destructive"
                            : "ml-auto text-muted-foreground hover:text-destructive"
                        }
                        onClick={() => setPendingDelete(review)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AdminCard>
              ))}
            </div>
          )}
        </div>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
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
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete review"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
