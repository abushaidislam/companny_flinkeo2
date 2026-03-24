import { useEffect, useState, type FormEvent } from 'react';
import {
  CalendarDays,
  Loader2,
  Mail,
  MessageCircleMore,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import SectionIntro from '@/components/landing/SectionIntro';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  buildContactHref,
  buildWhatsAppHref,
  companyContact,
  getIntentCopy,
  mapServiceToLandingProjectType,
} from '@/data/company-contact';
import {
  getSupabaseUnavailableMessage,
  hasSupabaseConfig,
  submitContactForm,
} from '@/lib/supabase';

interface ContactFormData {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  message?: string;
}

const defaultFormData: ContactFormData = {
  name: '',
  email: '',
  projectType: '',
  budget: '',
  message: '',
};

const ContactForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContactFormData>(defaultFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intent = searchParams.get('intent');
  const service = searchParams.get('service');
  const brief = searchParams.get('brief');
  const source = searchParams.get('source');
  const intentCopy = getIntentCopy(intent);
  const whatsAppHref = buildWhatsAppHref(
    `Hi Flinke, I want to discuss a ${service ?? 'website'} project.`,
  );

  useEffect(() => {
    setFormData((current) => ({
      ...current,
      projectType:
        current.projectType || mapServiceToLandingProjectType(service) || current.projectType,
      message: current.message || brief || current.message,
    }));
  }, [brief, service]);

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.projectType) {
      newErrors.projectType = 'Please select a project type';
    }

    if (!formData.budget) {
      newErrors.budget = 'Please select a budget range';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please tell us about your project';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!hasSupabaseConfig) {
      toast.error('Contact form unavailable', {
        description: getSupabaseUnavailableMessage('Contact form'),
      });
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors', {
        description: 'Fill in all required fields correctly.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      const leadNotes = [
        `Intent: ${intent ?? 'booking'}`,
        source ? `Source: ${source}` : null,
        `Budget: ${formData.budget}`,
        '',
        formData.message,
      ]
        .filter(Boolean)
        .join('\n');

      await submitContactForm({
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: 'N/A',
        country: 'BD',
        services: [formData.projectType],
        message: leadNotes,
      });

      toast.success('Consultation request sent', {
        description: 'We will reply with a practical next step within 24 hours.',
      });

      navigate(
        buildContactHref({
          intent: (intent as 'booking' | 'quote' | 'case-study' | 'support') ?? 'booking',
          service: formData.projectType,
          source: source ?? 'landing-form',
        }).replace('/contact', '/thank-you'),
      );
    } catch (error) {
      console.error('Form submission error:', error);
      const detail = error instanceof Error ? error.message : 'Unknown submission error';

      toast.error('Failed to send message', {
        description:
          detail === 'Unknown submission error'
            ? 'Please try again or contact us directly.'
            : detail,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <section id="contact" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="section-shell mx-auto max-w-6xl overflow-hidden">
          <div className="grid lg:grid-cols-[minmax(18rem,0.85fr)_minmax(0,1.15fr)]">
            <div className="relative border-b border-border/70 bg-[linear-gradient(180deg,hsl(24_20%_9%),hsl(24_14%_14%))] px-6 py-10 text-white sm:px-8 md:px-10 lg:border-b-0 lg:border-r lg:border-white/10 lg:py-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(0_0%_100%_/_0.12),transparent_28%),radial-gradient(circle_at_bottom,hsl(35_50%_70%_/_0.12),transparent_34%)]" />
              <div className="relative">
                <SectionIntro
                  eyebrow="Contact"
                  title={intentCopy.title}
                  description={intentCopy.description}
                  align="left"
                  className="mb-10 max-w-none [&_h2]:text-white [&_p:first-child]:text-white/60 [&_p:last-child]:text-white/72"
                />

                <div className="space-y-5 border-t border-white/10 pt-6">
                  <div className="flex items-start gap-4">
                    <CalendarDays className="mt-1 h-5 w-5 text-white/70" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
                        Response time
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/78">
                        Direct follow-up within 24 hours with a recommended next step.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <ShieldCheck className="mt-1 h-5 w-5 text-white/70" />
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/55">
                        Best inquiry format
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/78">
                        Add current site, timeline, budget range, and the exact business goal
                        this project should support.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 space-y-3 border-t border-white/10 pt-6 text-sm text-white/78">
                  <a
                    href={companyContact.emailHref}
                    className="flex items-center gap-3 transition-colors hover:text-white"
                  >
                    <Mail className="h-4 w-4" />
                    {companyContact.email}
                  </a>
                  <a
                    href={whatsAppHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 transition-colors hover:text-white"
                  >
                    <MessageCircleMore className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="px-6 py-8 sm:px-8 md:px-10 md:py-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`h-12 rounded-xl bg-card/70 px-4 text-base md:text-sm ${
                        errors.name ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.name ? <p className="text-sm text-red-500">{errors.name}</p> : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@company.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`h-12 rounded-xl bg-card/70 px-4 text-base md:text-sm ${
                        errors.email ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.email ? (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>
                      Project Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.projectType}
                      onValueChange={(value) => handleInputChange('projectType', value)}
                    >
                      <SelectTrigger
                        className={`h-12 rounded-xl bg-card/70 px-4 ${
                          errors.projectType ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="website">Website Design</SelectItem>
                        <SelectItem value="webapp">Web Application</SelectItem>
                        <SelectItem value="ecommerce">E-commerce</SelectItem>
                        <SelectItem value="uiux">UI/UX Design</SelectItem>
                        <SelectItem value="branding">Brand Identity</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.projectType ? (
                      <p className="text-sm text-red-500">{errors.projectType}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label>
                      Budget Range <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.budget}
                      onValueChange={(value) => handleInputChange('budget', value)}
                    >
                      <SelectTrigger
                        className={`h-12 rounded-xl bg-card/70 px-4 ${
                          errors.budget ? 'border-red-500' : ''
                        }`}
                      >
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2k-5k">$2,500 - $5,000</SelectItem>
                        <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k+">$25,000+</SelectItem>
                        <SelectItem value="not-sure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.budget ? (
                      <p className="text-sm text-red-500">{errors.budget}</p>
                    ) : null}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    Project Details <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project goals, timeline, and any specific requirements..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className={`min-h-[180px] rounded-2xl bg-card/70 px-4 py-4 text-base md:text-sm ${
                      errors.message ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.message ? (
                    <p className="text-sm text-red-500">{errors.message}</p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-sm text-sm leading-6 text-text-secondary">
                    {hasSupabaseConfig
                      ? 'Free consultation. No commitment required. Share enough context and we will respond with a concrete recommendation.'
                      : 'Form submissions are unavailable in this environment. Use email or WhatsApp while Supabase is not configured.'}
                  </p>

                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="w-full sm:min-w-[15rem] sm:w-auto"
                    disabled={isSubmitting || !hasSupabaseConfig}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        {hasSupabaseConfig ? intentCopy.buttonLabel : 'Form unavailable'}
                        <Send className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
