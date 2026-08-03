import { Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router-compat";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import StarRating from "@/components/shared/StarRating";
import { fetchApprovedReviews } from "@/lib/api";

/**
 * The published review wall. Submitting a review lives in its own section
 * (ReviewFormSection) so reading proof and giving proof never compete.
 */
export default function ReviewsSection() {
  const { data } = useQuery({
    queryKey: ["approved-reviews"],
    queryFn: fetchApprovedReviews,
  });

  const reviews = data ?? [];
  if (reviews.length === 0) return null;

  const average =
    Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;

  return (
    <section id="reviews" className="section-y">
      <div className="container-custom">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <SectionHeader
              badge="Client reviews"
              title="What the teams we build with say"
              description="Unedited feedback from founders, product leads and CTOs we've shipped with."
            />
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <div className="card-premium flex items-center gap-5 px-6 py-5">
              <div>
                <p className="font-display text-3xl font-semibold tracking-tight">
                  {average.toFixed(1)}
                </p>
              </div>
              <div className="h-10 w-px bg-border" aria-hidden="true" />
              <StarRating value={Math.round(average)} readonly />
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <figure key={review.id} className="card-premium sheen group flex h-full flex-col p-7">
              <div className="flex items-start justify-between gap-4">
                <StarRating value={review.rating} readonly />
                <Quote
                  className="h-6 w-6 shrink-0 text-border-strong transition-colors duration-300 group-hover:text-primary/50"
                  aria-hidden="true"
                />
              </div>
              <blockquote className="mt-5 flex-1 text-[0.975rem] leading-[1.75] text-foreground/90">
                {review.content}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-5">
                <span
                  className="gradient-brand grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-primary-foreground"
                  aria-hidden="true"
                >
                  {review.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold tracking-tight">
                    {review.name}
                  </span>
                  {(review.role || review.company) && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {[review.role, review.company].filter(Boolean).join(", ")}
                    </span>
                  )}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="#write-review">Add your review</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
