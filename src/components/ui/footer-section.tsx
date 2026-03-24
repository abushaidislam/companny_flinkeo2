'use client';

import * as React from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Mail, MessageCircleMore, Phone } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  bookingConsultationHref,
  companyContact,
  defaultWhatsAppHref,
} from '@/data/company-contact';

interface FooterLink {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface FooterSection {
  label: string;
  links: FooterLink[];
}

const footerLinks: FooterSection[] = [
  {
    label: 'Services',
    links: [
      { title: 'Web Development', href: '/#services' },
      { title: 'UI/UX Design', href: '/#services' },
      { title: 'Brand Identity', href: '/#services' },
      { title: 'SEO & Performance', href: '/#pricing' },
    ],
  },
  {
    label: 'Company',
    links: [
      { title: 'Our Work', href: '/#work' },
      { title: 'Process', href: '/#process' },
      { title: 'Team', href: '/team' },
      { title: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'Resources',
    links: [
      { title: 'Blog', href: '/blog' },
      { title: 'Case Studies', href: '/#work' },
      { title: 'FAQ', href: '/#faq' },
      { title: 'Pricing', href: '/#pricing' },
    ],
  },
  {
    label: 'Contact',
    links: [
      { title: 'Book a Call', href: bookingConsultationHref, icon: CalendarDays },
      { title: 'WhatsApp', href: defaultWhatsAppHref, icon: MessageCircleMore },
      { title: 'Email', href: companyContact.emailHref, icon: Mail },
      { title: 'Phone', href: companyContact.phoneHref, icon: Phone },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-12 border-t border-border/70">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="section-shell overflow-hidden px-6 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="grid gap-10 xl:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] xl:items-start">
            <AnimatedContainer className="max-w-md space-y-6">
              <div className="space-y-4">
                <Link to="/" className="inline-flex items-center gap-3">
                  <img src="/favicon.svg" alt="Flinke" className="h-10 w-10" />
                  <span className="font-display text-2xl font-bold tracking-tight text-foreground">
                    Flinke
                  </span>
                </Link>
                <p className="text-sm leading-7 text-text-secondary">
                  Design and development support for teams that want cleaner positioning,
                  faster launch momentum, and a site that helps sales conversations start
                  sooner.
                </p>
              </div>

              <div className="flex flex-col gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
                    Start a project
                  </p>
                  <p className="mt-2 text-sm text-foreground/85">
                    Book a call or continue the discussion on WhatsApp.
                  </p>
                </div>
                <Button variant="hero" className="w-full sm:w-auto" asChild>
                  <Link to={bookingConsultationHref}>
                    Book a call <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <div className="space-y-1 text-sm text-text-secondary">
                <p>{companyContact.email}</p>
                <p>{companyContact.phoneDisplay}</p>
                <p>© {new Date().getFullYear()} Flinke. All rights reserved.</p>
              </div>
            </AnimatedContainer>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
              {footerLinks.map((section, index) => (
                <AnimatedContainer key={section.label} delay={0.1 + index * 0.08}>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                      {section.label}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm">
                      {section.links.map((link) => (
                        <li key={link.title}>
                          {link.href.startsWith('/') ? (
                            <Link
                              to={link.href}
                              className="inline-flex items-center gap-2 text-text-secondary transition-colors duration-300 hover:text-foreground"
                            >
                              {link.icon ? <link.icon className="h-4 w-4" /> : null}
                              {link.title}
                            </Link>
                          ) : (
                            <a
                              href={link.href}
                              target={link.href.startsWith('http') ? '_blank' : undefined}
                              rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                              className="inline-flex items-center gap-2 text-text-secondary transition-colors duration-300 hover:text-foreground"
                            >
                              {link.icon ? <link.icon className="h-4 w-4" /> : null}
                              {link.title}
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </AnimatedContainer>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>['className'];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ filter: 'blur(4px)', y: -8, opacity: 0 }}
      whileInView={{ filter: 'blur(0px)', y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
