import React from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { type LucideIcon } from 'lucide-react';
import ThemeToggle from '@/components/ui/theme-toggle';
import {
  CodeIcon,
  GlobeIcon,
  Palette,
  Users,
  Star,
  FileText,
  Shield,
  RotateCcw,
  Handshake,
  Leaf,
  HelpCircle,
  PenTool,
  Smartphone,
  Search,
  Building2,
  Briefcase,
} from 'lucide-react';

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
    href: '/services#web-development',
    description: 'Custom websites built with modern technologies',
    icon: CodeIcon,
  },
  {
    title: 'UI/UX Design',
    href: '/services#ui-ux-design',
    description: 'Beautiful interfaces that users love',
    icon: PenTool,
  },
  {
    title: 'Mobile-First Design',
    href: '/services#mobile-apps',
    description: 'Responsive experiences across all devices',
    icon: Smartphone,
  },
  {
    title: 'Brand Identity',
    href: '/services#branding',
    description: 'Cohesive visual identities for your brand',
    icon: Palette,
  },
  {
    title: 'SEO & Performance',
    href: '/services#growth-marketing',
    description: 'Optimize speed, reach, and conversions',
    icon: Search,
  },
];

const companyLinks: LinkItem[] = [
  {
    title: 'About Us',
    href: '/#how-it-works',
    description: 'Learn more about our story and team',
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
    description: "See how we've helped our clients succeed",
    icon: Star,
  },
  {
    title: 'Partnerships',
    href: '/#pricing',
    icon: Handshake,
    description: 'Collaborate with us for mutual growth',
  },
];

const companyLinks2: LinkItem[] = [
  { title: 'Terms of Service', href: '#', icon: FileText },
  { title: 'Privacy Policy', href: '#', icon: Shield },
  { title: 'Refund Policy', href: '#', icon: RotateCcw },
  { title: 'Blog', href: '/blog', icon: Leaf },
  { title: 'Help Center', href: '#faq', icon: HelpCircle },
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

  // Close mobile menu on route change
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
        'fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-border shadow-sm'
          : 'bg-transparent border-transparent',
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.svg" alt="Flinke" className="h-9 w-9" />
            <span className="font-display font-bold text-lg text-foreground tracking-tight">
              Flinke
            </span>
          </Link>
        </div>

        {/* Desktop Nav - Centered */}
        <div className="hidden md:flex flex-1 justify-center">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              {/* Services Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-muted-foreground hover:text-foreground hover:bg-accent/60 focus:bg-accent/60">
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
                        View all services →
                      </Link>
                    </p>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Company Mega Menu */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="h-9 bg-transparent px-3 text-muted-foreground hover:text-foreground hover:bg-accent/60 focus:bg-accent/60">
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
                      {companyLinks2.map((item) => (
                        item.href.startsWith('/') ? (
                          <Link
                            key={item.title}
                            to={item.href}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/60"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </Link>
                        ) : (
                          <a
                            key={item.title}
                            href={item.href}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/60"
                          >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing Link */}
              <NavigationMenuItem>
                <Link
                  to="/#pricing"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus:bg-accent/60 focus:text-foreground focus:outline-none"
                >
                  Pricing
                </Link>
              </NavigationMenuItem>

              {/* Portfolio Link */}
              <NavigationMenuItem>
                <Link
                  to="/#portfolio"
                  className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus:bg-accent/60 focus:text-foreground focus:outline-none"
                >
                  Portfolio
                </Link>
              </NavigationMenuItem>

              {/* Contact Link */}
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

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link to="/#portfolio">Our Work</Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-foreground"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
        >
          <MenuToggleIcon open={open} className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu open={open}>
        <div className="flex-1 overflow-y-auto p-6">
          <nav className="grid gap-1">
            {/* Services Section */}
            <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Services
            </p>
            <Link
              to="/services"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent/60 transition-colors bg-accent/30"
            >
              <GlobeIcon className="h-4 w-4" />
              All Services
            </Link>
            {serviceLinks.slice(1).map((link) => (
              <a
                key={link.title}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
              >
                <link.icon className="h-4 w-4" />
                {link.title}
              </a>
            ))}
            <p className="px-3 py-2 mt-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Company
            </p>
            {companyLinks.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.title}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </Link>
              ) : (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </a>
              )
            ))}
            {companyLinks2.map((link) => (
              link.href.startsWith('/') ? (
                <Link
                  key={link.title}
                  to={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </Link>
              ) : (
                <a
                  key={link.title}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.title}
                </a>
              )
            ))}
          </nav>
        </div>
        <div className="border-t border-border p-4 grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link to="/#portfolio" onClick={() => setOpen(false)}>
              Our Work
            </Link>
          </Button>
          <Button variant="hero" size="sm" asChild>
            <Link to="/contact" onClick={() => setOpen(false)}>
              Get a Quote
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
    <div className="fixed inset-0 z-50 mt-16 flex flex-col bg-background md:hidden animate-in fade-in slide-in-from-top-2 duration-200">
      {children}
    </div>,
    document.body,
  );
}

function ListItem({
  title,
  description,
  icon: Icon,
  href,
}: LinkItem) {
  // Check if it's a router link (starts with / but not //)
  const isRouterLink = href.startsWith('/') && !href.startsWith('//');
  const content = (
    <>
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-background">
        <Icon className="h-4 w-4 text-foreground" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground leading-snug mt-0.5">
            {description}
          </p>
        )}
      </div>
    </>
  );

  if (isRouterLink) {
    return (
      <Link
        to={href}
        className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent/60"
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent/60"
    >
      {content}
    </a>
  );
}

export default Navbar;
