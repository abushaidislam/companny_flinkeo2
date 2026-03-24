import { ArrowRight, CalendarDays, CheckCircle2, MessageCircleMore } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

import Navbar from '@/components/landing/Navbar';
import { Footer } from '@/components/ui/footer-section';
import { Button } from '@/components/ui/button';
import {
  buildContactHref,
  buildWhatsAppHref,
  companyContact,
  getIntentCopy,
} from '@/data/company-contact';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const intent = searchParams.get('intent');
  const service = searchParams.get('service');
  const intentCopy = getIntentCopy(intent);
  const whatsAppHref = buildWhatsAppHref(
    `Hi Flinke, I just sent a ${intent ?? 'project'} inquiry and want to continue the conversation.`,
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto px-4">
          <section className="section-shell mx-auto max-w-5xl overflow-hidden px-6 py-10 sm:px-8 md:px-12 md:py-14">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
              <div>
                <div className="inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  Inquiry received
                </div>
                <h1 className="mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-foreground md:text-6xl">
                  Thanks. Your request is in and we will follow up with a practical next step.
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary md:text-lg">
                  {intentCopy.description}
                </p>

                <div className="mt-8 grid gap-4 border-t border-border/70 pt-6 sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
                      Reply window
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground/85">
                      Within 24 hours with a clear recommendation.
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
                      Inquiry type
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground/85">
                      {intentCopy.title}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-text-secondary">
                      Suggested next action
                    </p>
                    <p className="mt-2 text-sm leading-6 text-foreground/85">
                      Keep the conversation moving on WhatsApp or book the call now.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-border/70 bg-card/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-secondary">
                  Continue from here
                </p>
                <div className="mt-5 space-y-3">
                  <Button variant="hero" className="w-full" asChild>
                    <Link
                      to={buildContactHref({
                        intent: 'booking',
                        service: service ?? 'strategy',
                        source: 'thank-you',
                      })}
                    >
                      <CalendarDays className="h-4 w-4" />
                      Book the strategy call
                    </Link>
                  </Button>
                  <Button variant="heroOutline" className="w-full" asChild>
                    <a href={whatsAppHref} target="_blank" rel="noreferrer">
                      <MessageCircleMore className="h-4 w-4" />
                      Continue on WhatsApp
                    </a>
                  </Button>
                  <Button variant="ghost" className="w-full justify-between" asChild>
                    <Link to="/">
                      Back to homepage
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <div className="mt-6 border-t border-border/70 pt-5 text-sm leading-6 text-text-secondary">
                  <p>{companyContact.email}</p>
                  <p>{companyContact.phoneDisplay}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ThankYou;
