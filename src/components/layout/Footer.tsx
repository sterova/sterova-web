import ObfuscatedEmail from "@/components/shared/ObfuscatedEmail";
import BrandLogo from "@/components/shared/BrandLogo";
import { Link } from "@/lib/router-compat";
import { Mail, MessageCircle, ArrowUpRight, MapPin } from "lucide-react";
import { SITE, FOOTER_LINKS } from "@/data/constants";
import { useBrandLinks } from "@/hooks/use-brand-links";
import { getWhatsAppUrl } from "@/lib/utils";

export default function Footer() {
  const year = new Date().getFullYear();
  const { whatsappDisplay, whatsappHref, address } = useBrandLinks();

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

  return (
    <footer className="relative border-t border-border bg-surface">
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
        {/* Top */}
        <div className="mb-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-6 lg:gap-12">
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
                {SITE.tagline} — Modern software development for startups, businesses, and
                enterprises.
              </p>

              <div className="space-y-2.5">
                <ObfuscatedEmail className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground group-hover:border-primary/40 group-hover:text-primary transition-colors">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                </ObfuscatedEmail>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-brand-whatsapp transition-colors"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground group-hover:border-brand-whatsapp/40 group-hover:text-brand-whatsapp transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  WhatsApp: {whatsappDisplay}
                </a>
                {address && address !== "[ADDRESS_PLACEHOLDER]" && (
                  <p className="group flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surface text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                    </span>
                    {address}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold mb-4 text-foreground">{group.heading}</h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
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

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
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
