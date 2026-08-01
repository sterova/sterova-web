import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
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
  ...rest
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  const isHash = href.includes("#");
  if (isHash) {
    return (
      <a href={href} className={className} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </Link>
  );
}

// Shared focus ring so every interactive nav element is clearly visible when
// reached with the keyboard.
const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

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
const SERVICE_CHILDREN =
  (SERVICES_LINK as { children?: { label: string; href: string }[] })?.children ?? [];

export default function Navbar() {
  const [location] = useLocation();
  // `location` is the optimistic destination, so the active pill flips the
  // instant a link is clicked. `isNavigating` layers a "loading" cue on that
  // same link while its route is still resolving.
  const routerPending = useRouterState({ select: (s) => s.status === "pending" });
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  // During SSR the router always reports "pending", so the cue is client-only
  // to keep the server and client markup identical.
  const isNavigating = hydrated && routerPending;
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  // Only pull focus into the dropdown when it was opened from the keyboard.
  const openedViaKeyboardRef = useRef(false);

  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; opacity: number } | null>(null);

  useEffect(() => {
    const updateIndicator = () => {
      if (!navRef.current) return;
      const activeEl = navRef.current.querySelector<HTMLElement>('[data-active="true"]');
      if (activeEl) {
        const navRect = navRef.current.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        setIndicatorStyle({
          left: activeRect.left - navRect.left + activeRect.width / 2,
          opacity: 1,
        });
      } else {
        setIndicatorStyle(null);
      }
    };

    // Slight delay to ensure DOM is fully laid out and fonts are loaded
    const timeoutId = setTimeout(updateIndicator, 50);
    updateIndicator();

    window.addEventListener("resize", updateIndicator);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [location, hydrated, isScrolled]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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

  // Escape closes whichever overlay is open and returns focus to its trigger.
  useEffect(() => {
    if (!servicesOpen && !isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (servicesOpen) {
        setServicesOpen(false);
        servicesTriggerRef.current?.focus();
      } else if (isOpen) {
        setIsOpen(false);
        mobileToggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [servicesOpen, isOpen]);

  // Close the dropdown when focus leaves it entirely (tabbing past the menu).
  const handleServicesBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setServicesOpen(false);
    }
  }, []);

  const focusMenuItem = useCallback((index: number) => {
    const items = servicesMenuRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]");
    if (!items || items.length === 0) return;
    const i = (index + items.length) % items.length;
    items[i]?.focus();
  }, []);

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      servicesMenuRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? [],
    );
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusMenuItem(current + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusMenuItem(current - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      focusMenuItem(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusMenuItem(items.length - 1);
    } else if (e.key === "Tab") {
      setServicesOpen(false);
    }
  };

  // Move focus into the dropdown once it opens via keyboard interaction.
  useEffect(() => {
    if (!servicesOpen) return;
    if (!openedViaKeyboardRef.current) return;
    openedViaKeyboardRef.current = false;
    const id = window.setTimeout(() => focusMenuItem(0), 20);
    return () => window.clearTimeout(id);
  }, [servicesOpen, focusMenuItem]);

  // Simple focus trap for the mobile menu.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusables = mobileMenuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (!e.shiftKey && active === last) {
        e.preventDefault();
        mobileToggleRef.current?.focus();
      } else if (e.shiftKey && (active === first || active === mobileToggleRef.current)) {
        e.preventDefault();
        last.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  const allFlatLinks = [...LEFT_LINKS, { label: "Services", href: "/services" }, ...RIGHT_LINKS];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "relative w-full border-b transition-[background,border,box-shadow,height] duration-300",
          isScrolled
            ? "border-border/60 bg-background/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/65 shadow-[0_1px_0_0_color-mix(in_oklab,var(--border)_50%,transparent),0_12px_40px_-20px_rgb(0_0_0/0.3)]"
            : "border-border/40 bg-background/60 backdrop-blur-md supports-[backdrop-filter]:bg-background/50",
        )}
      >
        {/* Premium top glow */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-primary/8 to-transparent transition-opacity duration-300",
            isScrolled ? "opacity-100" : "opacity-60",
          )}
          aria-hidden="true"
        />
        {/* Premium bottom accent line */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-opacity duration-300",
            isScrolled ? "opacity-100" : "opacity-60",
          )}
          aria-hidden="true"
        />
        <div
          className={cn(
            "container-custom mx-auto relative flex items-center justify-between transition-[height] duration-300",
            isScrolled ? "h-[3.75rem]" : "h-[4.5rem]",
          )}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => {
              if (location === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className={cn("group flex items-center gap-2 rounded-lg", FOCUS_RING)}
            aria-label={`${SITE.name} — home`}
            aria-current={location === "/" ? "page" : undefined}
          >
            <img src="/logo.png" alt={`${SITE.name} logo`} className="h-7 w-auto object-contain transition-opacity duration-300 group-hover:opacity-80" />
            <span className="gradient-text font-display font-black text-[1.35rem] md:text-[1.5rem] tracking-tighter transition-opacity duration-300 group-hover:opacity-80">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-8 relative"
            aria-label="Main navigation"
          >
            {LEFT_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                aria-current={location === link.href ? "page" : undefined}
                aria-busy={location === link.href && isNavigating ? true : undefined}
                data-active={location === link.href}
                className={cn(
                  "relative py-2 text-[0.875rem] font-medium tracking-tight transition-colors duration-200 motion-reduce:transition-none outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm",
                  location === link.href
                    ? "text-primary font-semibold [&[aria-busy=true]]:opacity-70"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Services dropdown */}
            <div className="relative" ref={servicesRef} onBlur={handleServicesBlur}>
              <button
                ref={servicesTriggerRef}
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openedViaKeyboardRef.current = true;
                    setServicesOpen(true);
                  }
                }}
                className={cn(
                  "relative flex items-center gap-1 py-2 text-[0.875rem] font-medium tracking-tight transition-colors duration-200 motion-reduce:transition-none outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm",
                  location.startsWith("/services")
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
                aria-current={location.startsWith("/services") ? "page" : undefined}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                aria-controls="services-menu"
                data-active={location.startsWith("/services")}
              >
                Services
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    servicesOpen && "rotate-180",
                  )}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    id="services-menu"
                    ref={servicesMenuRef}
                    role="menu"
                    aria-label="Services"
                    onKeyDown={onMenuKeyDown}
                    className="absolute left-1/2 top-full mt-3 w-64 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover shadow-[var(--shadow-card-hover)]"
                  >
                    <div className="p-2">
                      <NavLink
                        href="/services"
                        onClick={() => setServicesOpen(false)}
                        role="menuitem"
                        data-menu-item=""
                        className={cn(
                          "block px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent transition-colors",
                          FOCUS_RING,
                        )}
                      >
                        All Services →
                      </NavLink>
                      <div className="my-1.5 border-t border-border/50" />
                      {SERVICE_CHILDREN.map((child) => (
                        <NavLink
                          key={child.href}
                          href={child.href}
                          onClick={() => setServicesOpen(false)}
                          role="menuitem"
                          data-menu-item=""
                          className={cn(
                            "block px-3 py-2 text-sm text-muted-foreground rounded-lg hover:text-foreground hover:bg-accent transition-colors",
                            FOCUS_RING,
                          )}
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
                aria-current={location === link.href ? "page" : undefined}
                aria-busy={location === link.href && isNavigating ? true : undefined}
                data-active={location === link.href}
                className={cn(
                  "relative py-2 text-[0.875rem] font-medium tracking-tight transition-colors duration-200 motion-reduce:transition-none outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm",
                  location === link.href
                    ? "text-primary font-semibold [&[aria-busy=true]]:opacity-70"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Sliding Indicator */}
            {indicatorStyle && (
              <motion.span
                className="absolute bottom-0 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary pointer-events-none"
                initial={{ left: indicatorStyle.left, opacity: 0 }}
                animate={{
                  left: indicatorStyle.left,
                  opacity: 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="gradient"
              size="default"
              className={cn(
                "ml-1 group rounded-full px-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] focus-visible:-translate-y-0.5 motion-reduce:transition-none",
                FOCUS_RING,
              )}
            >
              <Link href="/contact">
                Get in touch
                <ArrowRight className="ml-0.5 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />
            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border border-border/70 bg-surface/70 text-muted-foreground backdrop-blur-xl transition-all duration-200 hover:border-primary/40 hover:bg-card hover:text-foreground motion-reduce:transition-none",
                FOCUS_RING,
              )}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.span
                    key="x"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X className="h-4 w-4" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu className="h-4 w-4" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            id="mobile-menu"
            ref={mobileMenuRef}
            initial={{ height: 0, opacity: 0, y: -4 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -4 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="w-full border-b border-border/60 bg-background/95 backdrop-blur-xl overflow-hidden shadow-[var(--shadow-card-hover)] lg:hidden"
          >
            <div className="w-full py-2 flex flex-col max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain pb-8">
              {allFlatLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  aria-current={location === link.href ? "page" : undefined}
                  className={cn(
                    "block px-6 py-3.5 text-base font-medium transition-colors border-l-2 -outline-offset-2",
                    FOCUS_RING,
                    location === link.href
                      ? "text-primary bg-primary/10 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 border-transparent",
                  )}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Services sub-links */}
              <div className="px-6 py-4 mt-2 bg-surface">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                  Services
                </p>
                <div className="flex flex-col gap-1">
                  {SERVICE_CHILDREN.map((svc) => (
                    <NavLink
                      key={svc.href}
                      href={svc.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block min-h-11 px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors",
                        FOCUS_RING,
                      )}
                    >
                      {svc.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="px-6 pt-6 mt-2">
                <Button
                  asChild
                  variant="gradient"
                  className={cn("w-full h-12 text-base", FOCUS_RING)}
                >
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
