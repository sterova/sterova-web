"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, Quote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import { TESTIMONIALS } from "@/data/constants";

interface Review {
  id: string;
  created_at: string;
  name: string;
  content: string;
  rating: number;
}

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;

  return (
    <div
      className="flex gap-1"
      onMouseLeave={() => !readonly && setHovered(0)}
      aria-label={`${value} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          className={cn(
            "transition-transform duration-100",
            !readonly && "hover:scale-125 cursor-pointer",
            readonly && "cursor-default"
          )}
          aria-label={readonly ? undefined : `Rate ${star} star${star !== 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              "h-4 w-4 transition-colors",
              star <= display
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/30"
            )}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-background p-6",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
      )}
    >
      <Quote
        className="absolute top-5 right-5 h-7 w-7 text-primary/10"
        aria-hidden="true"
      />

      <div className="mb-3">
        <StarRating value={review.rating} readonly />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-5">
        &ldquo;{review.content}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sterova-400 to-violet-500 flex items-center justify-center text-white text-sm font-bold shrink-0 dark:from-sterova-500 dark:to-violet-600">
          {review.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold">{review.name}</p>
          <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
        </div>
      </div>
    </motion.div>
  );
}

function WriteReviewForm() {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (content.trim().length < 10) {
      setError("Review must be at least 10 characters.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "Anonymous",
          content: content.trim(),
          rating,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
        setName("");
        setContent("");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating */}
      <div>
        <label className="text-sm font-medium block mb-2">Your Rating</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Name */}
      <div>
        <label htmlFor="review-name" className="text-sm font-medium block mb-1.5">
          Name{" "}
          <span className="text-muted-foreground font-normal">(optional — anonymous by default)</span>
        </label>
        <input
          id="review-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Anonymous"
          maxLength={100}
          className={cn(
            "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
            "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring",
            "transition-all duration-150"
          )}
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="review-content" className="text-sm font-medium block mb-1.5">
          Your Review <span className="text-destructive">*</span>
        </label>
        <textarea
          id="review-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your experience working with Sterova…"
          rows={4}
          maxLength={2000}
          required
          className={cn(
            "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm",
            "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring",
            "resize-none transition-all duration-150"
          )}
        />
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {content.length}/2000
        </p>
      </div>

      {success && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-green-700 bg-green-500/10 rounded-lg px-4 py-2.5"
        >
          Thanks for your review. It will appear after approval.
        </motion.p>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5"
        >
          {error}
        </motion.p>
      )}

      <Button
        type="submit"
        variant="gradient"
        className="w-full gap-2 shadow-md shadow-primary/20"
        disabled={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Submit Review
          </>
        )}
      </Button>
    </form>
  );
}

const FALLBACK_REVIEWS: Review[] = TESTIMONIALS.slice(0, 4).map((item) => ({
  id: `fallback-${item.id}`,
  created_at: new Date(0).toISOString(),
  name: item.name,
  content: item.content,
  rating: item.rating,
}));
const REVIEWS_CACHE_KEY = "sterova:reviews:v1";

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(FALLBACK_REVIEWS);
  const [loading, setLoading] = useState(false);
  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
          localStorage.setItem(REVIEWS_CACHE_KEY, JSON.stringify(data));
        }
      }
    } catch {
      // Keep cached or fallback reviews visible on network/database failure.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = localStorage.getItem(REVIEWS_CACHE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) setReviews(parsed);
      } catch {
        localStorage.removeItem(REVIEWS_CACHE_KEY);
      }
    }
    fetchReviews();
  }, [fetchReviews]);


  return (
    <section id="reviews" className="py-24 bg-secondary/30 dark:bg-secondary/20">
      <div className="container-custom">
        <SectionHeader
          badge="Customer Reviews"
          title="What our clients say"
          description="Real feedback from people who've shipped products with us."
          centered
          className="mb-16"
        />

        {/* Two-column layout: reviews grid + write form side by side on larger screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* Reviews grid — takes 2/3 of the space */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border bg-background p-6 space-y-4">
                    <div className="h-4 w-24 shimmer rounded" />
                    <div className="space-y-2">
                      <div className="h-3 w-full shimmer rounded" />
                      <div className="h-3 w-5/6 shimmer rounded" />
                      <div className="h-3 w-4/6 shimmer rounded" />
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-9 h-9 rounded-full shimmer" />
                      <div className="space-y-1.5">
                        <div className="h-3 w-20 shimmer rounded" />
                        <div className="h-2.5 w-14 shimmer rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : reviews.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 border rounded-2xl bg-background"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-primary/50" />
                </div>
                <p className="text-muted-foreground text-base mb-1">No reviews yet</p>
                <p className="text-sm text-muted-foreground/70">
                  Be the first to share your experience.
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="popLayout">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((review, i) => (
                    <ReviewCard key={review.id} review={review} index={i} />
                  ))}
                </div>
              </AnimatePresence>
            )}
          </div>

          {/* Write a review form — always visible, right column */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-base">Write a Review</h3>
              </div>
              <WriteReviewForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
