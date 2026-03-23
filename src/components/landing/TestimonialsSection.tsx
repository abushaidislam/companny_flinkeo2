import SectionIntro from "@/components/landing/SectionIntro";
import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";
import { testimonialsSection } from "@/data/landing-content";

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow={testimonialsSection.copy.eyebrow}
          title={testimonialsSection.copy.title}
          description={testimonialsSection.copy.description}
        />

        <AnimatedTestimonials testimonials={testimonialsSection.items} />
      </div>
    </section>
  );
};

export default TestimonialsSection;
