import { useState, type FormEvent } from 'react';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import SectionIntro from '@/components/landing/SectionIntro';
import { primaryConsultationLabel } from '@/data/landing-content';
import { submitContactForm } from '@/lib/supabase';

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

const ContactForm = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    projectType: '',
    budget: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = (): boolean => {
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
    } else if (formData.message.length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

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

      await submitContactForm({
        first_name: firstName,
        last_name: lastName,
        email: formData.email,
        phone: 'N/A',
        country: 'US',
        services: [formData.projectType],
        message: `Budget: ${formData.budget}\n\n${formData.message}`,
      });

      setShowSuccess(true);
      toast.success('Consultation request sent', {
        description: 'We will reply with a practical next step within 24 hours.',
      });
    } catch (error) {
      console.error('Form submission error:', error);
      const detail =
        error instanceof Error ? error.message : 'Unknown submission error';

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

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      projectType: '',
      budget: '',
      message: '',
    });
    setErrors({});
    setShowSuccess(false);
  };

  return (
    <section id="contact" className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          <SectionIntro
            eyebrow="Contact"
            title="Tell us about the project you need help moving forward."
            description="Share the business goal, budget range, and timeline. We will reply with a practical next step within 24 hours."
            className="mb-10"
          />

          <form onSubmit={handleSubmit} className="glass-card space-y-6 p-8">
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
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name ? (
                  <p className="text-sm text-red-500">{errors.name}</p>
                ) : null}
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
                  className={errors.email ? 'border-red-500' : ''}
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
                  onValueChange={(value) =>
                    handleInputChange('projectType', value)
                  }
                >
                  <SelectTrigger
                    className={errors.projectType ? 'border-red-500' : ''}
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
                    className={errors.budget ? 'border-red-500' : ''}
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
                className={`min-h-[120px] ${errors.message ? 'border-red-500' : ''}`}
              />
              {errors.message ? (
                <p className="text-sm text-red-500">{errors.message}</p>
              ) : null}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  {primaryConsultationLabel}
                  <Send className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>

            <p className="text-center text-xs text-text-secondary">
              Free consultation. No commitment required. Response within 24
              hours.
            </p>
          </form>
        </div>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Consultation Request Sent
            </DialogTitle>
            <DialogDescription className="text-center">
              Thank you for reaching out. Our team will review your project
              details and get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-6 flex justify-center">
            <Button onClick={resetForm} variant="hero">
              Send Another Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default ContactForm;
