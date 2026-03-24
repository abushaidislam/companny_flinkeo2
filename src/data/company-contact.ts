export type ContactIntent = 'booking' | 'quote' | 'case-study' | 'support';

type ContactLinkOptions = {
  intent?: ContactIntent;
  service?: string;
  brief?: string;
  source?: string;
};

type IntentCopy = {
  title: string;
  description: string;
  buttonLabel: string;
};

export const companyContact = {
  email: 'hello@flinke.studio',
  emailHref: 'mailto:hello@flinke.studio',
  // Replace this placeholder number with the real business WhatsApp number before launch.
  whatsAppNumber: '8801700000000',
  whatsAppDisplay: '+880 1700 000000',
  phoneDisplay: '+880 1700 000000',
  phoneHref: 'tel:+8801700000000',
} as const;

const defaultIntentCopy: Record<ContactIntent, IntentCopy> = {
  booking: {
    title: 'Book a strategy call',
    description:
      'Share your timeline, current site, and the business result you need before we scope the work.',
    buttonLabel: 'Request the Call',
  },
  quote: {
    title: 'Request a project quote',
    description:
      'Tell us what you need built, what is already live, and the budget range you are planning around.',
    buttonLabel: 'Request a Quote',
  },
  'case-study': {
    title: 'Ask about a similar engagement',
    description:
      'Reference a case study, explain what outcome you want, and we will suggest the closest-fit approach.',
    buttonLabel: 'Discuss a Similar Project',
  },
  support: {
    title: 'Tell us what needs help',
    description:
      'Use this form for a redesign, launch support, CRO cleanup, or a sharper service page structure.',
    buttonLabel: 'Send the Brief',
  },
};

export function getIntentCopy(intent?: string | null): IntentCopy {
  if (!intent) return defaultIntentCopy.booking;
  if (intent === 'quote') return defaultIntentCopy.quote;
  if (intent === 'case-study') return defaultIntentCopy['case-study'];
  if (intent === 'support') return defaultIntentCopy.support;
  return defaultIntentCopy.booking;
}

export function buildContactHref({
  intent = 'booking',
  service,
  brief,
  source,
}: ContactLinkOptions = {}) {
  const params = new URLSearchParams();
  params.set('intent', intent);

  if (service) {
    params.set('service', service);
  }

  if (brief) {
    params.set('brief', brief);
  }

  if (source) {
    params.set('source', source);
  }

  return `/contact?${params.toString()}`;
}

export function buildWhatsAppHref(message: string) {
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/${companyContact.whatsAppNumber}?${params.toString()}`;
}

export const bookingConsultationHref = buildContactHref({
  intent: 'booking',
  service: 'strategy',
  brief:
    'I want to book a strategy call to review goals, scope, and the right next step.',
});

export const defaultWhatsAppHref = buildWhatsAppHref(
  'Hi Flinke, I want to discuss a website or product project.',
);

export function mapServiceToLandingProjectType(service?: string | null) {
  switch (service) {
    case 'web-development':
    case 'website':
      return 'website';
    case 'webapp':
      return 'webapp';
    case 'ecommerce':
      return 'ecommerce';
    case 'ui':
    case 'ui-ux-design':
    case 'uiux':
      return 'uiux';
    case 'branding':
      return 'branding';
    default:
      return service ?? '';
  }
}

export function mapServiceToContactSelections(service?: string | null) {
  switch (service) {
    case 'web-development':
    case 'website':
    case 'webapp':
    case 'ecommerce':
      return ['website'];
    case 'ui':
    case 'ui-ux-design':
    case 'uiux':
      return ['ui'];
    case 'branding':
      return ['content'];
    case 'strategy':
    case 'consulting':
    case 'growth-marketing':
      return ['strategy'];
    default:
      return service ? [service] : [];
  }
}
