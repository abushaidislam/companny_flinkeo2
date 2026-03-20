import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import TrustBadgesSection from "@/components/landing/TrustBadgesSection";
import PortfolioSection from "@/components/landing/PortfolioSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import BlogSection from "@/components/landing/BlogSection";
import NewsletterSection from "@/components/landing/NewsletterSection";
import TechStackSection from "@/components/landing/TechStackSection";
import CostCalculator from "@/components/landing/CostCalculator";
import CTASection from "@/components/landing/CTASection";
import ContactForm from "@/components/landing/ContactForm";
import { Footer } from "@/components/ui/footer-section";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustBadgesSection />
      <PortfolioSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <BlogSection />
      <NewsletterSection />
      <TechStackSection />
      <CostCalculator />
      <CTASection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
