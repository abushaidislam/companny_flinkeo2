import Navbar from '@/components/landing/Navbar';
import TeamShowcase from '@/components/ui/team-showcase';
import { Footer } from '@/components/ui/footer-section';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Heart, 
  Zap, 
  Users, 
  Target, 
  Sparkles, 
  Globe,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const teamValues = [
  {
    icon: Heart,
    title: 'Passion First',
    description: 'We love what we do, and it shows in every project we deliver.'
  },
  {
    icon: Zap,
    title: 'Move Fast',
    description: 'Speed without sacrificing quality. We iterate quickly to deliver results.'
  },
  {
    icon: Users,
    title: 'Collaborative',
    description: 'Great work happens when diverse minds come together toward a common goal.'
  },
  {
    icon: Target,
    title: 'Results Driven',
    description: 'We measure success by the impact we create for our clients.'
  },
  {
    icon: Sparkles,
    title: 'Always Learning',
    description: 'Technology evolves fast. We stay ahead through continuous learning.'
  },
  {
    icon: Globe,
    title: 'Global Mindset',
    description: 'Working with clients worldwide gives us a broad perspective.'
  }
];

const openPositions = [
  {
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time'
  },
  {
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote / New York',
    type: 'Full-time'
  },
  {
    title: 'Project Manager',
    department: 'Operations',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    title: 'Marketing Specialist',
    department: 'Marketing',
    location: 'Remote / Los Angeles',
    type: 'Part-time'
  }
];

const benefits = [
  'Competitive salary & equity',
  'Remote-first culture',
  'Flexible working hours',
  'Health & dental insurance',
  'Professional development budget',
  'Paid time off & holidays',
  'Home office stipend',
  'Team retreats & events'
];

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

      {/* Team Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <p className="text-primary font-medium mb-3">Our Culture</p>
            <h2 className="font-display font-semibold text-3xl mb-4">
              What We Believe
            </h2>
            <p className="text-text-secondary">
              Our values guide how we work, collaborate, and deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {teamValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-16">
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
              <div>
                <p className="text-3xl font-display font-bold text-primary">8</p>
                <p className="text-sm text-text-secondary">Team Members</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left: Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-primary font-medium mb-3">Join Our Team</p>
                <h2 className="font-display font-semibold text-3xl mb-4">
                  Why Work With Us?
                </h2>
                <p className="text-text-secondary mb-8">
                  We're always looking for talented individuals who are passionate about creating 
                  exceptional digital experiences. Join our growing team and make an impact.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Open Positions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="font-semibold text-xl mb-6">Open Positions</h3>
                <div className="space-y-4">
                  {openPositions.map((position, index) => (
                    <Card key={index} className="group hover:border-primary/50 transition-colors cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold group-hover:text-primary transition-colors">
                              {position.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {position.department} • {position.location} • {position.type}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button className="w-full mt-6" variant="outline">
                  View All Positions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Team;
