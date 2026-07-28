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
import JsonLd from "@/components/shared/JsonLd";
import { SERVICES, FAQS } from "@/data/constants";

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Custom software development company" 
        description="Sterova is a custom software development company building high-performance web applications, mobile apps, and scalable digital products for modern enterprises."
        canonical="/" 
      />
      <JsonLd type={['website', 'organization', 'faqs']} faqs={FAQS} />
      <HeroSection />
      <ServicesSection services={SERVICES} showCta={false} />
      <PortfolioSection featuredOnly showCta />
      <TechStackSection />
      <ProcessSection />
      <IndustriesSection />
      <ReviewsSection />
      <FAQSection faqs={FAQS} limit={6} />
      <CTASection />
    </>
  );
}
