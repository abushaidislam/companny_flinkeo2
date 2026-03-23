import {
  BarChart3,
  Code2,
  Globe,
  MessageSquare,
  PenTool,
  Rocket,
  ShieldCheck,
  Smartphone,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type LandingIconItem = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type LandingStat = {
  label: string;
  value: string;
};

export type LandingSectionCopy = {
  eyebrow: string;
  title: string;
  description: string;
};

export type LandingPricingPlan = {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
};

export type LandingTestimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export type LandingFaq = {
  question: string;
  answer: string;
  imageSrc: string;
  imageAlt: string;
};

export const primaryConsultationLabel = "Book a Free Consultation";

export const heroContent = {
  eyebrow: "Flinke digital agency",
  title: "Websites and product experiences built to turn attention into inquiries.",
  description:
    "We partner with growth-stage teams that need sharper positioning, faster execution, and a site that helps sales conversations start sooner.",
  primaryCta: primaryConsultationLabel,
  secondaryCta: "See Our Work",
  proofLine: [
    "200+ launches delivered",
    "98% client satisfaction",
    "Weekly visibility from kickoff to launch",
  ],
  visual: {
    label: "Delivery snapshot",
    title: "One clear view of strategy, design, and launch momentum.",
    metrics: [
      { label: "This week", value: "3 active milestones" },
      { label: "Avg. turnaround", value: "5 business days" },
      { label: "Launch readiness", value: "92%" },
    ],
    phases: [
      "Positioning and page architecture",
      "High-fidelity UI and messaging polish",
      "Launch checklist and conversion QA",
    ],
  },
};

export const trustSection = {
  eyebrow: "Selected engagements",
  logos: [
    "NovaTech",
    "FinFlow",
    "Bloom Studio",
    "ScaleUp",
    "HealthTrack",
    "Artisan Coffee",
  ],
  stats: [
    { label: "Projects delivered", value: "200+" },
    { label: "Countries served", value: "15+" },
    { label: "Avg. satisfaction", value: "98%" },
  ] satisfies LandingStat[],
};

export const servicesSection = {
  copy: {
    eyebrow: "Core services",
    title: "Focused support from positioning through launch.",
    description:
      "Each engagement is scoped to remove friction in the buying journey, clarify the offer, and ship a site your team can sell with confidence.",
  } satisfies LandingSectionCopy,
  items: [
    {
      icon: Code2,
      title: "Conversion-ready websites",
      description:
        "Custom marketing sites and web builds structured around clear messaging, strong performance, and lead capture.",
    },
    {
      icon: PenTool,
      title: "UI and product design",
      description:
        "Interface systems that make your product easier to understand, trust, and adopt across desktop and mobile.",
    },
    {
      icon: BarChart3,
      title: "Positioning and CRO",
      description:
        "Sharper page structure, offer framing, and funnel decisions that support better sales conversations.",
    },
    {
      icon: Smartphone,
      title: "Responsive delivery",
      description:
        "Design and implementation tuned for common mobile breakpoints, touch targets, and scroll behavior.",
    },
  ] satisfies LandingIconItem[],
};

export const processSection = {
  copy: {
    eyebrow: "How we work",
    title: "A compact process with weekly clarity.",
    description:
      "You get momentum without losing visibility. Every phase ends with a concrete review point and a clear next action.",
  } satisfies LandingSectionCopy,
  steps: [
    {
      icon: MessageSquare,
      step: "01",
      title: "Scope the commercial story",
      description:
        "We define audience, offer, page priorities, and the exact actions the landing experience should drive.",
    },
    {
      icon: PenTool,
      step: "02",
      title: "Design the decision path",
      description:
        "We shape the interface, proof hierarchy, and section flow so visitors understand the offer fast.",
    },
    {
      icon: Rocket,
      step: "03",
      title: "Ship and refine",
      description:
        "We launch with QA, performance checks, and a clear punch list for the first optimization cycle.",
    },
  ],
};

export const testimonialsSection = {
  copy: {
    eyebrow: "Client outcomes",
    title: "Proof from teams that needed clearer digital traction.",
    description:
      "These testimonials work best as outcome proof, not brand theater. The emphasis stays on business movement.",
  } satisfies LandingSectionCopy,
  items: [
    {
      quote:
        "Flinke rebuilt our website around the sales story, and inbound lead quality improved within the first quarter after launch.",
      name: "Alex Rivera",
      designation: "CEO, NovaTech Solutions",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "The team clarified a complex product into a cleaner decision path. Demos became easier to book and easier to close.",
      name: "Jessica Park",
      designation: "Product Lead, FinFlow",
      src: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "We needed stronger positioning, not just a redesign. The new site finally matched the caliber of clients we wanted to attract.",
      name: "Priya Sharma",
      designation: "Founder, Bloom Studio",
      src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop",
    },
    {
      quote:
        "Their process kept decisions moving. We had visibility every week and launched without the usual last-minute scramble.",
      name: "Daniel Kim",
      designation: "Marketing Director, ScaleUp",
      src: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?q=80&w=800&auto=format&fit=crop",
    },
  ] satisfies LandingTestimonial[],
};

export const pricingSection = {
  copy: {
    eyebrow: "Investment",
    title: "Clear starting points for the work most teams ask us for.",
    description:
      "Use these as planning ranges. We scope around business goals, delivery speed, and the amount of design and implementation support needed.",
  } satisfies LandingSectionCopy,
  plans: [
    {
      name: "Starter",
      price: "$2,500",
      period: "per project",
      description: "For landing pages, campaign pages, and fast offer validation.",
      features: [
        "Landing page strategy and page outline",
        "Custom responsive design",
        "Development and launch QA",
        "Two review rounds",
      ],
    },
    {
      name: "Growth",
      price: "$6,500",
      period: "per project",
      description: "For full marketing sites that need stronger positioning and conversion flow.",
      features: [
        "Up to 10 core pages",
        "UI design and prototype review",
        "CMS or content workflow setup",
        "Analytics and SEO foundation",
        "Priority communication cadence",
      ],
      popular: true,
    },
    {
      name: "Custom",
      price: "Scoped",
      period: "per engagement",
      description: "For product marketing sites, rebrands, and more complex implementation needs.",
      features: [
        "Discovery workshop and tailored roadmap",
        "Custom interfaces and system design",
        "Advanced integrations or migration planning",
        "Launch support and follow-up optimization",
      ],
    },
  ] satisfies LandingPricingPlan[],
};

export const faqSection = {
  copy: {
    eyebrow: "FAQ",
    title: "Answers to the questions that usually come before the first call.",
    description:
      "The goal here is practical clarity: timeline, scope, support, and the way we structure engagements.",
  } satisfies LandingSectionCopy,
  items: [
    {
      question: "What types of projects are the best fit for Flinke?",
      answer:
        "We are strongest when a team needs a sharper website, a clearer offer, or a product-facing experience that helps move prospects toward inquiry or demo.",
      imageSrc: "/faq/faq-01.svg",
      imageAlt: "Flinke services overview",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "Landing pages usually take 1 to 2 weeks. Full marketing sites commonly take 4 to 6 weeks. More complex builds are scoped after the consultation call.",
      imageSrc: "/faq/faq-02.svg",
      imageAlt: "Project timeline illustration",
    },
    {
      question: "Do you support projects after launch?",
      answer:
        "Yes. We can stay involved for content changes, QA, iteration rounds, and focused improvements after the first release.",
      imageSrc: "/faq/faq-03.svg",
      imageAlt: "Ongoing support illustration",
    },
    {
      question: "Do you work only on design, or also on implementation?",
      answer:
        "Both. We can handle strategy, interface design, and front-end implementation as one continuous engagement.",
      imageSrc: "/faq/faq-04.svg",
      imageAlt: "Technology stack illustration",
    },
    {
      question: "Can you redesign an existing site without rebuilding everything?",
      answer:
        "Yes. If the current stack is workable, we can improve structure, copy hierarchy, and UI while preserving the parts that already support your team well.",
      imageSrc: "/faq/faq-05.svg",
      imageAlt: "Website redesign illustration",
    },
    {
      question: "What happens in the first consultation?",
      answer:
        "We review your audience, goals, current site, timeline, and budget range. The output should be a clearer next step, not a vague sales call.",
      imageSrc: "/faq/faq-06.svg",
      imageAlt: "Getting started illustration",
    },
  ] satisfies LandingFaq[],
};

export const finalCtaSection = {
  eyebrow: "Next step",
  title: "Book a practical consultation before you commit to scope.",
  description:
    "Bring your current site, your target timeline, and the business outcome you need. We will help you define the right next move.",
  buttonLabel: primaryConsultationLabel,
  supportText: "Free consultation. No commitment required.",
};

export const trustHighlightItems: LandingIconItem[] = [
  {
    icon: ShieldCheck,
    title: "Clear communication",
    description: "Weekly visibility, scoped milestones, and fewer handoff surprises.",
  },
  {
    icon: Zap,
    title: "Fast execution",
    description: "Shorter decision loops and launch-ready delivery without filler work.",
  },
  {
    icon: Globe,
    title: "Global delivery",
    description: "Engagements structured to work across distributed teams and time zones.",
  },
];
