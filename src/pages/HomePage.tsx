import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ReviewFormSection from "@/components/sections/ReviewFormSection";
import BentoGridSection from "@/components/sections/BentoGridSection";
import TechStackSection from "@/components/sections/TechStackSection";

import CTASection from "@/components/sections/CTASection";
import { SERVICES } from "@/data/constants";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection
        services={SERVICES.filter((s) => s.id !== "maintenance-support")}
        showCta={false}
      />
      <TechStackSection />
      <BentoGridSection />
      <PortfolioSection featuredOnly showCta />
      <ReviewsSection />
      <ReviewFormSection />

      <CTASection />
    </>
  );
}
