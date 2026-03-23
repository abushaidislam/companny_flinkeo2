import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { finalCtaSection } from "@/data/landing-content";

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card relative mx-auto max-w-4xl overflow-hidden p-12 text-center md:p-16"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent" />
          <div className="relative z-10">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
              {finalCtaSection.eyebrow}
            </p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-display font-bold text-foreground md:text-5xl">
              {finalCtaSection.title}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
              {finalCtaSection.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">
                  {finalCtaSection.buttonLabel} <ArrowRight className="ml-1 h-5 w-5" />
                </a>
              </Button>
              <p className="text-xs text-text-secondary">{finalCtaSection.supportText}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
