import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-background via-muted/40 to-background pb-14 pt-24 sm:pb-16">
      <div className="absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-foreground/5 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-foreground/5 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-xs text-text-secondary premium-shadow sm:px-4 sm:text-sm"
            >
              <Sparkles className="h-4 w-4 text-foreground" />
              <span className="truncate">Trusted by 200+ brands worldwide</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="mx-auto mt-6 max-w-5xl text-4xl font-display font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl"
            >
              We craft digital experiences that
              <span className="gradient-text"> elevate your brand</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mx-auto mt-6 max-w-2xl text-base text-text-secondary sm:text-lg md:text-xl"
            >
              From stunning websites to intuitive UI/UX — we design and develop premium digital products that drive growth, engagement, and conversions.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
              className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:gap-4"
            >
              <Button variant="hero" size="xl" asChild>
                <a href="#pricing">
                  Start Your Project <ArrowRight className="ml-1 h-5 w-5" />
                </a>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="#how-it-works">See Our Process</a>
              </Button>
            </motion.div>

            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-[11px] text-text-secondary sm:text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
              Free consultation • No commitment required
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card px-4 py-3">
                <div className="text-lg font-display font-bold text-foreground">200+</div>
                <div className="text-xs text-text-secondary">Projects delivered</div>
              </div>
              <div className="rounded-xl border border-border bg-card px-4 py-3">
                <div className="text-lg font-display font-bold text-foreground">98%</div>
                <div className="text-xs text-text-secondary">Client satisfaction rate</div>
              </div>
              <div className="rounded-xl border border-border bg-card px-4 py-3">
                <div className="text-lg font-display font-bold text-foreground">5★</div>
                <div className="text-xs text-text-secondary">Average review rating</div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-text-secondary/80">
              Based on verified client reviews and completed projects since 2020.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="glass-card w-full max-w-5xl p-2 premium-shadow"
          >
            <div className="rounded-lg bg-accent p-4 sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-border pb-4">
                <div>
                  <div className="text-sm text-text-secondary">Dashboard</div>
                  <div className="text-base font-display font-bold text-foreground sm:text-lg">Project Overview</div>
                </div>
                <div className="rounded-full border border-border bg-card px-3 py-1 text-xs text-text-secondary">
                  3 active
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="h-2 w-24 bg-foreground/20 rounded mb-2" />
                  <div className="h-2 w-32 bg-foreground/10 rounded" />
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="h-2 w-20 bg-foreground/20 rounded mb-2" />
                  <div className="h-2 w-28 bg-foreground/10 rounded" />
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <div className="h-2 w-28 bg-foreground/20 rounded mb-2" />
                  <div className="h-2 w-36 bg-foreground/10 rounded" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
