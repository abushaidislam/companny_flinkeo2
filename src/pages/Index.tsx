import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import LaunchAssetsSection from "@/components/landing/LaunchAssetsSection";
import TrustBadgesSection from "@/components/landing/TrustBadgesSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import PortfolioSection from "@/components/landing/PortfolioSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import CTASection from "@/components/landing/CTASection";
import ContactForm from "@/components/landing/ContactForm";
import { Footer } from "@/components/ui/footer-section";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LaunchAssetsSection />
      <TrustBadgesSection />
      <FeaturesSection />
      <PortfolioSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
