"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Trash2, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export default function ReviewsManager({ initialReviews }: { initialReviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initialReviews);

  async function toggleApprove(review: Review) {
    const res = await fetch(`/api/admin/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: !review.approved }),
    });
    if (res.ok) {
      setReviews((r) =>
        r.map((x) => (x.id === review.id ? { ...x, approved: !x.approved } : x))
      );
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this review?")) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    if (res.ok) {
      setReviews((r) => r.filter((x) => x.id !== id));
      router.refresh();
    }
  }

  const approved = reviews.filter((r) => r.approved);
  const pending = reviews.filter((r) => !r.approved);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {approved.length} approved · {pending.length} hidden
        </p>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm rounded-2xl border bg-background">
          No reviews yet.
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Author</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Review</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Rating</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{review.name}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-xs">
                    <p className="line-clamp-2 text-xs">{review.content}</p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell whitespace-nowrap">
                    {formatDate(review.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        review.approved
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {review.approved ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleApprove(review)}
                        className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        title={review.approved ? "Hide" : "Approve"}
                      >
                        {review.approved ? (
                          <XCircle className="h-3.5 w-3.5" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
