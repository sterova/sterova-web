import { useState } from "react";
import { Star, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/shared/SectionHeader";
import { fetchApprovedReviews, submitReview } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ReviewFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  content: z
    .string()
    .min(20, "Review must be at least 20 characters")
    .max(1000),
  rating: z.number().min(1, "Please choose a rating").max(5),
});

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

  if (readonly) {
    return (
      <div
        className="flex gap-1"
        role="img"
        aria-label={`${value} out of 5 stars`}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={cn(
              "h-4 w-4",
              star <= display
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30",
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange?.(star)}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          aria-pressed={value === star}
          className="rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Star
            aria-hidden="true"
            className={cn(
              "h-5 w-5 transition-transform hover:scale-110",
              star <= display
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function WriteReviewForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0 },
  });
  const rating = watch("rating");

  const onSubmit = async (data: ReviewFormData) => {
    setStatus("loading");
    try {
      await submitReview(data);
      reset({ rating: 0 });
      setStatus("done");
    } catch (err) {
      console.error("[v0] review submit failed:", err);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <CheckCircle2
          className="h-10 w-10 text-green-500 mb-3"
          aria-hidden="true"
        />
        <p className="font-medium text-sm">Thanks for your review!</p>
        {/* Reviews land in the CMS as `pending`, so we must not imply it is
            already live on the site. */}
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          We read every submission before publishing, so it may take a little
          while to appear here.
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="mt-4"
          onClick={() => setStatus("idle")}
        >
          Write another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="space-y-1.5">
        <Label>Your Rating</Label>
        <StarRating value={rating} onChange={(v) => setValue("rating", v)} />
        {errors.rating && (
          <p className="text-xs text-destructive" role="alert">
            {errors.rating.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rev-name">Your Name</Label>
        <Input
          id="rev-name"
          placeholder="Jane Smith"
          aria-invalid={!!errors.name}
          className={cn(errors.name && "border-destructive")}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rev-content">Your Review</Label>
        <Textarea
          id="rev-content"
          rows={4}
          placeholder="Tell us about your experience working with Sterova…"
          aria-invalid={!!errors.content}
          className={cn(errors.content && "border-destructive")}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-xs text-destructive" role="alert">
            {errors.content.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
          We couldn&apos;t submit your review. Please try again in a moment.
        </div>
      )}

      <Button
        type="submit"
        variant="gradient"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          "Submit Review"
        )}
      </Button>
    </form>
  );
}

export default function ReviewsSection() {
  const { data } = useQuery({
    queryKey: ["approved-reviews"],
    queryFn: fetchApprovedReviews,
  });

  const reviews = data ?? [];
  const hasReviews = reviews.length > 0;

  return (
    <section id="reviews" className="py-24">
      <div className="container-custom">
        <SectionHeader
          badge="Reviews"
          title={hasReviews ? "What clients say" : "Share your experience"}
          description={
            hasReviews
              ? "Feedback from the teams we've built with. Worked with us? Add yours below."
              : "Worked with us? Leave a review. We publish client feedback here as we collect it."
          }
          centered
          className="mb-12"
        />

        <div
          className={cn(
            "gap-8",
            hasReviews ? "grid lg:grid-cols-3" : "flex justify-center",
          )}
        >
          {/* Approved reviews */}
          {hasReviews && (
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start">
              {reviews.map((review) => (
                <figure
                  key={review.id}
                  className="flex flex-col rounded-2xl border border-border/60 bg-background p-5 shadow-sm"
                >
                  <StarRating value={review.rating} readonly />
                  <blockquote className="text-sm text-muted-foreground leading-relaxed mt-3 flex-1">
                    {review.content}
                  </blockquote>
                  <figcaption className="mt-4 pt-4 border-t border-border/50">
                    <p className="text-sm font-medium">{review.name}</p>
                    {(review.role || review.company) && (
                      <p className="text-xs text-muted-foreground">
                        {[review.role, review.company]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}

          {/* Write a review */}
          <div className={cn(!hasReviews && "w-full max-w-md")}>
            <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="h-4 w-4 text-primary" aria-hidden="true" />
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
