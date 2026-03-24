import { motion, useReducedMotion } from "framer-motion";

import SectionIntro from "@/components/landing/SectionIntro";
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
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-16">
          <AnimatedContainer className="lg:sticky lg:top-28 lg:self-start">
            <SectionIntro
              eyebrow={servicesSection.copy.eyebrow}
              title={servicesSection.copy.title}
              description={servicesSection.copy.description}
              align="left"
              className="mb-0"
            />
          </AnimatedContainer>

          <AnimatedContainer
            delay={0.35}
            className="border-t border-border/70"
          >
            <div className="space-y-1">
              {servicesSection.items.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.55 }}
                  className="grid gap-5 border-b border-border/70 py-8 md:grid-cols-[auto_minmax(0,15rem)_1fr] md:gap-8 md:py-10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/80">
                    <feature.icon className="h-5 w-5 text-foreground/80" strokeWidth={1.65} />
                  </div>
                  <h3 className="text-xl font-display font-semibold tracking-tight text-foreground md:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="max-w-xl text-sm leading-7 text-text-secondary md:text-base">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
