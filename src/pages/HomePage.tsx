import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProcessSection from "@/components/sections/ProcessSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import { SERVICES, PORTFOLIO_ITEMS, TESTIMONIALS, FAQS } from "@/data/constants";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection services={SERVICES} limit={6} showCta />
      <PortfolioSection items={PORTFOLIO_ITEMS} featuredOnly showCta />
      <TechStackSection />
      <ProcessSection />
      <IndustriesSection />
      <TestimonialsSection testimonials={TESTIMONIALS} />
      <ReviewsSection />
      <FAQSection faqs={FAQS} limit={6} />
      <CTASection />
    </>
  );
}
