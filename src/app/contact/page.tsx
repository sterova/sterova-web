import type { Metadata } from "next";
import { Mail, MessageCircle, Clock } from "lucide-react";
import ContactForm from "@/components/forms/ContactForm";
import AnimatedSection from "@/components/shared/AnimatedSection";
import SectionHeader from "@/components/shared/SectionHeader";
import { CONTACT, SITE } from "@/data/constants";
import { getWhatsAppUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: `Start a project with ${SITE.name}. Reach out to discuss your software development needs — we respond within 24 hours.`,
  alternates: { canonical: "/contact" },
};

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.whatsappDisplay,
    href: getWhatsAppUrl(SITE.whatsapp, "Hi Sterova! I'd like to discuss a project."),
    external: true,
  },
  {
    icon: Clock,
    label: "Response time",
    value: "Within 24 hours",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <section className="pt-32 pb-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
          {/* Left column */}
          <div className="lg:col-span-2 lg:sticky lg:top-28">
            <AnimatedSection>
              <SectionHeader
                badge="Contact"
                title={CONTACT.heading}
                description={CONTACT.subheading}
              />
            </AnimatedSection>

            <AnimatedSection delay={0.1} className="mt-10 space-y-4">
              {contactDetails.map(({ icon: Icon, label, value, href, external }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 rounded-xl border bg-background p-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </AnimatedSection>
          </div>

          {/* Form */}
          <AnimatedSection
            className="lg:col-span-3 rounded-2xl border bg-background p-8"
            delay={0.1}
            direction="right"
          >
            <ContactForm />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
