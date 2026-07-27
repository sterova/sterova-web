import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProcessSection from "@/components/sections/ProcessSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import SEO from "@/components/shared/SEO";
import { SERVICES, PORTFOLIO_ITEMS, FAQS } from "@/data/constants";

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Best Website Service Company & Custom Software Services" 
        description="Sterova is the top software service provider and best website service company. We build high-quality web services and mobile apps for startups and enterprises."
        canonical="/" 
      />
      <HeroSection />
      <ServicesSection services={SERVICES} showCta={false} />
      <PortfolioSection items={PORTFOLIO_ITEMS} featuredOnly showCta />
      <TechStackSection />
      <ProcessSection />
      <IndustriesSection />
      <ReviewsSection />
      <FAQSection faqs={FAQS} limit={6} />
      <CTASection />
    </>
  );
}
