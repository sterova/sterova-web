import ObfuscatedEmail from "@/components/shared/ObfuscatedEmail";
import BrandLogo from "@/components/shared/BrandLogo";
import { Link } from "@/lib/router-compat";
import { Mail, ArrowUpRight, MapPin } from "lucide-react";
import {
  FaWhatsapp,
  FaLinkedin,
  FaGithub,
  FaXTwitter,
  FaInstagram,
  FaDribbble,
} from "react-icons/fa6";
import { SITE, FOOTER_LINKS } from "@/data/constants";
import { useBrandLinks } from "@/hooks/use-brand-links";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function Footer() {
  const year = new Date().getFullYear();
  const { whatsappDisplay, whatsappHref, address, social, contact, email } = useBrandLinks();
  const settings = useSiteSettings();

  const hasEmail = contact.some((c) => c.key === "email");
  const hasWhatsapp = contact.some((c) => c.key === "whatsapp");
  const hasAddress = contact.some((c) => c.key === "address");

  const filteredFooterLinks = FOOTER_LINKS.map(group => {
    return {
      ...group,
      links: group.links.filter(link => {
        if (link.label === "Careers" && settings.features.careers === false) return false;
        if (link.label === "Our Process" && settings.features.process === false) return false;
        if (link.label === "Blog" && settings.features.blog === false) return false;
        if (link.label === "FAQ" && settings.features.faq === false) return false;
        if (group.heading === "Services" && settings.features.services === false) return false;
        if (link.label === "Portfolio" && settings.features.portfolio === false) return false;
        if (link.label === "Case Studies" && settings.features.portfolio === false) return false;
        if (link.label === "Testimonials" && settings.features.reviews === false) return false;
        if (link.label === "Industries" && settings.features.industries === false) return false;
        if (link.label === "Technologies" && settings.features.technologies === false) return false;
        return true;
      })
    };
  }).filter(group => group.links.length > 0);

  function NavLink({
    href,
    className,
    children,
  }: {
    href: string;
    className?: string;
    children: React.ReactNode;
  }) {
    const isHash = href.includes("#");
    if (isHash)
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  const SOCIAL_ICONS: Record<string, React.ElementType> = {
    linkedin: FaLinkedin,
    github: FaGithub,
    x: FaXTwitter,
    instagram: FaInstagram,
    dribbble: FaDribbble,
  };

  return (
    <footer className="relative border-t border-glass-border glass backdrop-blur-xl">
      {/* Premium gradient top border */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-primary/5 to-transparent opacity-60"
        aria-hidden="true"
      />

      <div className="container-custom relative py-16 lg:py-24">
        {/* Top section: brand + links */}
        <div className="mb-14 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-[var(--shadow-card)]">
              <div
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-primary/30 via-transparent to-primary/30"
                aria-hidden="true"
              />
              <Link
                href="/"
                className="inline-flex items-center gap-2 mb-4 group"
                onClick={() => {
                  if (window.location.pathname === "/") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              >
                <BrandLogo
                  size={28}
                  alt=""
                  className="h-7 w-7 object-contain transition-opacity duration-300 group-hover:opacity-80"
                />
                <span className="gradient-text font-display font-black text-2xl md:text-3xl tracking-tighter drop-shadow-sm transition-opacity duration-300 group-hover:opacity-80">
                  {SITE.name}
                </span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
                Custom software engineering for startups and enterprises. Built to scale, owned by
                you.
              </p>

              <div className="space-y-2.5 mb-6">
                {hasEmail && (
                  <ObfuscatedEmail
                    email={email}
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors">
                      <Mail className="h-3.5 w-3.5" />
                    </span>
                  </ObfuscatedEmail>
                )}
                {hasWhatsapp && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-whatsapp transition-colors"
                  >
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground group-hover:border-brand-whatsapp/40 group-hover:text-brand-whatsapp transition-colors">
                      <FaWhatsapp className="h-3.5 w-3.5" />
                    </span>
                    WhatsApp: {whatsappDisplay}
                  </a>
                )}
                {hasAddress && address && address !== "[ADDRESS_PLACEHOLDER]" && (
                  <p className="group flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    {address}
                  </p>
                )}
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2 flex-wrap">
                {social
                  .filter((s) => s.href)
                  .map((s) => {
                    const Icon = SOCIAL_ICONS[s.key];
                    if (!Icon) return null;
                    return (
                      <a
                        key={s.key}
                        href={s.href || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </a>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Link columns */}
          {filteredFooterLinks.map((group) => (
            <div key={group.heading} className="col-span-1">
              <h3 className="text-sm font-semibold mb-4 text-foreground">{group.heading}</h3>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      href={link.href}
                      className="group inline-flex items-center gap-1 py-0.5 text-sm text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded-sm"
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                      </span>
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-y-0.5 translate-x-0.5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:pr-16 md:pr-24">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/cookie-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Cookies
            </Link>
            <Link
              href="/refund-policy"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Refund Policy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              Contact <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
