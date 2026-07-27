import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, Loader2, Quote } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/shared/SectionHeader";
import { cn, sleep, formatDate } from "@/lib/utils";
import { STATIC_REVIEWS } from "@/data/reviews";
import type { Review, ReviewFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  content: z.string().min(20, "Review must be at least 20 characters").max(1000),
  rating: z.number().min(1).max(5),
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

  return (
    <div className={cn("flex gap-1", !readonly && "cursor-pointer")}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-5 w-5 transition-colors",
            star <= display
              ? "fill-amber-400 text-amber-400"
              : "text-muted-foreground/30",
            !readonly && "hover:scale-110"
          )}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          onClick={() => !readonly && onChange?.(star)}
          aria-label={`${star} star${star !== 1 ? "s" : ""}`}
        />
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
      className="relative rounded-2xl border bg-background p-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
    >
      <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/10" aria-hidden="true" />
      <StarRating value={review.rating} readonly />
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">&ldquo;{review.content}&rdquo;</p>
      <div className="flex items-center gap-2.5 mt-4">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4f46e5] to-[#a855f7] flex items-center justify-center text-white text-xs font-bold shrink-0">
          {review.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium">{review.name}</p>
          <p className="text-xs text-muted-foreground">{formatDate(review.created_at)}</p>
        </div>
      </div>
    </motion.div>
  );
}

function WriteReviewForm({ onSubmitted }: { onSubmitted: (r: Review) => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
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
    setSubmitting(true);
    await sleep(900);
    const newReview: Review = {
      id: `local-${Date.now()}`,
      created_at: new Date().toISOString(),
      name: data.name,
      content: data.content,
      rating: data.rating,
    };
    onSubmitted(newReview);
    reset();
    setDone(true);
    setSubmitting(false);
  };

  if (done) {
    return (
      <div className="flex flex-col items-center text-center py-6">
        <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
        <p className="font-medium text-sm">Thanks for your review!</p>
        <p className="text-xs text-muted-foreground mt-1">Your feedback helps others trust us.</p>
        <Button variant="ghost" size="sm" className="mt-4" onClick={() => setDone(false)}>
          Write another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label>Your Rating</Label>
        <StarRating value={rating} onChange={(v) => setValue("rating", v)} />
        {errors.rating && (
          <p className="text-xs text-destructive">{errors.rating.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rev-name">Your Name</Label>
        <Input
          id="rev-name"
          placeholder="Jane Smith"
          className={cn(errors.name && "border-destructive")}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="rev-content">Your Review</Label>
        <Textarea
          id="rev-content"
          rows={4}
          placeholder="Tell us about your experience working with Sterova…"
          className={cn(errors.content && "border-destructive")}
          {...register("content")}
        />
        {errors.content && (
          <p className="text-xs text-destructive">{errors.content.message}</p>
        )}
      </div>
      <Button
        type="submit"
        variant="gradient"
        className="w-full"
        disabled={submitting}
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
      </Button>
    </form>
  );
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>(STATIC_REVIEWS);

  const handleNewReview = (r: Review) => {
    setReviews((prev) => [r, ...prev]);
  };

  return (
    <section id="reviews" className="py-24">
      <div className="container-custom">
        <SectionHeader
          badge="Reviews"
          title="Real feedback from real clients"
          description="Honest reviews from the teams we've worked with."
          centered
          className="mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Review grid */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="popLayout">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {reviews.map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} />
                ))}
              </div>
            </AnimatePresence>
          </div>

          {/* Write a review */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/60 bg-background p-6 shadow-sm sticky top-24">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Star className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-semibold text-base">Write a Review</h3>
              </div>
              <WriteReviewForm onSubmitted={handleNewReview} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
