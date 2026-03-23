import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { heroContent } from "@/data/landing-content";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-b from-background via-muted/40 to-background pb-16 pt-28 md:pb-24"
    >
      <div className="absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-foreground/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-foreground/5 blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-16">
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
              className="inline-flex max-w-full items-center rounded-full border border-border bg-card px-3 py-2 text-xs font-medium uppercase tracking-[0.18em] text-text-secondary premium-shadow sm:px-4"
            >
              <span className="truncate">{heroContent.eyebrow}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="mt-6 text-4xl font-display font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl"
            >
              Websites and product experiences built to turn attention into{" "}
              <span className="gradient-text">inquiries.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-base text-text-secondary sm:text-lg md:text-xl"
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

            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              {heroContent.proofLine.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-text-secondary"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="glass-card w-full overflow-hidden rounded-[2rem] border-border/70 bg-card/90 p-3 premium-shadow"
          >
            <div className="rounded-[1.5rem] border border-border/70 bg-background p-6">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-5">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                    {heroContent.visual.label}
                  </p>
                  <h2 className="text-lg font-display font-semibold text-foreground md:text-xl">
                    {heroContent.visual.title}
                  </h2>
                </div>
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {heroContent.visual.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-2xl border border-border bg-card p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-text-secondary">
                      {metric.label}
                    </p>
                    <p className="mt-2 text-lg font-display font-semibold text-foreground">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {heroContent.visual.phases.map((phase, index) => (
                  <div
                    key={phase}
                    className="flex items-center justify-between rounded-2xl border border-border bg-card px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                        0{index + 1}
                      </span>
                      <p className="text-sm text-foreground">{phase}</p>
                    </div>
                    <span className="text-xs text-text-secondary">In progress</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
