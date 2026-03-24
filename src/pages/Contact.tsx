import { useEffect, useState } from 'react';
import { CalendarDays, Loader2, Mail, MessageCircleMore } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/ui/footer-section';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  buildContactHref,
  buildWhatsAppHref,
  companyContact,
  getIntentCopy,
  mapServiceToContactSelections,
} from '@/data/company-contact';
import { submitContactForm } from '@/lib/supabase';

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  services: string[];
  message: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  services?: string;
}

const services = [
  { id: 'website', label: 'Website design' },
  { id: 'ui', label: 'UI design' },
  { id: 'research', label: 'User research' },
  { id: 'content', label: 'Content creation' },
  { id: 'strategy', label: 'Strategy & consulting' },
  { id: 'other', label: 'Other' },
];

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'BD',
    services: [],
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intent = searchParams.get('intent');
  const service = searchParams.get('service');
  const brief = searchParams.get('brief');
  const source = searchParams.get('source');
  const intentCopy = getIntentCopy(intent);
  const whatsAppHref = buildWhatsAppHref(
    `Hi Flinke, I want to continue the conversation about my ${service ?? 'project'} inquiry.`,
  );

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      services: current.services.length > 0 ? current.services : mapServiceToContactSelections(service),
      message: current.message || brief || current.message,
    }));
  }, [brief, service]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (formData.services.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Please fix the errors',
        description: 'Fill in all required fields correctly.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const leadNotes = [
        `Intent: ${intent ?? 'booking'}`,
        source ? `Source: ${source}` : null,
        '',
        formData.message || 'No additional project notes were added.',
      ]
        .filter(Boolean)
        .join('\n');

      await submitContactForm({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        services: formData.services,
        message: leadNotes,
      });

      toast({
        title: 'Message sent',
        description: 'We will follow up within 24 hours.',
      });

      navigate(
        buildContactHref({
          intent: (intent as 'booking' | 'quote' | 'case-study' | 'support') ?? 'booking',
          service: service ?? formData.services[0],
          source: source ?? 'contact-page',
        }).replace('/contact', '/thank-you'),
      );
    } catch (error) {
      console.error('Failed to submit:', error);
      const detail = error instanceof Error ? error.message : 'Unknown submission error';

      toast({
        title: 'Failed to send message',
        description:
          detail === 'Unknown submission error'
            ? 'Please try again later or contact us directly via email.'
            : detail,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => {
      const nextServices = prev.services.includes(serviceId)
        ? prev.services.filter((item) => item !== serviceId)
        : [...prev.services, serviceId];

      return { ...prev, services: nextServices };
    });

    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-16 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_24rem]">
            <div className="space-y-8">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-text-secondary">
                  Contact
                </p>
                <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                  {intentCopy.title}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
                  {intentCopy.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <a
                  href={buildContactHref({
                    intent: 'booking',
                    service: service ?? 'strategy',
                    source: 'contact-page-card',
                  })}
                  className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5 transition-colors hover:border-foreground/20"
                >
                  <CalendarDays className="h-5 w-5 text-foreground" />
                  <p className="mt-4 font-medium text-foreground">Strategy Call</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Turn this into a scoped next step.
                  </p>
                </a>
                <a
                  href={whatsAppHref}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5 transition-colors hover:border-foreground/20"
                >
                  <MessageCircleMore className="h-5 w-5 text-foreground" />
                  <p className="mt-4 font-medium text-foreground">WhatsApp</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Continue the conversation directly.
                  </p>
                </a>
                <a
                  href={companyContact.emailHref}
                  className="rounded-[1.5rem] border border-border/70 bg-card/60 p-5 transition-colors hover:border-foreground/20"
                >
                  <Mail className="h-5 w-5 text-foreground" />
                  <p className="mt-4 font-medium text-foreground">Email</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">
                    Send references, docs, or project notes.
                  </p>
                </a>
              </div>

              <div className="section-shell px-6 py-8 sm:px-8 md:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={errors.firstName ? 'border-red-500' : ''}
                      />
                      {errors.firstName ? (
                        <p className="text-xs text-red-500">{errors.firstName}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={errors.lastName ? 'border-red-500' : ''}
                      />
                      {errors.lastName ? (
                        <p className="text-xs text-red-500">{errors.lastName}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={errors.email ? 'border-red-500' : ''}
                      />
                      {errors.email ? (
                        <p className="text-xs text-red-500">{errors.email}</p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone number</Label>
                      <div className="flex gap-2">
                        <select
                          value={formData.country}
                          onChange={(e) => handleInputChange('country', e.target.value)}
                          className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="BD">BD</option>
                          <option value="US">US</option>
                          <option value="UK">UK</option>
                          <option value="CA">CA</option>
                          <option value="AU">AU</option>
                        </select>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder={companyContact.phoneDisplay}
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.phone ? (
                        <p className="text-xs text-red-500">{errors.phone}</p>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Services</Label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {services.map((item) => (
                        <label
                          key={item.id}
                          htmlFor={item.id}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/70 bg-card/50 px-4 py-3"
                        >
                          <Checkbox
                            id={item.id}
                            checked={formData.services.includes(item.id)}
                            onCheckedChange={() => handleServiceToggle(item.id)}
                          />
                          <span className="text-sm text-foreground">{item.label}</span>
                        </label>
                      ))}
                    </div>
                    {errors.services ? (
                      <p className="text-xs text-red-500">{errors.services}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Project brief</Label>
                    <Textarea
                      id="message"
                      placeholder="Tell us about your project, timeline, business goal, and the current state of the site or product."
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="min-h-[160px]"
                    />
                  </div>

                  <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl text-sm leading-6 text-text-secondary">
                      Share enough context and we will respond with a practical recommendation,
                      not a generic sales email.
                    </p>
                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full sm:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        intentCopy.buttonLabel
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-[1.75rem] border border-border/70 bg-[linear-gradient(180deg,hsl(24_20%_9%),hsl(24_14%_14%))] p-6 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
                  Direct contact
                </p>
                <div className="mt-5 space-y-4 text-sm leading-6 text-white/78">
                  <p>{companyContact.email}</p>
                  <p>{companyContact.phoneDisplay}</p>
                  <p>Best for strategy calls, redesign scope, and launch planning.</p>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border/70 bg-card/60 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  What to send
                </p>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-text-secondary">
                  <li>Current website or product link</li>
                  <li>Target launch window or decision deadline</li>
                  <li>Budget range and internal stakeholders</li>
                  <li>Examples of sites or products you reference</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
