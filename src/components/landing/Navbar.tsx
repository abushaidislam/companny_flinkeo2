import React from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import {
  Building2,
  CodeIcon,
  FileText,
  GlobeIcon,
  Handshake,
  HelpCircle,
  Leaf,
  Palette,
  PenTool,
  RotateCcw,
  Search,
  Shield,
  Smartphone,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import ThemeToggle from '@/components/ui/theme-toggle';
import { primaryConsultationLabel } from '@/data/landing-content';
import { bookingConsultationHref } from '@/data/company-contact';

type LinkItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

const serviceLinks: LinkItem[] = [
  {
    title: 'All Services',
    href: '/services',
    description: 'View our complete service offerings',
    icon: GlobeIcon,
  },
  {
    title: 'Web Development',
    href: '/#services',
    description: 'Custom websites built for speed, clarity, and conversion',
    icon: CodeIcon,
  },
  {
    title: 'UI/UX Design',
    href: '/#services',
    description: 'Interface systems that make complex products feel simple',
    icon: PenTool,
  },
  {
    title: 'Mobile-First Design',
    href: '/#services',
    description: 'Responsive experiences built around mobile behavior first',
    icon: Smartphone,
  },
  {
    title: 'Brand Identity',
    href: '/#work',
    description: 'Positioning and visual identity applied to real launches',
    icon: Palette,
  },
  {
    title: 'SEO & Performance',
    href: '/#pricing',
    description: 'Scope work around speed, discoverability, and business goals',
    icon: Search,
  },
];

const companyLinks: LinkItem[] = [
  {
    title: 'Our Process',
    href: '/#process',
    description: 'See how we move from strategy to launch without guesswork',
    icon: Building2,
  },
  {
    title: 'Our Team',
    href: '/team',
    description: 'Meet our experts and designers',
    icon: Users,
  },
  {
    title: 'Client Stories',
    href: '/#testimonials',
    description: 'Proof from teams that trusted us with product and brand work',
    icon: Star,
  },
  {
    title: 'Case Studies',
    href: '/#work',
    description: 'Review selected projects and the outcomes behind them',
    icon: Handshake,
  },
];

const companyLinks2: LinkItem[] = [
  { title: 'Terms of Service', href: '#', icon: FileText },
  { title: 'Privacy Policy', href: '#', icon: Shield },
  { title: 'Refund Policy', href: '#', icon: RotateCcw },
  { title: 'Blog', href: '/blog', icon: Leaf },
  { title: 'Help Center', href: '/#faq', icon: HelpCircle },
];

function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false);

  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  React.useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  React.useEffect(() => {
    onScroll();
  }, [onScroll]);

  return scrolled;
}

const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);
  const location = window.location;

  React.useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-50 w-full border-b transition-all duration-300',
        scrolled
          ? 'border-border bg-background/80 shadow-sm backdrop-blur-xl'
          : 'border-transparent bg-transparent',
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Flinke" className="h-9 w-9" />
            <span className="font-display text-lg font-bold tracking-tight text-foreground">
              Flinke
            </span>
          </Link>
        </div>

        <div className="hidden flex-1 justify-center md:flex">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-muted-foreground hover:bg-accent/60 hover:text-foreground focus:bg-accent/60">
                  Services
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[540px] grid-cols-2 gap-1 p-3">
                    {serviceLinks.map((item) => (
                      <ListItem key={item.title} {...item} />
                    ))}
                  </div>
                  <div className="border-t border-border bg-muted/50 p-3">
                    <p className="text-sm text-muted-foreground">
                      Interested?{' '}
                      <Link
                        to="/services"
                        className="font-medium text-foreground underline underline-offset-4"
                      >
                        View all services
                      </Link>
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-muted-foreground hover:bg-accent/60 hover:text-foreground focus:bg-accent/60">
                  Company
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[480px] grid-cols-[1fr_auto] gap-1 p-3">
                    <div className="grid gap-1">
                      {companyLinks.map((item) => (
                        <ListItem key={item.title} {...item} />
                      ))}
                    </div>
                    <div className="flex flex-col gap-0.5 border-l border-border pl-3">
                      {companyLinks2.map((item) =>
                        item.href.startsWith('/') ? (
                          <Link
                            key={item.title}
                            to={item.href}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        ) : (
                          <a
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </a>
                        ),
                      )}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/#pricing"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus:bg-accent/60 focus:text-foreground focus:outline-none"
                >
                  Pricing
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/#work"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus:bg-accent/60 focus:text-foreground focus:outline-none"
                >
                  Work
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  to="/contact"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus:bg-accent/60 focus:text-foreground focus:outline-none"
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/#work">Our Work</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to={bookingConsultationHref}>{primaryConsultationLabel}</Link>
          </Button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="p-2 text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="h-6 w-6" />
        </button>
      </div>

      <MobileMenu open={open}>
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="grid gap-1">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Services
            </p>
            <Link
              to="/services"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg bg-accent/30 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/60"
            >
              <GlobeIcon className="h-4 w-4" />
              All Services
            </Link>
            {serviceLinks.slice(1).map((link) => (
              <a
                key={link.title}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </a>
            ))}

            <p className="mt-4 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Company
            </p>
            {companyLinks.map((link) => (
              <Link
                key={link.title}
                to={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </Link>
            ))}
            {companyLinks2.map((link) =>
              link.href.startsWith('/') ? (
                <Link
                  key={link.title}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </Link>
              ) : (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </a>
              ),
            )}
          </nav>
        </div>
        <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/#work" onClick={() => setOpen(false)}>
              Our Work
            </Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to={bookingConsultationHref} onClick={() => setOpen(false)}>
              {primaryConsultationLabel}
            </Link>
          </Button>
        </div>
      </MobileMenu>
    </header>
  );
};

type MobileMenuProps = React.ComponentProps<'div'> & {
  open: boolean;
};

function MobileMenu({ open, children }: MobileMenuProps) {
  if (!open || typeof window === 'undefined') return null;

  return createPortal(
    <div className="animate-in fade-in slide-in-from-top-2 fixed inset-0 z-50 mt-16 flex flex-col bg-background duration-200 md:hidden">
      {children}
    </div>,
    document.body,
  );
}

function ListItem({ title, description, icon: Icon, href }: LinkItem) {
  const content = (
    <>
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-background">
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <Link
      to={href}
      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent/60"
    >
      {content}
    </Link>
  );
}

export default Navbar;
