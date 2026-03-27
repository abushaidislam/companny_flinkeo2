import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";

import SectionIntro from "@/components/landing/SectionIntro";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categories, projects } from "@/data/projects";

const PortfolioSection = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects =
    selectedCategory === "All"
      ? projects
      : projects.filter((project) => project.category === selectedCategory);
  const [featuredProject, ...supportingProjects] = filteredProjects;

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

        <div className="-mx-4 mb-12 flex flex-nowrap gap-3 overflow-x-auto border-y border-border/70 px-4 py-4 scrollbar-hide sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "hero" : "ghost"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="shrink-0 rounded-full px-5"
            >
              {category}
            </Button>
          ))}
        </div>

        <motion.div layout className="space-y-10">
          <AnimatePresence mode="popLayout">
            {featuredProject ? (
              <motion.div
                key={`featured-${featuredProject.id}`}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18 }}
                transition={{ duration: 0.4 }}
                className="section-shell group cursor-pointer overflow-hidden"
                onClick={() => setSelectedProject(featuredProject)}
              >
                <div className="grid lg:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.9fr)] lg:items-stretch">
                  <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[30rem]">
                    <img
                      src={featuredProject.image}
                      alt={featuredProject.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-background/10 via-transparent to-background/10" />
                  </div>

                  <div className="flex flex-col justify-between p-5 sm:p-8 lg:p-10">
                    <div>
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.18em]"
                      >
                        {featuredProject.category}
                      </Badge>
                      <h3 className="mt-5 max-w-[14ch] text-3xl font-display font-bold tracking-tight text-foreground md:text-4xl">
                        {featuredProject.title}
                      </h3>
                      <p className="mt-3 text-sm uppercase tracking-[0.22em] text-text-secondary">
                        {featuredProject.client}
                      </p>
                      <p className="mt-6 max-w-xl text-base leading-7 text-text-secondary">
                        {featuredProject.description}
                      </p>

                      <div className="mt-8 grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-2">
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
                            Result
                          </p>
                          <p className="mt-2 text-lg font-display font-semibold text-foreground">
                            {featuredProject.results}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
                            Delivery
                          </p>
                          <p className="mt-2 text-lg font-display font-semibold text-foreground">
                            {featuredProject.duration}
                          </p>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-2">
                        {featuredProject.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-text-secondary"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between border-t border-border/70 pt-6">
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                        View case study <ArrowRight className="h-4 w-4" />
                      </span>
                      <ArrowUpRight className="h-5 w-5 text-text-secondary transition-colors group-hover:text-foreground" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {supportingProjects.length > 0 ? (
            <motion.div layout className="grid grid-cols-1 gap-x-8 gap-y-6 border-t border-border/70 pt-8 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {supportingProjects.map((project) => (
                  <motion.button
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 16 }}
                    transition={{ duration: 0.3 }}
                    className="group grid gap-5 border-b border-border/70 pb-6 text-left"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-text-secondary">
                          {project.category}
                        </p>
                        <h4 className="mt-3 text-2xl font-display font-semibold tracking-tight text-foreground">
                          {project.title}
                        </h4>
                      </div>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-text-secondary transition-colors group-hover:text-foreground" />
                    </div>

                    <p className="max-w-xl text-sm leading-7 text-text-secondary md:text-base">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/85">
                      <span>{project.client}</span>
                      <span className="h-1 w-1 rounded-full bg-border" />
                      <span>{project.results}</span>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : null}
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
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={() => handleViewDetails(selectedProject.slug)}
                  >
                    View Full Case Study
                  </Button>
                  {selectedProject.link && selectedProject.link !== "#" ? (
                    <Button variant="outline" size="icon" asChild>
                      <a href={selectedProject.link} target="_blank" rel="noopener noreferrer" aria-label="View live project">
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
