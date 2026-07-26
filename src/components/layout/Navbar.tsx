"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SITE } from "@/data/constants";
import type { DbService } from "@/types";


interface Props {
  dbServices?: DbService[];
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-border/50 bg-secondary/50" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center",
        "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground",
        "transition-all duration-200"
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/** Animated moving-lines background for the Services dropdown trigger */
function ServicesButtonBg({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          key="svc-bg"
          className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          {/* Subtle animated diagonal stripes */}
          <motion.span
            className="absolute inset-0"
            style={{
              background:
                "repeating-linear-gradient(115deg, transparent, transparent 8px, rgba(139,92,246,0.07) 8px, rgba(139,92,246,0.07) 9px)",
            }}
            animate={{ backgroundPositionX: ["0px", "40px"] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          />
          <span className="absolute inset-0 bg-primary/8" />
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Navbar({ dbServices = [] }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  function openServices() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setServicesOpen(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
  }

  // Build nav links — inject Services between About and Products
  const leftLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];
  const rightLinks = [
    { label: "Products", href: "/#portfolio" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Process", href: "/process" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border/40 shadow-sm shadow-black/5"
          : "bg-transparent"
      )}
    >
      <nav className="container-custom" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display font-bold text-xl tracking-tight"
            aria-label="Sterova home"
          >
            <span className="gradient-text text-2xl font-extrabold">
              {SITE.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Services dropdown with animated hover */}
            <div className="relative">
              <button
                className={cn(
                  "relative flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors overflow-hidden",
                  servicesOpen
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onMouseEnter={openServices}
                onMouseLeave={scheduleClose}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                <ServicesButtonBg visible={servicesOpen} />
                <span className="relative z-10">Services</span>
                <ChevronDown
                  className={cn(
                    "relative z-10 h-3.5 w-3.5 transition-transform duration-200",
                    servicesOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-1.5 w-64 rounded-xl border border-border/60 bg-background/97 backdrop-blur-xl shadow-xl shadow-black/10 p-2 z-50 overflow-hidden"
                    onMouseEnter={openServices}
                    onMouseLeave={scheduleClose}
                  >
                    {/* Animated stripe accent on top */}
                    <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden rounded-t-xl">
                      <motion.div
                        className="h-full"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.8) 40%, rgba(167,139,250,1) 60%, transparent 100%)",
                        }}
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                      />
                    </div>

                    <Link
                      href="/services"
                      className="block px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 hover:text-primary transition-colors mb-1"
                    >
                      All Services →
                    </Link>

                    {dbServices.length > 0 ? (
                      dbServices.map((svc) => (
                        <Link
                          key={svc.id}
                          href={`/services#${svc.slug}`}
                          className="block px-3 py-2.5 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors group"
                        >
                          <span className="font-medium text-foreground/80 group-hover:text-foreground">
                            {svc.title}
                          </span>
                          <span className="block text-xs text-muted-foreground/60 mt-0.5 leading-snug line-clamp-1">
                            {svc.short_description}
                          </span>
                        </Link>
                      ))
                    ) : (
                      // Fallback static links
                      [
                        { label: "Custom Software", href: "/services#custom-software" },
                        { label: "Web Development", href: "/services#web-development" },
                        { label: "Mobile Apps", href: "/services#mobile-apps" },
                      ].map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Theme Toggle */}
          <div className="hidden lg:flex items-center gap-2">
            <ThemeToggle />
            <Button asChild size="sm" variant="gradient">
              <Link href="/contact">Start a Project</Link>
            </Button>
          </div>

          {/* Mobile: theme toggle + menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-border/40 bg-background/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {[...leftLinks, ...rightLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                    pathname === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {/* Services sub-links on mobile */}
              <div className="px-3 py-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">
                  Services
                </p>
                <div className="ml-2 flex flex-col gap-0.5">
                  {dbServices.length > 0
                    ? dbServices.map((svc) => (
                        <Link
                          key={svc.id}
                          href={`/services#${svc.slug}`}
                          className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                        >
                          {svc.title}
                        </Link>
                      ))
                    : [
                        { label: "Custom Software", href: "/services#custom-software" },
                        { label: "Web Development", href: "/services#web-development" },
                        { label: "Mobile Apps", href: "/services#mobile-apps" },
                      ].map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                </div>
              </div>
              <div className="pt-3 border-t border-border/40 mt-2">
                <Button asChild className="w-full" variant="gradient">
                  <Link href="/contact">Start a Project</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
