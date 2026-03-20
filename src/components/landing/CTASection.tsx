import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const CTASection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    toast({
      title: "Thanks! We'll be in touch.",
      description: "Our team will reach out within 24 hours to discuss your project.",
    });

    setEmail("");
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-16 text-center relative overflow-hidden max-w-4xl mx-auto"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-foreground">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Let's turn your idea into a stunning digital product. Book a free consultation today.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row mb-8">
              <Button variant="hero" size="xl" asChild>
                <a href="#pricing">
                  Start Your Project <ArrowRight className="ml-1 h-5 w-5" />
                </a>
              </Button>
              <p className="text-xs text-text-secondary">Free consultation • No commitment</p>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-xl flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                placeholder="Enter your email to get started"
                value={email}
                required
                onChange={(event) => setEmail(event.target.value)}
                className="h-11"
              />
              <Button type="submit" variant="heroOutline" className="h-11 px-6">
                Get in Touch
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
