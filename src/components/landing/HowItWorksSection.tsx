import { motion } from "framer-motion";

import SectionIntro from "@/components/landing/SectionIntro";
import { processSection } from "@/data/landing-content";

const HowItWorksSection = () => {
  return (
    <section id="process" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow={processSection.copy.eyebrow}
          title={processSection.copy.title}
          description={processSection.copy.description}
        />

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {processSection.steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="rounded-3xl border border-border bg-card px-6 py-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-semibold uppercase tracking-[0.18em] text-text-secondary">
                  {step.step}
                </span>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <step.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <h3 className="mb-3 text-xl font-display font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
