import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import FaqSections from "@/components/ui/faq-sections";
import { faqSection, primaryConsultationLabel } from "@/data/landing-content";

const FAQSection = () => {
  return (
    <section id="faq" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <FaqSections
            imageMode="perItem"
            size="lg"
            eyebrow={faqSection.copy.eyebrow}
            title={faqSection.copy.title}
            description={faqSection.copy.description}
            action={
              <Button variant="hero" size="lg" asChild>
                <a href="#contact">{primaryConsultationLabel}</a>
              </Button>
            }
            faqs={faqSection.items}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
