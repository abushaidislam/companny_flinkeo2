export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  fullDescription: string;
  image: string;
  gallery: string[];
  client: string;
  clientIndustry: string;
  duration: string;
  team: string[];
  results: string;
  metrics: { label: string; value: string; change: string }[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  };
  tags: string[];
  technologies: string[];
  services: string[];
  link?: string;
  nextSteps?: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    slug: 'novatech-ecommerce',
    title: 'NovaTech E-commerce Platform',
    category: 'Web Development',
    description: 'A complete redesign and development of an e-commerce platform for a tech retailer.',
    fullDescription: `NovaTech Solutions, a leading tech retailer, approached us to transform their outdated e-commerce platform into a modern, high-converting sales channel. The project involved a complete UX overhaul, custom product configurator development, and seamless payment integration.

Our team conducted extensive user research to understand pain points in the existing checkout flow. We identified key friction areas and designed solutions that reduced cart abandonment by 45%. The custom product configurator allows customers to build their perfect PC setup with real-time pricing and compatibility checking.

The new platform features:
• Advanced product filtering and search
• Real-time inventory management
• Custom PC builder with 1000+ components
• One-click reordering for returning customers
• Integrated loyalty and referral program`,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80',
      'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80',
    ],
    client: 'NovaTech Solutions',
    clientIndustry: 'Technology / E-commerce',
    duration: '4 months',
    team: ['Sarah Miller', 'Marcus Johnson', 'Emma Rodriguez'],
    results: '+180% increase in online sales',
    metrics: [
      { label: 'Sales Increase', value: '+180%', change: '+$2.4M revenue' },
      { label: 'Conversion Rate', value: '+65%', change: '3.2% to 5.3%' },
      { label: 'Page Load Time', value: '-40%', change: '2.1s to 1.3s' },
      { label: 'Cart Abandonment', value: '-45%', change: '68% to 37%' },
    ],
    testimonial: {
      quote: 'The new website completely transformed our online presence. Sales increased by 180% in just three months, and our customer satisfaction scores are at an all-time high.',
      author: 'Alex Rivera',
      role: 'CEO, NovaTech Solutions',
    },
    tags: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
    technologies: ['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Stripe', 'AWS'],
    services: ['UX Research', 'UI Design', 'Frontend Development', 'Backend Development', 'Payment Integration'],
    link: '#',
    nextSteps: ['Mobile app development', 'AI-powered recommendations', 'International expansion'],
  },
  {
    id: 2,
    slug: 'finflow-dashboard',
    title: 'FinFlow Dashboard',
    category: 'UI/UX Design',
    description: 'Designed and developed a comprehensive financial analytics dashboard.',
    fullDescription: `FinFlow Inc. needed a complete redesign of their financial analytics platform to improve user engagement and data comprehension. The existing tool was powerful but overwhelming for users.

We conducted user interviews with 50+ financial analysts to understand their workflows and pain points. Our design process focused on creating progressive disclosure - showing high-level summaries first, with the ability to drill down into detailed data.

Key features delivered:
• Customizable dashboard widgets
• Real-time data visualization with D3.js
• Automated report generation
• Role-based access control
• Mobile-responsive design`,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    ],
    client: 'FinFlow Inc.',
    clientIndustry: 'Financial Technology',
    duration: '3 months',
    team: ['Alex Chen', 'Sarah Miller', 'David Kim'],
    results: '3x improvement in user engagement',
    metrics: [
      { label: 'User Engagement', value: '+200%', change: '12 min to 36 min avg' },
      { label: 'Task Completion', value: '+85%', change: '45% to 83%' },
      { label: 'Support Tickets', value: '-60%', change: '120 to 48 per week' },
      { label: 'User Retention', value: '+45%', change: 'Month-over-month' },
    ],
    testimonial: {
      quote: 'Their UI/UX design process is world-class. Every interaction feels intentional, and our users love the new experience. The dashboard has become a competitive advantage for us.',
      author: 'Jessica Park',
      role: 'Product Lead, FinFlow',
    },
    tags: ['Figma', 'React', 'D3.js', 'TypeScript'],
    technologies: ['React', 'TypeScript', 'D3.js', 'Node.js', 'WebSocket', 'PostgreSQL'],
    services: ['User Research', 'UX Design', 'UI Design', 'Design System', 'Frontend Development'],
    link: '#',
    nextSteps: ['Predictive analytics module', 'Mobile app', 'White-label solution'],
  },
  {
    id: 3,
    slug: 'bloom-studio-branding',
    title: 'Bloom Studio Brand Identity',
    category: 'Branding',
    description: 'Complete brand overhaul including logo design, color system, and brand strategy.',
    fullDescription: `Bloom Studio, a creative agency themselves, needed a brand refresh that would position them as premium players in the market. The challenge was creating something sophisticated yet approachable.

Our brand strategy process involved competitive analysis, stakeholder interviews, and audience research. We discovered that their clients valued creativity paired with reliability - a insight that drove our entire design direction.

Deliverables included:
• Brand strategy and positioning
• Logo design with variations
• Comprehensive color system
• Typography guidelines
• Brand voice and messaging framework
• Social media templates
• Presentation deck design`,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    ],
    client: 'Bloom Studio',
    clientIndustry: 'Creative Agency',
    duration: '2 months',
    team: ['Alex Chen', 'David Kim'],
    results: 'Brand recognition increased by 65%',
    metrics: [
      { label: 'Brand Recognition', value: '+65%', change: 'Market survey' },
      { label: 'Website Traffic', value: '+120%', change: 'Year over year' },
      { label: 'Lead Quality', value: '+40%', change: 'Higher-value clients' },
      { label: 'Social Engagement', value: '+90%', change: 'Across all platforms' },
    ],
    testimonial: {
      quote: 'From branding to development, Flinke delivered a pixel-perfect product on time and within budget. Our new brand has opened doors to clients we could only dream of before.',
      author: 'Priya Sharma',
      role: 'Founder, Bloom Studio',
    },
    tags: ['Brand Strategy', 'Logo Design', 'Style Guide', 'Web Design'],
    technologies: ['Figma', 'Adobe Illustrator', 'Adobe After Effects'],
    services: ['Brand Strategy', 'Visual Identity', 'Logo Design', 'Style Guide', 'Brand Messaging'],
    nextSteps: ['Brand campaign execution', 'Merchandise design', 'Animated brand assets'],
  },
  {
    id: 4,
    slug: 'scaleup-landing',
    title: 'ScaleUp Landing Page',
    category: 'Web Development',
    description: 'High-converting landing page with A/B testing and marketing analytics.',
    fullDescription: `ScaleUp Inc. needed a landing page that could scale with their rapid growth. The page needed to support multiple campaigns, languages, and integrate with their existing marketing stack.

We built a modular landing page system using Next.js that allows their marketing team to create new pages without developer intervention. Each module is A/B testable and optimized for conversions.

Technical highlights:
• Component-based architecture
• Built-in A/B testing framework
• Multi-language support (8 languages)
• Advanced analytics integration
• Sub-2-second load times
• 99.9% uptime on Vercel`,
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
      'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80',
    ],
    client: 'ScaleUp Inc.',
    clientIndustry: 'SaaS / B2B',
    duration: '6 weeks',
    team: ['Marcus Johnson', 'Jessica Park'],
    results: '3x conversion rate improvement',
    metrics: [
      { label: 'Conversion Rate', value: '+200%', change: '1.5% to 4.5%' },
      { label: 'Cost Per Lead', value: '-50%', change: '$120 to $60' },
      { label: 'Page Speed', value: '1.8s', change: 'Lighthouse 95+' },
      { label: 'Bounce Rate', value: '-35%', change: '68% to 44%' },
    ],
    testimonial: {
      quote: 'The team at Flinke truly understands modern design. Our conversion rate jumped 3x after the redesign, and the modular system lets us launch campaigns in hours instead of weeks.',
      author: 'Daniel Kim',
      role: 'Marketing Director, ScaleUp Inc',
    },
    tags: ['Next.js', 'A/B Testing', 'Analytics', 'SEO'],
    technologies: ['Next.js', 'React', 'Vercel', 'Google Analytics', 'Segment', 'HubSpot'],
    services: ['Landing Page Design', 'Development', 'A/B Testing', 'Analytics Setup', 'SEO'],
    link: '#',
    nextSteps: ['Personalization engine', 'Chatbot integration', 'Video backgrounds'],
  },
  {
    id: 5,
    slug: 'healthtrack-app',
    title: 'HealthTrack Mobile App',
    category: 'UI/UX Design',
    description: 'Health tracking mobile application with focus on accessibility.',
    fullDescription: `HealthTrack LLC wanted to create a health monitoring app that would be accessible to users of all ages and abilities. Accessibility and inclusive design were core requirements.

We designed the app following WCAG 2.1 AA guidelines from the ground up. The interface uses large touch targets, high contrast modes, and supports screen readers and voice commands.

Key accessibility features:
• Dynamic type support (up to 200%)
• VoiceOver and TalkBack optimized
• Color-blind friendly palettes
• Haptic feedback for actions
• Simplified navigation patterns`,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&q=80',
    ],
    client: 'HealthTrack LLC',
    clientIndustry: 'Healthcare / Wellness',
    duration: '5 months',
    team: ['Sarah Miller', 'Lisa Wong', 'Emma Rodriguez'],
    results: '4.8★ app store rating',
    metrics: [
      { label: 'App Rating', value: '4.8★', change: '50K+ reviews' },
      { label: 'Daily Active Users', value: '250K', change: '+180% growth' },
      { label: 'Retention (Day 30)', value: '45%', change: 'Industry avg: 25%' },
      { label: 'Accessibility Score', value: '98%', change: 'WCAG 2.1 AA' },
    ],
    tags: ['Mobile Design', 'Accessibility', 'User Research', 'Prototyping'],
    technologies: ['Figma', 'Principle', 'Framer', 'ProtoPie'],
    services: ['User Research', 'UX Design', 'UI Design', 'Prototyping', 'Accessibility Audit'],
    nextSteps: ['Wearable integration', 'AI health insights', 'Telehealth features'],
  },
  {
    id: 6,
    slug: 'artisan-coffee',
    title: 'Artisan Coffee Website',
    category: 'Web Development',
    description: 'E-commerce website for a specialty coffee roaster with subscription functionality.',
    fullDescription: `Artisan Coffee Co. needed an online presence that matched the quality of their coffee. The site needed to handle both one-time purchases and a complex subscription model.

We built a custom Shopify theme that brings the warmth of their physical stores online. The subscription system handles delivery scheduling, flavor preferences, and flexible billing cycles.

Features implemented:
• Custom Shopify theme
• Subscription management portal
• Coffee flavor profiling quiz
• Loyalty points system
• Wholesale B2B ordering
• Local delivery scheduling`,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80',
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80',
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80',
    ],
    client: 'Artisan Coffee Co.',
    clientIndustry: 'Food & Beverage',
    duration: '3 months',
    team: ['David Kim', 'Marcus Johnson', 'Jessica Park'],
    results: '+120% increase in subscriptions',
    metrics: [
      { label: 'Subscription Growth', value: '+120%', change: 'Month over month' },
      { label: 'Average Order Value', value: '+45%', change: '$32 to $46' },
      { label: 'Customer LTV', value: '+80%', change: '$180 to $324' },
      { label: 'Repeat Purchase', value: '68%', change: 'Within 30 days' },
    ],
    tags: ['Shopify', 'Custom Theme', 'Subscriptions', 'Loyalty Program'],
    technologies: ['Shopify', 'Liquid', 'JavaScript', 'Recharge', 'Klaviyo', 'Gorgias'],
    services: ['E-commerce Strategy', 'Custom Theme', 'Subscription Setup', 'Email Marketing', 'Loyalty Program'],
    link: '#',
    nextSteps: ['Mobile app', 'Coffee marketplace', 'International shipping'],
  },
];

export const categories = ['All', 'Web Development', 'UI/UX Design', 'Branding'];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getProjectById(id: number): Project | undefined {
  return projects.find((p) => p.id === id);
}
