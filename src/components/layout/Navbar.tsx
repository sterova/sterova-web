import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE, NAV_LINKS } from "@/data/constants";

import ThemeToggle from "@/components/shared/ThemeToggle";

// Nav link that handles hash links natively
function NavLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const isHash = href.includes("#");
  if (isHash) {
    return (
      <a href={href} className={className} onClick={onClick}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

const LEFT_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];
const RIGHT_LINKS = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Process", href: "/process" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
const SERVICES_LINK = NAV_LINKS.find((l) => l.label === "Services");
const SERVICE_CHILDREN = (SERVICES_LINK as { children?: { label: string; href: string }[] })?.children ?? [];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location]);

  // Close services dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allFlatLinks = [
    ...LEFT_LINKS,
    { label: "Services", href: "/services" },
    ...RIGHT_LINKS,
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container-custom flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <span className="gradient-text font-display font-black text-xl md:text-2xl tracking-tighter drop-shadow-sm">
            {SITE.name}
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
          {LEFT_LINKS.map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                location === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {link.label}
            </NavLink>
          ))}

          {/* Services dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={cn(
                "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                location.startsWith("/services")
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
              aria-expanded={servicesOpen}
            >
              Services
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition-transform duration-200", servicesOpen && "rotate-180")}
              />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-56 rounded-xl border bg-background shadow-lg overflow-hidden"
                >
                  <div className="p-2">
                    <NavLink
                      href="/services"
                      onClick={() => setServicesOpen(false)}
                      className="block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent transition-colors"
                    >
                      All Services →
                    </NavLink>
                    <div className="my-1.5 border-t border-border/50" />
                    {SERVICE_CHILDREN.map((child) => (
                      <NavLink
                        key={child.href}
                        href={child.href}
                        onClick={() => setServicesOpen(false)}
                        className="block px-3 py-2 text-sm text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent transition-colors"
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {RIGHT_LINKS.filter((l) => l.label !== "Contact").map((link) => (
            <NavLink
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                location === link.href
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="gradient" size="sm" className="ml-1">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile */}
        <div className="flex lg:hidden items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 rounded-lg flex items-center justify-center border border-border/50 bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isOpen ? (
                <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="h-4 w-4" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="h-4 w-4" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="w-full py-2 flex flex-col max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain pb-8">
              {allFlatLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-6 py-3.5 text-base font-medium transition-colors border-l-2",
                    location === link.href
                      ? "text-primary bg-primary/10 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border-transparent"
                  )}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Services sub-links */}
              <div className="px-6 py-4 mt-2 bg-secondary/30">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                  Services
                </p>
                <div className="flex flex-col gap-1">
                  {SERVICE_CHILDREN.map((svc) => (
                    <NavLink
                      key={svc.href}
                      href={svc.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    >
                      {svc.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="px-6 pt-6 mt-2">
                <Button asChild variant="gradient" className="w-full h-12 text-base">
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Contact Us
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
