import { CalendarDays, MessageCircleMore } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { bookingConsultationHref, defaultWhatsAppHref } from '@/data/company-contact';

export function FloatingContactRail() {
  const location = useLocation();

  if (location.pathname.startsWith('/admin') || location.pathname === '/thank-you') {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-40 px-4 sm:bottom-6">
      <div className="mx-auto flex max-w-max items-center gap-2 rounded-full border border-border/80 bg-background/92 p-2 shadow-[0_20px_50px_rgba(18,16,12,0.14)] backdrop-blur-xl pointer-events-auto">
        <Button variant="hero" size="sm" className="rounded-full px-4" asChild>
          <Link to={bookingConsultationHref}>
            <CalendarDays className="h-4 w-4" />
            Book Call
          </Link>
        </Button>
        <Button variant="heroOutline" size="sm" className="rounded-full px-4" asChild>
          <a href={defaultWhatsAppHref} target="_blank" rel="noreferrer">
            <MessageCircleMore className="h-4 w-4" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
