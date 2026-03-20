import Navbar from '@/components/landing/Navbar';
import TeamShowcase from '@/components/ui/team-showcase';
import { Footer } from '@/components/ui/footer-section';
import { motion } from 'framer-motion';

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <p className="text-primary font-medium mb-3">Our Team</p>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4">
              Meet the Experts
            </h1>
            <p className="text-text-secondary text-lg">
              A passionate team of designers, developers, and strategists dedicated to crafting 
              exceptional digital experiences.
            </p>
          </motion.div>

          {/* Team Showcase */}
          <TeamShowcase />
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="font-display font-semibold text-2xl mb-4">
              Our Story
            </h2>
            <p className="text-text-secondary leading-relaxed mb-8">
              Founded in 2020, Flinke started with a simple mission: make exceptional web design 
              accessible to businesses of all sizes. What began as a two-person studio has grown 
              into a full-service digital agency with clients across 15+ countries. We believe in 
              transparent pricing, clear communication, and delivering results that exceed expectations.
            </p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <p className="text-3xl font-display font-bold text-primary">4+</p>
                <p className="text-sm text-text-secondary">Years Active</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-primary">15+</p>
                <p className="text-sm text-text-secondary">Countries</p>
              </div>
              <div>
                <p className="text-3xl font-display font-bold text-primary">200+</p>
                <p className="text-sm text-text-secondary">Projects</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
