import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Loader2, MessageCircle, Mail, Twitter } from 'lucide-react';
import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/ui/footer-section';
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
  message?: string;
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
  const [formData, setFormData] = useState<ContactFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'US',
    services: [],
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const validateForm = (): boolean => {
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
      // Submit to Supabase
      await submitContactForm({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        services: formData.services,
        message: formData.message,
      });

      setIsSubmitting(false);
      setShowSuccess(true);

      toast({
        title: 'Message Sent!',
        description: "We'll get back to you within 24 hours.",
      });
    } catch (error) {
      setIsSubmitting(false);
      console.error('Failed to submit:', error);
      const detail =
        error instanceof Error ? error.message : 'Unknown submission error';
      toast({
        title: 'Failed to send message',
        description:
          detail === 'Unknown submission error'
            ? 'Please try again later or contact us directly via email.'
            : detail,
        variant: 'destructive',
      });
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
      const newServices = prev.services.includes(serviceId)
        ? prev.services.filter((s) => s !== serviceId)
        : [...prev.services, serviceId];
      return { ...prev, services: newServices };
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      country: 'US',
      services: [],
      message: '',
    });
    setErrors({});
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left Side - Form */}
            <div>
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                Get in touch
              </h1>
              <p className="text-text-secondary text-lg mb-8 max-w-md">
                We're here to help. Chat to our friendly team 24/7 and get set up and ready to go in just 5 minutes.
              </p>

              {/* Quick Contact Options */}
              <div className="space-y-4 mb-10">
                <a
                  href="#"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Start a live chat</span>
                </a>
                <a
                  href="mailto:hello@flinke.studio"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>Shoot us an email</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-3 text-foreground hover:text-primary transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                  <span>Message us on Twitter</span>
                </a>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={errors.email ? 'border-red-500' : ''}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone number
                  </Label>
                  <div className="flex gap-2">
                    <select
                      value={formData.country}
                      onChange={(e) =>
                        handleInputChange('country', e.target.value)
                      }
                      className="w-20 px-3 py-2 rounded-md border border-input bg-background text-sm"
                    >
                      <option value="US">US</option>
                      <option value="UK">UK</option>
                      <option value="CA">CA</option>
                      <option value="AU">AU</option>
                      <option value="BD">BD</option>
                    </select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`flex-1 ${errors.phone ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs">{errors.phone}</p>
                  )}
                </div>

                {/* Services */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Services</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.id}
                          checked={formData.services.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <Label
                          htmlFor={service.id}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {service.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                  {errors.services && (
                    <p className="text-red-500 text-xs">{errors.services}</p>
                  )}
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message (optional)
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project..."
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-foreground hover:bg-foreground/90 text-background"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>Send message</>
                  )}
                </Button>
              </form>
            </div>

            {/* Right Side - Map */}
            <div className="hidden lg:block">
              <div className="sticky top-24 h-[calc(100vh-8rem)] rounded-2xl overflow-hidden bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.9537353153167!3d-37.81732767975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sbd!4v1635064837645!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(100%)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                />
                {/* Location Pin Overlay */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-12 h-12 bg-foreground rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-background rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-2xl">
              Message Sent Successfully!
            </DialogTitle>
            <DialogDescription className="text-center">
              Thank you for reaching out. Our team will review your project details and get back to you within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button onClick={resetForm} variant="hero">
              Send Another Message
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactPage;
