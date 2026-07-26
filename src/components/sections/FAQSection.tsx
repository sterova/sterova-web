"use client";

import React from "react";
import SectionHeader from "@/components/shared/SectionHeader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { DbFaq } from "@/types";

interface Props {
  faqs: DbFaq[];
  limit?: number;
}

export default function FAQSection({ faqs, limit }: Props) {
  const displayed = limit ? faqs.slice(0, limit) : faqs;

  if (displayed.length === 0) return null;

  return (
    <section id="faq" className="py-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <SectionHeader
              badge="FAQ"
              title="Questions we hear a lot"
              description="If you don't find your answer here, reach out — we're happy to talk through your specific situation."
            />
          </div>

          <div>
            <Accordion type="single" collapsible className="space-y-2">
              {displayed.map((faq, i) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${i}`}
                  className="rounded-xl border px-5 bg-background data-[state=open]:border-primary/40"
                >
                  <AccordionTrigger className="text-left font-medium text-sm py-4 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
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
