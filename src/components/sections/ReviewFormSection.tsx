import { useState } from "react";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import SectionHeader from "@/components/shared/SectionHeader";
import StarRating from "@/components/shared/StarRating";
import { submitReview } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ReviewFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  content: z.string().min(20, "Review must be at least 20 characters").max(1000),
  rating: z.number().min(1, "Please choose a rating").max(5),
});

function WriteReviewForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
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
  const content = watch("content") ?? "";

  const onSubmit = async (data: ReviewFormData) => {
    setStatus("loading");
    try {
      await submitReview(data);
      reset({ rating: 0 });
      setStatus("done");
    } catch (err) {
      console.error("[sterova] review submit failed:", err);
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl border border-success/30 bg-success/10">
          <CheckCircle2 className="h-6 w-6 text-success" aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-lg font-semibold tracking-tight">
          Thanks for your review
        </p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
          We read every submission before publishing, so it may take a little while to appear on the
          site.
        </p>
        <Button variant="outline" size="sm" className="mt-6" onClick={() => setStatus("idle")}>
          Write another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="space-y-2">
        <Label>Your rating</Label>
        <StarRating
          value={rating}
          size="lg"
          onChange={(v: number) => setValue("rating", v, { shouldValidate: true })}
        />
        {errors.rating && (
          <p className="text-xs text-destructive" role="alert">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="rev-name">Your name</Label>
        <Input
          id="rev-name"
          placeholder="Jane Smith"
          aria-invalid={!!errors.name}
          className={cn("h-11", errors.name && "border-destructive")}
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-destructive" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor="rev-content">Your review</Label>
          <span className="font-mono text-[11px] text-muted-foreground">{content.length}/1000</span>
        </div>
        <Textarea
          id="rev-content"
          rows={5}
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
          className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          We couldn&apos;t submit your review. Please try again in a moment.
        </div>
      )}

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting…
          </>
        ) : (
          "Submit review"
        )}
      </Button>
    </form>
  );
}

/** Standalone "leave a review" section, deliberately separate from the wall. */
export default function ReviewFormSection() {
  return (
    <section id="write-review" className="relative section-y bg-surface">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-border to-transparent"
        aria-hidden="true"
      />
      <div className="container-custom">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              badge="Leave a review"
              title="Worked with us? Tell the next team."
              description="Your feedback shapes how we work and helps other founders judge whether we're the right engineering partner."
            />
          </div>

          <div className="lg:col-span-7">
            <div className="card-premium sheen p-6 sm:p-8 lg:p-10">
              <WriteReviewForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
