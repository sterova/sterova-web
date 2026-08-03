import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import StatsSection from "@/components/sections/StatsSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import { SERVICES, FAQS } from "@/data/constants";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection services={SERVICES} showCta={false} />
      <PortfolioSection featuredOnly showCta />
      <StatsSection />
      <ReviewsSection />
      <FAQSection faqs={FAQS} limit={6} />
      <CTASection />
    </>
  );
}
