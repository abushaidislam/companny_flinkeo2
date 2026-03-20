import { motion } from 'framer-motion';
import { ShieldCheck, Lock, Award, Zap, Globe, Users } from 'lucide-react';

const certifications = [
  {
    icon: ShieldCheck,
    title: 'SSL Secured',
    description: 'All projects include SSL certification',
  },
  {
    icon: Lock,
    title: 'GDPR Compliant',
    description: 'Privacy-first development approach',
  },
  {
    icon: Award,
    title: '5★ Rating',
    description: 'Top-rated on Clutch & Google',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'On-time project completion',
  },
];

const clientLogos = [
  { name: 'NovaTech', initials: 'NT' },
  { name: 'FinFlow', initials: 'FF' },
  { name: 'Bloom Studio', initials: 'BS' },
  { name: 'ScaleUp Inc', initials: 'SU' },
  { name: 'HealthTrack', initials: 'HT' },
  { name: 'Artisan Coffee', initials: 'AC' },
];

const featuredIn = [
  'TechCrunch',
  'Product Hunt',
  'Forbes',
  'CSS Design Awards',
];

const TrustBadgesSection = () => {
  return (
    <section className="py-16 border-y border-border/50 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Featured In */}
        <div className="text-center mb-12">
          <p className="text-sm text-text-secondary uppercase tracking-wider mb-6">
            Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {featuredIn.map((publication) => (
              <span
                key={publication}
                className="text-lg md:text-xl font-display font-semibold text-text-secondary/60 hover:text-text-secondary transition-colors"
              >
                {publication}
              </span>
            ))}
          </div>
        </div>

        {/* Trusted By - Animated Marquee */}
        <div className="mb-12 overflow-hidden">
          <p className="text-center text-sm text-text-secondary uppercase tracking-wider mb-6">
            Trusted By 200+ Brands
          </p>
          <div className="relative">
            <div className="flex gap-8 animate-marquee">
              {[...clientLogos, ...clientLogos].map((client, index) => (
                <div
                  key={`${client.name}-${index}`}
                  className="flex-shrink-0 px-6 py-3"
                >
                  <span className="text-2xl md:text-3xl font-display font-bold text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Certifications Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <cert.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  {cert.title}
                </p>
                <p className="text-xs text-text-secondary">{cert.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Globe className="h-5 w-5 text-primary" />
              <span className="text-3xl font-display font-bold text-foreground">
                15+
              </span>
            </div>
            <p className="text-sm text-text-secondary">Countries Served</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="h-5 w-5 text-primary" />
              <span className="text-3xl font-display font-bold text-foreground">
                200+
              </span>
            </div>
            <p className="text-sm text-text-secondary">Happy Clients</p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Award className="h-5 w-5 text-primary" />
              <span className="text-3xl font-display font-bold text-foreground">
                98%
              </span>
            </div>
            <p className="text-sm text-text-secondary">Satisfaction Rate</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBadgesSection;
