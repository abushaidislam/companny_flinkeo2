import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { projects, categories } from '@/data/projects';

const PortfolioSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects =
    selectedCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  const handleViewDetails = (slug: string) => {
    setSelectedProject(null);
    navigate(`/portfolio/${slug}`);
  };

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

      {/* Project Preview Modal */}
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
                      &ldquo;{selectedProject.testimonial.quote}&rdquo;
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

                {/* CTAs */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="hero" 
                    className="flex-1"
                    onClick={() => handleViewDetails(selectedProject.slug)}
                  >
                    View Full Case Study
                  </Button>
                  {selectedProject.link && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
