import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { heroContent } from "@/data/landing-content";

const HeroSection = () => {
  const heroTitleLead = heroContent.title.replace(" inquiries.", "");

  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-14 pt-24 md:pb-20 md:pt-24"
    >
      <div className="absolute inset-0">
        <div className="absolute left-[-8rem] top-8 h-64 w-64 rounded-full bg-white/80 blur-[110px]" />
        <div className="absolute right-[-8rem] top-20 h-80 w-80 rounded-full bg-foreground/[0.04] blur-[140px]" />
        <div className="absolute bottom-0 left-1/2 h-px w-[min(92vw,78rem)] -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="section-shell relative overflow-hidden px-6 py-8 sm:px-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(0_0%_100%_/_0.92),transparent_38%),linear-gradient(135deg,hsl(36_40%_94%_/_0.7),transparent_58%)]" />
          <div className="absolute inset-y-0 right-0 hidden w-[41%] border-l border-border/60 bg-[linear-gradient(180deg,hsl(24_20%_9%),hsl(24_14%_14%))] lg:block" />
          <div className="absolute right-[15%] top-16 hidden h-40 w-40 rounded-full bg-white/10 blur-[90px] lg:block" />

          <div className="relative grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_31rem] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="inline-flex max-w-full items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.32em] text-text-secondary"
              >
                <span className="h-px w-8 bg-border" />
                <span className="truncate">{heroContent.eyebrow}</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="mt-6 text-4xl font-display font-extrabold leading-[0.96] tracking-[-0.04em] md:text-6xl lg:max-w-[12ch] lg:text-[4.6rem]"
              >
                {heroTitleLead} <span className="gradient-text">inquiries.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg md:text-[1.15rem]"
              >
                {heroContent.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.8 }}
                className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4 lg:justify-start"
              >
                <Button variant="hero" size="xl" asChild>
                  <a href="#contact">
                    {heroContent.primaryCta} <ArrowRight className="ml-1 h-5 w-5" />
                  </a>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <a href="#work">{heroContent.secondaryCta}</a>
                </Button>
              </motion.div>

              <div className="mt-10 grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-3">
                {heroContent.proofLine.map((item, index) => (
                  <div key={item} className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
                      0{index + 1}
                    </p>
                    <p className="text-sm leading-6 text-foreground/88">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.9 }}
              className="relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,hsl(24_20%_9%),hsl(24_14%_14%))] p-6 text-white premium-shadow"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,hsl(0_0%_100%_/_0.12),transparent_34%),radial-gradient(circle_at_bottom_left,hsl(34_55%_70%_/_0.12),transparent_28%)]" />
              <div className="relative rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-5">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                      {heroContent.visual.label}
                    </p>
                    <h2 className="text-lg font-display font-semibold text-white md:text-xl">
                      {heroContent.visual.title}
                    </h2>
                  </div>
                  <div className="h-3 w-3 rounded-full bg-[#d2c3a5]" />
                </div>

                <div className="mt-6 space-y-3">
                  {heroContent.visual.phases.map((phase, index) => (
                    <div
                      key={phase}
                      className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 md:grid-cols-[auto_1fr_auto] md:items-center"
                    >
                      <span className="text-sm font-semibold text-white/48">0{index + 1}</span>
                      <p className="text-sm leading-6 text-white/88">{phase}</p>
                      <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
                        Active
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-4 border-t border-white/10 pt-6 sm:grid-cols-3">
                  {heroContent.visual.metrics.map((metric) => (
                    <div key={metric.label}>
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/48">
                        {metric.label}
                      </p>
                      <p className="mt-3 text-lg font-display font-semibold text-white">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
