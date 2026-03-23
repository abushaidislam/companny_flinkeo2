import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ArrowUpRight } from "lucide-react";

import SectionIntro from "@/components/landing/SectionIntro";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { projects, categories } from "@/data/projects";

const PortfolioSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);

  const handleViewDetails = (slug: string) => {
    setSelectedProject(null);
    navigate(`/portfolio/${slug}`);
  };

  return (
    <section id="work" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <SectionIntro
          eyebrow="Featured work"
          title="Selected case studies that show how the offer translates into results."
          description="Use this section as proof. The goal is to show how positioning, interface quality, and execution quality come together in real client outcomes."
        />

        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "hero" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
                <div className="glass-card overflow-hidden transition-transform duration-300 hover:scale-[1.02]">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0">
                      <Badge variant="secondary" className="mb-2">
                        {project.category}
                      </Badge>
                      <p className="line-clamp-2 text-sm text-text-secondary">{project.description}</p>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="mb-1 text-lg font-display font-semibold text-foreground transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>
                    <p className="mb-3 text-sm text-text-secondary">{project.client}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary">{project.results}</span>
                      <ArrowUpRight className="h-4 w-4 text-text-secondary transition-colors group-hover:text-primary" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {selectedProject ? (
            <>
              <DialogHeader>
                <div className="mb-4 aspect-video overflow-hidden rounded-lg">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <Badge className="mb-2 w-fit">{selectedProject.category}</Badge>
                <DialogTitle className="text-2xl font-display">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-base">
                  {selectedProject.description}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-6">
                <div className="glass-card p-4">
                  <p className="mb-1 text-sm text-text-secondary">Results</p>
                  <p className="text-lg font-display font-semibold text-foreground">
                    {selectedProject.results}
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm text-text-secondary">Technologies and services</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedProject.testimonial ? (
                  <div className="border-l-4 border-primary py-2 pl-4">
                    <p className="mb-3 italic text-text-secondary">
                      &ldquo;{selectedProject.testimonial.quote}&rdquo;
                    </p>
                    <div>
                      <p className="font-semibold text-foreground">{selectedProject.testimonial.author}</p>
                      <p className="text-sm text-text-secondary">{selectedProject.testimonial.role}</p>
                    </div>
                  </div>
                ) : null}

                <div className="flex gap-3 pt-4">
                  <Button variant="hero" className="flex-1" onClick={() => handleViewDetails(selectedProject.slug)}>
                    View Full Case Study
                  </Button>
                  {selectedProject.link ? (
                    <Button variant="outline" size="icon" asChild>
                      <a href={selectedProject.link} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PortfolioSection;
