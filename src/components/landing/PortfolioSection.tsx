import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, X, ArrowUpRight } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  client: string;
  results: string;
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  tags: string[];
  link?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'NovaTech E-commerce Platform',
    category: 'Web Development',
    description:
      'A complete redesign and development of an e-commerce platform for a tech retailer, featuring a custom product configurator and seamless checkout experience.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    client: 'NovaTech Solutions',
    results: '+180% increase in online sales',
    testimonial: {
      quote:
        'The new website completely transformed our online presence. Sales increased by 180% in just three months.',
      author: 'Alex Rivera',
      role: 'CEO, NovaTech Solutions',
    },
    tags: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
    link: '#',
  },
  {
    id: 2,
    title: 'FinFlow Dashboard',
    category: 'UI/UX Design',
    description:
      'Designed and developed a comprehensive financial analytics dashboard with real-time data visualization and intuitive user workflows.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    client: 'FinFlow Inc.',
    results: '3x improvement in user engagement',
    testimonial: {
      quote:
        'Their UI/UX design process is world-class. Every interaction feels intentional, and our users love the new experience.',
      author: 'Jessica Park',
      role: 'Product Lead, FinFlow',
    },
    tags: ['Figma', 'React', 'D3.js', 'TypeScript'],
    link: '#',
  },
  {
    id: 3,
    title: 'Bloom Studio Brand Identity',
    category: 'Branding',
    description:
      'Complete brand overhaul including logo design, color system, typography guidelines, and brand strategy for a creative agency.',
    image:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    client: 'Bloom Studio',
    results: 'Brand recognition increased by 65%',
    testimonial: {
      quote:
        'From branding to development, Flinke delivered a pixel-perfect product on time and within budget.',
      author: 'Priya Sharma',
      role: 'Founder, Bloom Studio',
    },
    tags: ['Brand Strategy', 'Logo Design', 'Style Guide', 'Web Design'],
    link: '#',
  },
  {
    id: 4,
    title: 'ScaleUp Landing Page',
    category: 'Web Development',
    description:
      'High-converting landing page with A/B testing capabilities, lead capture forms, and integrated marketing analytics.',
    image:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    client: 'ScaleUp Inc.',
    results: '3x conversion rate improvement',
    testimonial: {
      quote:
        'The team at Flinke truly understands modern design. Our conversion rate jumped 3x after the redesign.',
      author: 'Daniel Kim',
      role: 'Marketing Director, ScaleUp Inc',
    },
    tags: ['Next.js', 'A/B Testing', 'Analytics', 'SEO'],
    link: '#',
  },
  {
    id: 5,
    title: 'HealthTrack Mobile App',
    category: 'UI/UX Design',
    description:
      'Designed a health tracking mobile application with focus on accessibility, user engagement, and seamless data synchronization.',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    client: 'HealthTrack LLC',
    results: '4.8★ app store rating',
    tags: ['Mobile Design', 'Accessibility', 'User Research', 'Prototyping'],
    link: '#',
  },
  {
    id: 6,
    title: 'Artisan Coffee Website',
    category: 'Web Development',
    description:
      'E-commerce website for a specialty coffee roaster with subscription functionality, flavor profiling, and loyalty program.',
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    client: 'Artisan Coffee Co.',
    results: '+120% increase in subscriptions',
    tags: ['Shopify', 'Custom Theme', 'Subscriptions', 'Loyalty Program'],
    link: '#',
  },
];

const categories = ['All', 'Web Development', 'UI/UX Design', 'Branding'];

const PortfolioSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <section id="portfolio" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Our <span className="gradient-text">Recent Work</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Explore our portfolio of successful projects that have helped
            businesses grow and succeed online.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'hero' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Project Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer"
                onClick={() => setSelectedProject(project)}
              >
                <div className="glass-card overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <Badge variant="secondary" className="mb-2">
                        {project.category}
                      </Badge>
                      <p className="text-sm text-text-secondary line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-display font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-text-secondary mb-3">
                      {project.client}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary">
                        {project.results}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-text-secondary group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <Badge className="w-fit mb-2">{selectedProject.category}</Badge>
                <DialogTitle className="text-2xl font-display">
                  {selectedProject.title}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Results */}
                <div className="glass-card p-4">
                  <p className="text-sm text-text-secondary mb-1">Results</p>
                  <p className="text-lg font-display font-semibold text-foreground">
                    {selectedProject.results}
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <p className="text-sm text-text-secondary mb-2">
                    Technologies & Services
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Testimonial */}
                {selectedProject.testimonial && (
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <p className="text-text-secondary italic mb-3">
                      "{selectedProject.testimonial.quote}"
                    </p>
                    <div>
                      <p className="font-semibold text-foreground">
                        {selectedProject.testimonial.author}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {selectedProject.testimonial.role}
                      </p>
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="flex gap-3 pt-4">
                  <Button variant="hero" className="flex-1">
                    <a
                      href="#contact"
                      onClick={() => setSelectedProject(null)}
                      className="flex items-center justify-center w-full"
                    >
                      Start Similar Project
                    </a>
                  </Button>
                  {selectedProject.link && (
                    <Button variant="outline" size="icon">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PortfolioSection;
