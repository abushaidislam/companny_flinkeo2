import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/ui/footer-section';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle2,
  ArrowRight,
  Palette,
  Code2,
  Rocket,
  LineChart,
  Smartphone,
  Globe,
  Zap,
  Clock,
  Users,
  Star,
  Sparkles
} from 'lucide-react';

const services = [
  {
    id: 'web-development',
    icon: Code2,
    title: 'Web Development',
    shortDesc: 'Custom websites built with modern technologies',
    description: 'We build fast, scalable, and secure web applications using cutting-edge technologies like React, Next.js, and Node.js. From simple landing pages to complex web applications.',
    features: [
      'Custom React/Next.js development',
      'Headless CMS integration',
      'E-commerce solutions',
      'API development & integration',
      'Performance optimization',
      'SEO-friendly architecture'
    ],
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
    startingPrice: '$5,000',
    timeline: '2-8 weeks',
    popular: true
  },
  {
    id: 'ui-ux-design',
    icon: Palette,
    title: 'UI/UX Design',
    shortDesc: 'User-centered design that converts',
    description: 'We create intuitive, beautiful interfaces that delight users and drive business results. Our design process is rooted in research and validated through testing.',
    features: [
      'User research & personas',
      'Wireframing & prototyping',
      'High-fidelity UI design',
      'Design systems',
      'Usability testing',
      'Accessibility compliance (WCAG)'
    ],
    technologies: ['Figma', 'Sketch', 'Principle', 'Maze'],
    startingPrice: '$3,500',
    timeline: '2-6 weeks',
    popular: false
  },
  {
    id: 'branding',
    icon: Sparkles,
    title: 'Brand Identity',
    shortDesc: 'Memorable brands that stand out',
    description: 'We craft distinctive brand identities that capture your essence and resonate with your audience. From logos to comprehensive brand guidelines.',
    features: [
      'Brand strategy & positioning',
      'Logo design & variations',
      'Color & typography systems',
      'Brand guidelines',
      'Marketing collateral',
      'Brand messaging'
    ],
    technologies: ['Illustrator', 'Photoshop', 'After Effects'],
    startingPrice: '$4,000',
    timeline: '3-4 weeks',
    popular: false
  },
  {
    id: 'mobile-apps',
    icon: Smartphone,
    title: 'Mobile Apps',
    shortDesc: 'Native and cross-platform mobile solutions',
    description: 'We design and develop mobile applications for iOS and Android using React Native and Flutter, delivering native performance with shared codebases.',
    features: [
      'iOS & Android development',
      'React Native & Flutter',
      'App Store optimization',
      'Push notifications',
      'Offline functionality',
      'Analytics integration'
    ],
    technologies: ['React Native', 'Flutter', 'Firebase', 'Swift'],
    startingPrice: '$8,000',
    timeline: '6-12 weeks',
    popular: false
  },
  {
    id: 'growth-marketing',
    icon: LineChart,
    title: 'Growth Marketing',
    shortDesc: 'Data-driven marketing strategies',
    description: 'We help you acquire, engage, and retain customers through data-driven marketing strategies, SEO, content marketing, and conversion optimization.',
    features: [
      'SEO strategy & implementation',
      'Content marketing',
      'Conversion rate optimization',
      'Analytics & reporting',
      'A/B testing',
      'Marketing automation'
    ],
    technologies: ['Google Analytics', 'HubSpot', 'Semrush', 'Klaviyo'],
    startingPrice: '$2,500/mo',
    timeline: 'Ongoing',
    popular: false
  },
  {
    id: 'consulting',
    icon: Globe,
    title: 'Technical Consulting',
    shortDesc: 'Expert guidance for your digital journey',
    description: 'Get strategic advice from experienced technologists. We help you make informed decisions about architecture, technology stack, and digital transformation.',
    features: [
      'Technology assessment',
      'Architecture review',
      'Digital transformation strategy',
      'Team training & workshops',
      'Code audits',
      'Performance optimization'
    ],
    technologies: ['Various'],
    startingPrice: '$250/hr',
    timeline: 'Flexible',
    popular: false
  }
];

