import { motion, useReducedMotion } from "framer-motion";

import SectionIntro from "@/components/landing/SectionIntro";
import { FeatureCard } from "@/components/ui/grid-feature-cards";
import { servicesSection } from "@/data/landing-content";

type ViewAnimationProps = {
  delay?: number;
  className?: string;
  children: React.ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ filter: "blur(4px)", y: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const FeaturesSection = () => {
  return (
    <section id="services" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-6xl space-y-12">
          <AnimatedContainer className="mx-auto max-w-3xl">
            <SectionIntro
              eyebrow={servicesSection.copy.eyebrow}
              title={servicesSection.copy.title}
              description={servicesSection.copy.description}
            />
          </AnimatedContainer>

          <AnimatedContainer
            delay={0.35}
            className="grid grid-cols-1 divide-y divide-dashed overflow-hidden rounded-3xl border border-dashed sm:grid-cols-2 sm:divide-x sm:divide-y"
          >
            {servicesSection.items.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
