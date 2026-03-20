import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

const testimonials = [
  {
    quote:
      "Flinke completely transformed our online presence. The new website increased our leads by 180% in just three months.",
    name: "Alex Rivera",
    designation: "CEO, NovaTech Solutions • E-commerce redesign",
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800&auto=format&fit=crop",
  },
  {
    quote:
      "Their UI/UX design process is world-class. Every interaction feels intentional, and our users love the new experience.",
    name: "Jessica Park",
    designation: "Product Lead, FinFlow • SaaS dashboard design",
    src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
  },
  {
    quote:
      "From branding to development, Flinke delivered a pixel-perfect product on time and within budget. Highly recommended.",
    name: "Priya Sharma",
    designation: "Founder, Bloom Studio • Brand identity + website",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
  },
  {
    quote:
      "The team at Flinke truly understands modern design. Our conversion rate jumped 3x after the redesign they delivered.",
    name: "Daniel Kim",
    designation: "Marketing Director, ScaleUp Inc • Landing page optimization",
    src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="relative py-24">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="mb-4 text-4xl font-display font-bold md:text-5xl">
            Trusted by <span className="gradient-text">Ambitious Brands</span>
          </h2>
          <p className="text-text-secondary text-lg">Real results from clients who partnered with Flinke.</p>
          <p className="text-xs text-text-secondary mt-2">Verified feedback from completed projects and active partnerships.</p>
        </div>

        <AnimatedTestimonials testimonials={testimonials} autoplay />
      </div>
    </section>
  );
};

export default TestimonialsSection;