const processSteps = [
  {
    icon: Users,
    title: 'Discovery',
    description: 'We start by understanding your business, goals, and target audience through in-depth research and stakeholder interviews.',
    duration: '1-2 weeks'
  },
  {
    icon: Palette,
    title: 'Strategy & Design',
    description: 'Based on our findings, we create a strategic roadmap and design solutions that align with your objectives.',
    duration: '2-4 weeks'
  },
  {
    icon: Code2,
    title: 'Development',
    description: 'Our engineering team brings designs to life with clean, scalable code and regular progress updates.',
    duration: '4-8 weeks'
  },
  {
    icon: Rocket,
    title: 'Launch & Support',
    description: 'We ensure a smooth launch and provide ongoing support to help you achieve your goals.',
    duration: 'Ongoing'
  }
];

const faqs = [
  {
    question: 'How long does a typical project take?',
    answer: 'Project timelines vary based on scope and complexity. A simple landing page might take 2 weeks, while a complex web application could take 2-3 months. We\'ll provide a detailed timeline during our proposal phase.'
  },
  {
    question: 'What is your pricing structure?',
    answer: 'We offer both fixed-price projects and retainer arrangements. Fixed-price projects are based on detailed scope, while retainers provide ongoing support at a predictable monthly cost. All pricing is transparent with no hidden fees.'
  },
  {
    question: 'Do you work with clients internationally?',
    answer: 'Absolutely! We work with clients across 15+ countries. Our team is distributed across multiple time zones, allowing us to provide responsive support regardless of your location.'
  },
  {
    question: 'What technologies do you specialize in?',
    answer: 'We specialize in modern web technologies including React, Next.js, TypeScript, Node.js, and various cloud platforms. We choose the best tools for each project based on your specific needs.'
  },
  {
    question: 'Do you provide ongoing maintenance?',
    answer: 'Yes, we offer comprehensive maintenance packages that include hosting, security updates, performance monitoring, and priority support. We can also train your team for self-management.'
  }
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4">Our Services</Badge>
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6">
              Digital Solutions That{' '}
              <span className="gradient-text">Drive Growth</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              From strategy to execution, we provide end-to-end digital services 
              that help businesses thrive in the modern economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/contact')}>
                Start Your Project
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/portfolio')}>
                View Our Work
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-display font-bold text-primary">200+</p>
              <p className="text-sm text-muted-foreground">Projects Delivered</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-primary">98%</p>
              <p className="text-sm text-muted-foreground">Client Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-primary">15+</p>
              <p className="text-sm text-muted-foreground">Countries Served</p>
            </div>
            <div>
              <p className="text-3xl font-display font-bold text-primary">4.9★</p>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display font-semibold text-3xl mb-4">
              What We Offer
            </h2>
            <p className="text-muted-foreground">
              Comprehensive digital services tailored to your business needs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`h-full hover:shadow-lg transition-shadow ${service.popular ? 'border-primary/50' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
                      {service.popular && (
                        <Badge variant="default">Popular</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold text-xl mt-4">{service.title}</h3>
                    <p className="text-sm text-muted-foreground">{service.shortDesc}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                    
                    <div className="space-y-2">
                      {service.features.slice(0, 4).map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {service.technologies.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="font-semibold text-primary">{service.startingPrice}</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate('/contact')}
                      >
                        Get Quote
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display font-semibold text-3xl mb-4">
              Our Process
            </h2>
            <p className="text-muted-foreground">
              A proven methodology that delivers consistent results
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <step.icon className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="outline">Step {index + 1}</Badge>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{step.duration}</span>
                    </div>
                  </CardContent>
                </Card>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground/30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="font-display font-semibold text-3xl mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Got questions? We&apos;ve got answers.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Let&apos;s discuss how we can help bring your vision to life. 
              Get a free consultation and project estimate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/contact')}>
                Schedule a Call
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.open('mailto:hello@flinke.agency')}>
                Email Us Directly
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
