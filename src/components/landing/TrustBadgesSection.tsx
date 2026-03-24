import { motion } from "framer-motion";

import { trustSection } from "@/data/landing-content";

const TrustBadgesSection = () => {
  return (
    <section id="trust" className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="section-hairline" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid gap-10 py-8 lg:grid-cols-[18rem_minmax(0,1fr)] lg:items-end"
        >
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
              {trustSection.eyebrow}
            </p>
            <p className="max-w-xs text-sm leading-6 text-text-secondary">
              Selected teams and operators who needed sharper positioning, faster launch flow, and cleaner digital presentation.
            </p>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
              {trustSection.logos.map((logo, index) => (
                <motion.div
                  key={logo}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                >
                  <span className="text-lg font-display font-semibold tracking-tight text-foreground/75 transition-colors duration-300 hover:text-foreground md:text-xl">
                    {logo}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-6 border-t border-border/70 pt-6 sm:grid-cols-3">
              {trustSection.stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.08 }}
                >
                  <p className="text-3xl font-display font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-sm text-text-secondary">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="section-hairline" />
      </div>
    </section>
  );
};

export default TrustBadgesSection;
