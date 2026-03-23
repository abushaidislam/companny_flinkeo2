import { motion } from "framer-motion";

import { trustSection } from "@/data/landing-content";

const TrustBadgesSection = () => {
  return (
    <section id="trust" className="border-y border-border/50 bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
            {trustSection.eyebrow}
          </p>
        </div>

        <div className="mb-10 overflow-hidden rounded-full border border-border bg-card/70 py-4">
          <div className="relative">
            <div className="flex gap-8 animate-marquee">
              {[...trustSection.logos, ...trustSection.logos].map((logo, index) => (
                <div key={`${logo}-${index}`} className="flex-shrink-0 px-6 py-3">
                  <span className="whitespace-nowrap text-2xl font-display font-bold text-foreground/80 transition-colors hover:text-foreground md:text-3xl">
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 gap-4 text-center md:grid-cols-3"
        >
          {trustSection.stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-border bg-card px-6 py-5"
            >
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;
