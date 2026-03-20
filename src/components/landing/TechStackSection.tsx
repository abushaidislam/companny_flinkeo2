import { motion } from 'framer-motion';
import { FaReact } from 'react-icons/fa';
import { SiTypescript, SiTailwindcss, SiNodedotjs } from 'react-icons/si';
import { TbBrandNextjs } from 'react-icons/tb';

const techStack = [
  {
    name: 'React',
    icon: FaReact,
  },
  {
    name: 'Next.js',
    icon: TbBrandNextjs,
  },
  {
    name: 'TypeScript',
    icon: SiTypescript,
  },
  {
    name: 'Tailwind CSS',
    icon: SiTailwindcss,
  },
];

const TechStackSection = () => {
  return (
    <section className="py-24 bg-muted/30" id="tech-stack">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Tech Stack
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            We leverage cutting-edge technologies to build fast, scalable, and secure digital products.
          </p>
        </motion.div>

        {/* Tech Grid - Clean 2x2 Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 max-w-4xl mx-auto">
          {techStack.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-4 group cursor-pointer"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center text-text-secondary/60 group-hover:text-foreground transition-colors duration-300">
                  <Icon className="w-full h-full" />
                </div>
                <span className="text-lg md:text-xl font-display font-semibold text-text-secondary/60 group-hover:text-text-secondary transition-colors">
                  {tech.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
