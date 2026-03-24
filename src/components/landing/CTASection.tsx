import { motion } from "framer-motion";
import { ArrowRight, MessageCircleMore } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { bookingConsultationHref, defaultWhatsAppHref } from "@/data/company-contact";
import { finalCtaSection } from "@/data/landing-content";

const CTASection = () => {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,hsl(24_20%_8%),hsl(24_14%_14%))] px-5 py-8 text-white premium-shadow sm:px-8 sm:py-10 md:px-12 md:py-14"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(0_0%_100%_/_0.13),transparent_28%),radial-gradient(circle_at_bottom_right,hsl(35_50%_70%_/_0.12),transparent_30%)]" />
          <div className="relative z-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                {finalCtaSection.eyebrow}
              </p>
              <h2 className="mt-4 max-w-3xl text-3xl font-display font-bold tracking-tight text-white md:text-5xl">
                {finalCtaSection.title}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/70 md:text-lg">
                {finalCtaSection.description}
              </p>
            </div>

            <div className="space-y-5 border-t border-white/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <Button variant="hero" size="xl" className="w-full" asChild>
                <Link to={bookingConsultationHref}>
                  {finalCtaSection.buttonLabel} <ArrowRight className="ml-1 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="heroOutline" size="lg" className="w-full border-white/20 text-white hover:bg-white/10" asChild>
                <a href={defaultWhatsAppHref} target="_blank" rel="noreferrer">
                  <MessageCircleMore className="h-4 w-4" />
                  WhatsApp Us
                </a>
              </Button>
              <p className="max-w-xs text-sm leading-6 text-white/65">
                {finalCtaSection.supportText}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
