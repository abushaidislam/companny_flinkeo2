import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github } from 'lucide-react';

const teamMembers = [
  {
    name: 'Alex Chen',
    role: 'Founder & Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    bio: '10+ years of design experience. Former design lead at Google.',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Sarah Miller',
    role: 'Lead UI/UX Designer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    bio: 'Award-winning designer specializing in user-centric interfaces.',
    linkedin: '#',
    twitter: '#',
  },
  {
    name: 'Marcus Johnson',
    role: 'Senior Full-Stack Developer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: 'React specialist with expertise in scalable web applications.',
    linkedin: '#',
    github: '#',
  },
  {
    name: 'Emma Rodriguez',
    role: 'Project Manager',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    bio: 'Agile certified with 50+ successfully delivered projects.',
    linkedin: '#',
    twitter: '#',
  },
];

const TeamSection = () => {
  return (
    <section className="py-24 bg-background" id="team">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium mb-3">Our Team</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl mb-4">
            Meet the Experts
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            A passionate team of designers, developers, and strategists dedicated to crafting 
            exceptional digital experiences.
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                {/* Image */}
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Social Links - Appear on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex justify-center gap-3">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <Linkedin className="h-5 w-5" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <Twitter className="h-5 w-5" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          className="w-10 h-10 rounded-full bg-background/90 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 text-center">
                  <h3 className="font-display font-semibold text-lg text-foreground mb-1">
                    {member.name}
                  </h3>
                  <p className="text-primary text-sm font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-text-secondary text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Company Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center max-w-3xl mx-auto"
        >
          <div className="glass-card p-8">
            <h3 className="font-display font-semibold text-2xl mb-4">
              Our Story
            </h3>
            <p className="text-text-secondary leading-relaxed">
              Founded in 2020, Flinke started with a simple mission: make exceptional web design 
              accessible to businesses of all sizes. What began as a two-person studio has grown 
              into a full-service digital agency with clients across 15+ countries. We believe in 
              transparent pricing, clear communication, and delivering results that exceed expectations.
            </p>
            <div className="mt-6 flex justify-center gap-8 text-center">
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
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
