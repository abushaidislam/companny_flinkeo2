import { motion } from "framer-motion";
import { Check } from "lucide-react";

import SectionIntro from "@/components/landing/SectionIntro";
import { Button } from "@/components/ui/button";
import { pricingSection, primaryConsultationLabel } from "@/data/landing-content";

const PricingSection = () => {
  return (
    <section id="pricing" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow={pricingSection.copy.eyebrow}
          title={pricingSection.copy.title}
          description={pricingSection.copy.description}
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {pricingSection.plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={`glass-card relative p-8 transition-transform duration-300 hover:scale-[1.02] ${
                plan.popular ? "border-foreground/20 premium-shadow" : ""
              }`}
            >
              {plan.popular ? (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-display font-bold text-primary-foreground">
                  Recommended
                </span>
              ) : null}
              <h3 className="mb-1 text-xl font-display font-bold text-foreground">{plan.name}</h3>
              <p className="mb-4 text-sm text-text-secondary">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-display font-extrabold text-foreground">{plan.price}</span>
                <span className="ml-1 text-sm text-text-secondary">{plan.period}</span>
              </div>
              <ul className="mb-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? "hero" : "heroOutline"} size="lg" className="w-full" asChild>
                <a href="#contact">{primaryConsultationLabel}</a>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
