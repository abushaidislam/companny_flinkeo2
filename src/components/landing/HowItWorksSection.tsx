import { motion } from "framer-motion";
import { MessageSquare, PenTool, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    step: "01",
    title: "Discovery & Strategy",
    description: "We dive deep into your brand, goals, and audience to craft a tailored strategy and project roadmap.",
  },
  {
    icon: PenTool,
    step: "02",
    title: "Design & Develop",
    description: "Our team designs stunning interfaces and builds production-ready code with weekly progress updates.",
  },
  {
    icon: Rocket,
    step: "03",
    title: "Launch & Grow",
    description: "We launch your project, monitor performance, and provide ongoing support to help you scale.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Our Process in <span className="gradient-text">3 Simple Steps</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            A streamlined workflow that takes your idea from concept to a polished, live product.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="text-center relative"
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/40 to-secondary/40" />
              )}
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl glass-card mb-6 relative">
                <step.icon className="h-10 w-10 text-primary" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center font-display">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-display font-semibold mb-2 text-foreground">{step.title}</h3>
              <p className="text-text-secondary text-sm max-w-xs mx-auto">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
