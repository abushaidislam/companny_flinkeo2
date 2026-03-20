import * as React from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: string;
  imageSrc?: string;
  imageAlt?: string;
};

export type FaqSectionsProps = {
  faqs?: FaqItem[];
  imageSrc?: string;
  imageAlt?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  imageMode?: "static" | "perItem";
  size?: "md" | "lg";
  className?: string;
};

const defaultFaqs: FaqItem[] = [
  {
    question: "How to use this component?",
    answer:
      "Import the component and render it in your page. You can pass your own FAQ data via the `faqs` prop.",
  },
  {
    question: "Are there any other components available?",
    answer:
      "Yes. This project uses a shadcn-style component library, so you can add more UI components as needed.",
  },
  {
    question: "Are components responsive?",
    answer:
      "Yes. The layout stacks on small screens and becomes a two-column layout on larger screens.",
  },
  {
    question: "Can I customize the components?",
    answer:
      "Yes. You can customize via props and Tailwind classes, or wrap it with your own layout components.",
  },
];

export default function FaqSections({
  faqs = defaultFaqs,
  imageSrc = "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop",
  imageAlt = "FAQ illustration",
  eyebrow = "FAQ's",
  title = "Frequently asked questions",
  description = "Everything you need to know about our platform.",
  action,
  imageMode = "static",
  size = "md",
  className,
}: FaqSectionsProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);
  const activeFaq = openIndex === null ? null : faqs[openIndex];
  const resolvedImageSrc =
    imageMode === "perItem" ? activeFaq?.imageSrc ?? imageSrc : imageSrc;
  const resolvedImageAlt =
    imageMode === "perItem" ? activeFaq?.imageAlt ?? imageAlt : imageAlt;

  return (
    <section className={cn("w-full", className)}>
      <div
        className={cn(
          "mx-auto px-4",
          size === "lg" ? "max-w-6xl" : "max-w-5xl"
        )}
      >
        {/* Header */}
        <div className="mb-14 text-center">
          <span className="inline-block rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase mb-4">
            {eyebrow}
          </span>
          <h2
            className={cn(
              "font-display font-bold tracking-tight text-foreground",
              size === "lg" ? "text-3xl md:text-4xl lg:text-5xl" : "text-3xl"
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-3 text-text-secondary mx-auto",
              size === "lg"
                ? "text-base md:text-lg max-w-xl"
                : "text-sm max-w-md"
            )}
          >
            {description}
          </p>
          {action ? <div className="mt-6">{action}</div> : null}
        </div>

        {/* Two-column: Image + FAQ */}
        <div
          className={cn(
            "grid grid-cols-1 items-start gap-8",
            size === "lg"
              ? "lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-12"
              : "lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10"
          )}
        >
          {/* FAQ Items */}
          <div className="order-2 lg:order-1 space-y-3">
            {faqs.map((faq, index) => {
              const open = openIndex === index;
              return (
                <motion.div
                  key={`${faq.question}-${index}`}
                  initial={false}
                  className={cn(
                    "group rounded-2xl border transition-all duration-300",
                    open
                      ? "border-border/80 bg-card shadow-lg shadow-background/50"
                      : "border-border/40 bg-card/50 hover:border-border/60 hover:bg-card/80"
                  )}
                >
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-4 text-left",
                      "px-6",
                      size === "lg" ? "py-5 md:py-6" : "py-4 md:py-5"
                    )}
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${index}`}
                  >
                    <span
                      className={cn(
                        "font-display font-semibold transition-colors duration-200",
                        size === "lg"
                          ? "text-base md:text-lg"
                          : "text-sm md:text-base",
                        open ? "text-foreground" : "text-foreground/80"
                      )}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        open
                          ? "border-foreground/20 bg-foreground text-background"
                          : "border-border bg-card text-muted-foreground group-hover:border-foreground/30"
                      )}
                    >
                      {open ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        id={`faq-panel-${index}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div
                          className={cn(
                            "px-6 pb-6 pt-0",
                            size === "lg"
                              ? "text-sm md:text-base"
                              : "text-sm"
                          )}
                        >
                          <p className="leading-relaxed text-text-secondary">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* Side Image */}
          <div className="order-1 lg:order-2 lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card premium-shadow">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/40 z-10 pointer-events-none" />
              <div className="relative aspect-[4/5] bg-muted">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={resolvedImageSrc}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full w-full object-cover"
                    src={resolvedImageSrc}
                    alt={resolvedImageAlt}
                    loading="lazy"
                  />
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
