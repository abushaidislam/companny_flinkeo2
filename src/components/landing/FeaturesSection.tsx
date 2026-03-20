import { motion, useReducedMotion } from "framer-motion";
import { Code2, Palette, BarChart3, Smartphone, Globe, Zap } from "lucide-react";

import { FeatureCard } from "@/components/ui/grid-feature-cards";

const features = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Custom websites and web apps built with modern frameworks, optimized for speed and scalability.",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description: "User-centered designs that look stunning and convert — from wireframes to pixel-perfect interfaces.",
  },
  {
    icon: Smartphone,
    title: "Responsive Design",
    description: "Every project is fully responsive, ensuring flawless experiences across all devices and screen sizes.",
  },
  {
    icon: BarChart3,
    title: "Conversion Optimization",
    description: "Data-driven design decisions that boost engagement, reduce bounce rates, and increase revenue.",
  },
  {
    icon: Globe,
    title: "Brand Identity",
    description: "Complete brand systems including logos, color palettes, typography, and visual guidelines.",
  },
  {
    icon: Zap,
    title: "Performance & SEO",
    description: "Lightning-fast load times and SEO best practices baked into every project from day one.",
  },
];

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
    <section id="features" className="py-24 md:py-28 relative">
      <div className="container mx-auto px-4">
        <div className="mx-auto w-full max-w-6xl space-y-12">
          <AnimatedContainer className="mx-auto max-w-3xl text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-balance">
              Everything you need to <span className="gradient-text">build a stunning product</span>
            </h2>
            <p className="mt-4 text-text-secondary text-sm md:text-base tracking-wide text-balance">
              From concept to launch — we handle design, development, and optimization so you can focus on your business.
            </p>
          </AnimatedContainer>

          <AnimatedContainer
            delay={0.35}
            className="grid grid-cols-1 divide-y divide-dashed border border-dashed sm:grid-cols-2 sm:divide-x sm:divide-y md:grid-cols-3 rounded-2xl overflow-hidden"
          >
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </AnimatedContainer>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
