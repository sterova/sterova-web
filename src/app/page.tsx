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
import { SITE } from "@/data/constants";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection limit={6} showCta />
      <PortfolioSection featuredOnly showCta />
      <TechStackSection />
      <ProcessSection />
      <IndustriesSection />
      <TestimonialsSection />
      <ReviewsSection />
      <FAQSection limit={6} />
      <CTASection />
    </>
  );
}
