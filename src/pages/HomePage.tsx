import HeroSection from "@/components/sections/HeroSection";
import ServicesSection from "@/components/sections/ServicesSection";
import PortfolioSection from "@/components/sections/PortfolioSection";
import TechStackSection from "@/components/sections/TechStackSection";
import ProcessSection from "@/components/sections/ProcessSection";
import IndustriesSection from "@/components/sections/IndustriesSection";
import ReviewsSection from "@/components/sections/ReviewsSection";
import ReviewFormSection from "@/components/sections/ReviewFormSection";
import FAQSection from "@/components/sections/FAQSection";
import CTASection from "@/components/sections/CTASection";
import BlogPreviewSection from "@/components/sections/BlogPreviewSection";
import StatsSection from "@/components/sections/StatsSection";
import WhyChooseUsSection from "@/components/sections/WhyChooseUsSection";
import { SERVICES, FAQS } from "@/data/constants";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection services={SERVICES} showCta={false} />
      <PortfolioSection featuredOnly showCta />
      <StatsSection />
      <TechStackSection />
      <ProcessSection />
      <IndustriesSection />
      <ReviewsSection />
      <ReviewFormSection />
      <BlogPreviewSection />
      <WhyChooseUsSection />
      <FAQSection faqs={FAQS} limit={6} />
      <CTASection />
    </>
  );
}
