import type { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ProcessSection from "@/components/sections/ProcessSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import TechStackSection from "@/components/sections/TechStackSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import { getPortfolioItems, getTestimonials, getFaqs, getSiteSettings } from "@/lib/content";
import { SERVICES, SITE } from "@/data/constants";
import { toDbService } from "@/lib/static-content";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const services = SERVICES.map(toDbService);
  const [portfolioItems, testimonials, faqs, settings] =
    await Promise.all([
      getPortfolioItems(),
      getTestimonials(),
      getFaqs(6),
      getSiteSettings(),
    ]);

  return (
    <>
      <HeroSection settings={settings} />
      <ServicesSection services={services} limit={6} showCta />
      <PortfolioSection items={portfolioItems} featuredOnly showCta />
      <TechStackSection />
      <ProcessSection />
      <IndustriesSection />
      <TestimonialsSection testimonials={testimonials} />
      <ReviewsSection />
      <FAQSection faqs={faqs} limit={6} />
      <CTASection />
    </>
  );
}
