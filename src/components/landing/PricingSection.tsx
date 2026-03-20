import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$2,500",
    period: "per project",
    description: "Perfect for landing pages & small sites",
    features: [
      "Custom landing page design",
      "Responsive development",
      "Basic SEO setup",
      "2 rounds of revisions",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Growth",
    price: "$6,500",
    period: "per project",
    description: "Full website with premium design",
    features: [
      "Up to 10 pages",
      "UI/UX design & prototyping",
      "CMS integration",
      "Advanced SEO & analytics",
      "Priority support",
      "Unlimited revisions",
    ],
    cta: "Most Popular",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored",
    description: "For complex web apps & platforms",
    features: [
      "Everything in Growth",
      "Custom web app development",
      "API integrations",
      "Performance optimization",
      "Dedicated project manager",
      "Ongoing maintenance",
    ],
    cta: "Contact Us",
    popular: false,
  },
];

const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Simple, <span className="gradient-text">Transparent Pricing</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Flexible packages designed for every stage of your business. No hidden fees.
          </p>
          <p className="text-xs text-text-secondary mt-3">All plans include a free discovery call and project consultation.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className={`glass-card p-8 relative hover:scale-[1.02] transition-transform duration-300 ${
                plan.popular ? "premium-shadow border-foreground/20" : ""
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-display font-bold px-4 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <h3 className="font-display font-bold text-xl text-foreground mb-1">{plan.name}</h3>
              <p className="text-text-secondary text-sm mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-display font-extrabold text-foreground">{plan.price}</span>
                <span className="text-text-secondary text-sm ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant={plan.popular ? "hero" : "heroOutline"} size="lg" className="w-full">
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
