import SectionHeader from "@/components/shared/SectionHeader";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ContactForm from "@/components/forms/ContactForm";
import ContactLinksPanel from "@/components/shared/ContactLinksPanel";
import { Link } from "@/lib/router-compat";
import { ArrowRight } from "lucide-react";
import { CONTACT } from "@/data/constants";

export default function ContactPage() {
  return (
    <section className="pt-36 pb-24">
      <div className="container-custom">
        <AnimatedSection>
          <SectionHeader
            badge="Contact"
            title={CONTACT.heading}
            description={CONTACT.subheading}
            size="page"
          />
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left — form */}
          <AnimatedSection className="lg:col-span-7 xl:col-span-8" delay={0.05}>
            <div className="card-premium p-6 sm:p-8">
              <ContactForm />
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5">
              <p className="text-sm text-muted-foreground">
                Have a specific service in mind? Send a full project brief instead.
              </p>
              <Link
                href="/start-project"
                className="group inline-flex items-center gap-2 rounded-full gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
              >
                Start a project
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </AnimatedSection>

          {/* Right — contact details, socials and professional links */}
          <AnimatedSection className="lg:col-span-5 xl:col-span-4" delay={0.12} direction="right">
            <ContactLinksPanel />
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
