import BrandLogo from "@/components/shared/BrandLogo";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useLocation } from "@/lib/router-compat";
import { useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Globe,
  Smartphone,
  Palette,
  Plug,
  Code2,
  Layers,
  FolderOpen,
  FileText,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE, NAV_LINKS } from "@/data/constants";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useSiteSettings } from "@/hooks/use-site-settings";

// Icon map for nav children
const ICON_MAP: Record<string, React.ElementType> = {
  Globe,
  Smartphone,
  Palette,
  Plug,
  Code2,
  Layers,
  FolderOpen,
  FileText,
  Star,
};

type NavChild = { label: string; href: string; description?: string; icon_name?: string };
type NavItem = { label: string; href: string; children?: NavChild[] };

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

const FOCUS_RING =
  "outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

// Determines how many columns the dropdown grid uses
function getDropdownCols(count: number) {
  if (count <= 2) return "grid-cols-1";
  if (count <= 4) return "grid-cols-2";
  return "grid-cols-2";
}

function DropdownMenu({
  items,
  viewAllHref,
  viewAllLabel,
  menuRef,
  onClose,
}: {
  items: NavChild[];
  viewAllHref: string;
  viewAllLabel: string;
  menuRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}) {
  const cols = getDropdownCols(items.length);
  return (
    <div
      ref={menuRef}
      role="menu"
      aria-label={viewAllLabel}
      className={cn(
        "absolute left-1/2 top-full mt-3 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-popover shadow-[var(--shadow-card-hover)]",
        items.length <= 2 ? "w-56" : items.length <= 4 ? "w-[26rem]" : "w-[34rem]",
      )}
    >
      <div className="p-2">
        {/* View all link */}
        <NavLink
          href={viewAllHref}
          onClick={onClose}
          role="menuitem"
          data-menu-item=""
          className={cn(
            "flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg hover:bg-accent transition-colors mb-1",
            FOCUS_RING,
          )}
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="h-3.5 w-3.5 text-primary" />
        </NavLink>
        <div className="border-t border-border/50 mb-1.5" />
        {/* Children grid */}
        <div className={cn("grid gap-0.5", cols)}>
          {items.map((child) => {
            const Icon = child.icon_name ? ICON_MAP[child.icon_name] : null;
            return (
              <NavLink
                key={child.href}
                href={child.href}
                onClick={onClose}
                role="menuitem"
                data-menu-item=""
                className={cn(
                  "flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors group",
                  FOCUS_RING,
                )}
              >
                {Icon && (
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                )}
                <span className="min-w-0">
                  <span className="block text-sm font-medium text-foreground leading-tight">
                    {child.label}
                  </span>
                  {child.description && (
                    <span className="block text-xs text-muted-foreground mt-0.5 leading-snug">
                      {child.description}
                    </span>
                  )}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DropdownItem({
  item,
  location,
  isNavigating,
}: {
  item: NavItem;
  location: string;
  isNavigating: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const openedViaKeyboardRef = useRef(false);

  const isActive =
    location === item.href ||
    (item.href !== "/" && location.startsWith(item.href)) ||
    item.children?.some((c) => location === c.href || location.startsWith(c.href.split("#")[0]));

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Escape closes dropdown
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Focus first item when opened via keyboard
  useEffect(() => {
    if (!isOpen || !openedViaKeyboardRef.current) return;
    openedViaKeyboardRef.current = false;
    const id = window.setTimeout(() => {
      const first = menuRef.current?.querySelector<HTMLElement>("[data-menu-item]");
      first?.focus();
    }, 20);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  // Close when focus leaves container
  const handleBlur = useCallback((e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
      setIsOpen(false);
    }
  }, []);

  // Arrow key navigation
  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>("[data-menu-item]") ?? [],
    );
    const current = items.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      items[(current + 1 + items.length) % items.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      items[(current - 1 + items.length) % items.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      items[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      items[items.length - 1]?.focus();
    } else if (e.key === "Tab") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={containerRef} onBlur={handleBlur} onKeyDown={onMenuKeyDown}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openedViaKeyboardRef.current = true;
            setIsOpen(true);
          }
        }}
        className={cn(
          "relative flex items-center gap-1 px-3 py-2 text-[0.875rem] font-medium tracking-tight transition-colors duration-200 motion-reduce:transition-none outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md hover:bg-accent/50 hover:text-foreground",
          isActive ? "text-primary font-semibold" : "text-muted-foreground",
          isActive && isNavigating && "opacity-70",
        )}
        aria-current={isActive ? "page" : undefined}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        data-active={isActive}
      >
        {item.label}
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
          >
            <DropdownMenu
              items={item.children ?? []}
              viewAllHref={item.href}
              viewAllLabel={`All ${item.label} →`}
              menuRef={menuRef}
              onClose={() => setIsOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [location] = useLocation();
  const settings = useSiteSettings();
  const routerPending = useRouterState({ select: (s) => s.status === "pending" });
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const isNavigating = hydrated && routerPending;
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const [indicatorStyle, setIndicatorStyle] = useState<{ left: number; opacity: number } | null>(
    null,
  );

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

  useEffect(() => {
    setIsOpen(false);
    setExpandedMobile(null);
  }, [location]);

  // Mobile menu focus trap
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        mobileToggleRef.current?.focus();
        return;
      }
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

  // Filter links based on feature toggles
  const filteredNavLinks = NAV_LINKS.filter((link) => {
    if (link.label === "Services" && settings.features.services === false) return false;
    if (link.label === "Work" && settings.features.portfolio === false) return false;
    if (link.label === "Blog" && settings.features.blog === false) return false;
    if (link.label === "Process" && settings.features.process === false) return false;
    return true;
  }).map((link) => {
    if (link.children) {
      return {
        ...link,
        children: link.children.filter((child) => {
          if (child.label === "Testimonials" && settings.features.reviews === false) return false;
          return true;
        }),
      };
    }
    return link;
  });

  // Flat links for mobile (non-dropdown items)
  const flatNavItems = filteredNavLinks.filter((l) => !l.children);
  const dropdownNavItems = filteredNavLinks.filter((l) => l.children);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "relative w-full border-b transition-[background,border,box-shadow,height] duration-300",
          isScrolled
            ? "glass rounded-none border-b-glass-border shadow-[0_12px_40px_-20px_var(--shadow-brand)]"
            : "border-transparent bg-transparent",
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
            "w-full px-4 md:px-8 lg:px-12 relative flex items-center justify-between transition-[height] duration-300",
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
            <BrandLogo
              size={28}
              priority
              alt=""
              className="h-7 w-7 object-contain transition-opacity duration-300 group-hover:opacity-80"
            />
            <span className="gradient-text font-display font-black text-[1.35rem] md:text-[1.5rem] tracking-tighter transition-opacity duration-300 group-hover:opacity-80">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            ref={navRef}
            className="hidden xl:flex items-center gap-0.5 relative"
            aria-label="Main navigation"
          >
            {filteredNavLinks.map((item) => {
              if (item.children) {
                return (
                  <DropdownItem
                    key={item.href}
                    item={item as NavItem}
                    location={location}
                    isNavigating={isNavigating}
                  />
                );
              }
              const isActive = location === item.href;
              return (
                <NavLink
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  aria-busy={isActive && isNavigating ? true : undefined}
                  data-active={isActive}
                  className={cn(
                    "relative px-3 py-2 text-[0.875rem] font-medium tracking-tight transition-colors duration-200 motion-reduce:transition-none outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-md hover:bg-accent/50 hover:text-foreground",
                    isActive
                      ? "text-primary font-semibold [&[aria-busy=true]]:opacity-70"
                      : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </NavLink>
              );
            })}

            {/* Sliding indicator */}
            {indicatorStyle && (
              <motion.span
                className="absolute bottom-0 h-[2px] w-5 -translate-x-1/2 rounded-full bg-primary pointer-events-none"
                initial={{ left: indicatorStyle.left, opacity: 0 }}
                animate={{ left: indicatorStyle.left, opacity: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </nav>

          {/* Right actions */}
          <div className="hidden xl:flex items-center gap-2">
            <ThemeToggle />
            <Button
              asChild
              variant="gradient"
              size="default"
              className={cn(
                "ml-1 group rounded-full px-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)] focus-visible:-translate-y-0.5 motion-reduce:transition-none",
                FOCUS_RING,
              )}
            >
              <Link href="/contact">
                Get a Quote
                <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          {/* Mobile toggle */}
          <div className="flex xl:hidden items-center gap-2">
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
            className="w-full border-b glass rounded-none shadow-[var(--shadow-card-hover)] xl:hidden"
          >
            <div className="w-full py-2 flex flex-col max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain pb-8">
              {/* Flat links */}
              {flatNavItems.map((link) => (
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

              {/* Dropdown sections */}
              {dropdownNavItems.map((item) => (
                <div key={item.href} className="border-t border-border/30 mt-1 pt-1">
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between px-6 py-3.5 text-base font-medium text-muted-foreground hover:text-foreground transition-colors",
                      FOCUS_RING,
                    )}
                    onClick={() =>
                      setExpandedMobile(expandedMobile === item.label ? null : item.label)
                    }
                    aria-expanded={expandedMobile === item.label}
                  >
                    <span
                      className={cn(
                        item.children?.some(
                          (c) => location === c.href || location.startsWith(c.href.split("#")[0]),
                        ) && "text-primary font-semibold",
                      )}
                    >
                      {item.label}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedMobile === item.label && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {expandedMobile === item.label && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-3 bg-surface/40">
                          <NavLink
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block px-3 py-2 mb-1 text-sm font-semibold text-primary rounded-lg hover:bg-accent transition-colors",
                              FOCUS_RING,
                            )}
                          >
                            All {item.label} →
                          </NavLink>
                          <div className="flex flex-col gap-0.5">
                            {item.children?.map((child) => {
                              const Icon = child.icon_name ? ICON_MAP[child.icon_name] : null;
                              return (
                                <NavLink
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setIsOpen(false)}
                                  className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-accent transition-colors",
                                    FOCUS_RING,
                                    location === child.href
                                      ? "text-primary font-medium"
                                      : "text-muted-foreground",
                                  )}
                                >
                                  {Icon && (
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-background text-muted-foreground">
                                      <Icon className="h-3 w-3" />
                                    </span>
                                  )}
                                  {child.label}
                                </NavLink>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="px-6 pt-5 mt-2 flex flex-col gap-3">
                <Button
                  asChild
                  variant="gradient"
                  className={cn("w-full h-12 text-base", FOCUS_RING)}
                >
                  <Link href="/contact" onClick={() => setIsOpen(false)}>
                    Get a Quote
                    <ArrowRight className="ml-1.5 h-4 w-4" />
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
