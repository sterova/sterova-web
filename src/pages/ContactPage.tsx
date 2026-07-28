import { Mail, MessageCircle, MapPin } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import AnimatedSection from "@/components/shared/AnimatedSection";
import ContactForm from "@/components/forms/ContactForm";
import SEO from "@/components/shared/SEO";
import JsonLd from "@/components/shared/JsonLd";
import { SITE, CONTACT } from "@/data/constants";
import { getWhatsAppUrl } from "@/lib/utils";

const waUrl = getWhatsAppUrl(SITE.whatsapp, "Hi Sterova, I'd like to get in touch.");

const contactDetails = [
  {
    icon: Mail,
    label: "Email",
    value: SITE.email,
    href: `mailto:${SITE.email}`,
    external: false,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.whatsappDisplay,
    href: waUrl,
    external: true,
  },
  ...(SITE.address && SITE.address !== "[ADDRESS_PLACEHOLDER]"
    ? [{ icon: MapPin, label: "Office", value: SITE.address, href: null, external: false }]
    : []),
];

export default function ContactPage() {
  return (
    <>
      <SEO
        title="Hire software developers"
        description="Get in touch with Sterova to discuss your next project. We are an engineering-first software company offering custom applications."
        canonical="/contact"
      />
      <JsonLd 
        type={['website', 'organization', 'breadcrumb']} 
        breadcrumbs={[
          { name: 'Home', item: '/' },
          { name: 'Contact', item: '/contact' }
        ]}
      />
      <section className="pt-32 pb-24">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left */}
          <div className="lg:col-span-2">
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

            {/* Response time */}
            <AnimatedSection delay={0.2} className="mt-8 rounded-xl border bg-primary/5 border-primary/20 p-5">
              <p className="text-sm font-semibold text-primary mb-1">⚡ Fast response</p>
              <p className="text-sm text-muted-foreground">
                We reply to every inquiry within 24 hours. For urgent matters, WhatsApp gets you a faster reply.
              </p>
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
    </>
  );
}
