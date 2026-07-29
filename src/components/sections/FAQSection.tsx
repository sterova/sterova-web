import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/types";

interface Props {
  faqs: Faq[];
  limit?: number;
}

export default function FAQSection({ faqs, limit }: Props) {
  const displayed = limit ? faqs.slice(0, limit) : faqs;
  if (displayed.length === 0) return null;

  return (
    <section id="faq" className="section-y">
      <div className="container-custom">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <SectionHeader
                badge="FAQ"
                title="Questions we hear a lot"
                description="If yours isn't here, just ask. We'd rather talk than make you guess."
              />
              <Button asChild variant="outline" size="lg" className="group mt-8">
                <Link href="/contact">
                  Ask us directly
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-8">
            <Accordion
              type="single"
              collapsible
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-[var(--shadow-card)]"
            >
              {displayed.map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${i}`}
                  className="border-b border-border px-6 last:border-b-0 data-[state=open]:bg-accent/40 xl:px-8"
                >
                  <AccordionTrigger className="gap-6 py-5 text-left font-display text-[0.975rem] font-medium tracking-tight hover:no-underline xl:text-base">
                    <span className="flex min-w-0 items-baseline gap-4">
                      <span className="font-mono text-[11px] text-primary">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-[2.25rem] text-sm leading-[1.75] text-text-secondary">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
