import { useQuery } from "@tanstack/react-query";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import CTASection from "@/components/sections/CTASection";
import StarRating from "@/components/shared/StarRating";
import ReviewFormSection from "@/components/sections/ReviewFormSection";
import { fetchPublishedTestimonials } from "@/lib/cms-api";
import { TESTIMONIALS } from "@/data/constants";
import { Quote } from "lucide-react";

function Avatar({ name, company }: { name: string; company?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/20 text-sm font-bold text-primary">
      {initials}
    </div>
  );
}

export default function TestimonialsPage() {
  const { data: liveTestimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: fetchPublishedTestimonials,
  });

  const testimonials =
    liveTestimonials && liveTestimonials.length > 0 ? liveTestimonials : TESTIMONIALS;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-surface pt-36 pb-20">
        <div
          className="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -top-1/3 left-1/2 aspect-square w-[60rem] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl"
          aria-hidden="true"
        />
        <div className="container-custom relative text-center max-w-4xl mx-auto">
          <AnimatedSection>
            <SectionHeader
              badge="Social Proof"
              title="What our clients say"
              description="Real feedback from startups and enterprises we've partnered with. We let the results speak."
              centered
              size="page"
            />
          </AnimatedSection>
          {/* Aggregate rating */}
          <AnimatedSection delay={0.15}>
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3">
              <StarRating value={5} readonly size="sm" />
              <span className="text-sm font-semibold">5.0 average</span>
              <span className="text-sm text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">{testimonials.length} reviews</span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials masonry */}
      <section className="section-y bg-background">
        <div className="container-custom">
          <div className="columns-1 md:columns-2 xl:columns-3 gap-5 space-y-5">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.id} delay={i * 0.06} className="break-inside-avoid">
                <div className="card-premium p-6 flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <Quote className="h-7 w-7 text-primary/40" />
                    <StarRating value={t.rating ?? 5} readonly size="sm" />
                  </div>
                  <p className="text-sm text-foreground/90 leading-relaxed italic">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                    <Avatar name={t.name} company={t.company ?? undefined} />
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role}
                        {t.company ? `, ${t.company}` : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Submit a review */}
      <ReviewFormSection />

      <CTASection />
    </>
  );
}
