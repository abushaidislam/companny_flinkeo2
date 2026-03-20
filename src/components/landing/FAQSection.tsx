import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import FaqSections from "@/components/ui/faq-sections";

const faqs = [
  {
    question: "What services does Flinke offer?",
    answer:
      "We specialize in web development, UI/UX design, brand identity, responsive design, and conversion optimization. From landing pages to full web applications — we handle it all.",
    imageSrc: "/faq/faq-01.svg",
    imageAlt: "Flinke services overview",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A landing page takes 1–2 weeks. A full website with custom design takes 4–6 weeks. Complex web apps are scoped individually. We provide a detailed timeline during our free discovery call.",
    imageSrc: "/faq/faq-02.svg",
    imageAlt: "Project timeline illustration",
  },
  {
    question: "Do you offer ongoing support after launch?",
    answer:
      "Yes. We offer maintenance packages that include bug fixes, content updates, performance monitoring, and feature enhancements on a monthly retainer basis.",
    imageSrc: "/faq/faq-03.svg",
    imageAlt: "Ongoing support illustration",
  },
  {
    question: "What technologies do you use?",
    answer:
      "We work with React, Next.js, TypeScript, Tailwind CSS, Node.js, and modern design tools like Figma. We choose the best stack for each project's needs.",
    imageSrc: "/faq/faq-04.svg",
    imageAlt: "Technology stack illustration",
  },
  {
    question: "Can you redesign my existing website?",
    answer:
      "Absolutely. We audit your current site, identify UX issues, and deliver a modern redesign that improves both aesthetics and conversion rates.",
    imageSrc: "/faq/faq-05.svg",
    imageAlt: "Website redesign illustration",
  },
  {
    question: "How do I get started with Flinke?",
    answer:
      "Simply book a free discovery call or send us a message. We'll discuss your goals, scope the project, and provide a transparent quote — no commitment required.",
    imageSrc: "/faq/faq-06.svg",
    imageAlt: "Getting started illustration",
  },
];

const FAQSection = () => {
  return (
    <section id="faq" className="py-24 md:py-32 relative">
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
            eyebrow="FAQ"
            title="Everything you need to know"
            description="Quick answers about our services, process, pricing, and how Flinke can help bring your vision to life."
            action={
              <Button variant="hero" size="lg" asChild>
                <a href="#pricing">Get a Quote</a>
              </Button>
            }
            faqs={faqs}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
