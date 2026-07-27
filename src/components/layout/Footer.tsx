import { Link } from "wouter";
import { Mail, MessageCircle, ArrowUpRight } from "lucide-react";
import { SITE, FOOTER_LINKS } from "@/data/constants";
import { getWhatsAppUrl } from "@/lib/utils";
import NewsletterForm from "@/components/shared/NewsletterForm";

export default function Footer() {
  const year = new Date().getFullYear();
  const waUrl = getWhatsAppUrl(SITE.whatsapp, "Hi Sterova, I'd like to discuss a project.");

  function NavLink({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) {
    const isHash = href.includes("#");
    if (isHash) return <a href={href} className={className}>{children}</a>;
    return <Link href={href} className={className}>{children}</Link>;
  }

  return (
    <footer className="border-t bg-secondary/30">
      <div className="container-custom py-16">
        {/* Top */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="gradient-text font-display font-black text-2xl md:text-3xl tracking-tighter drop-shadow-md">
                {SITE.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-sm">
              {SITE.tagline} — Modern software development for startups,
              businesses, and enterprises.
            </p>

            <div className="space-y-2 mb-6">
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0" />
                {SITE.email}
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-green-600 transition-colors"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                WhatsApp: {SITE.whatsappDisplay}
              </a>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Stay in the loop</p>
              <NewsletterForm compact />
            </div>
          </div>

          {/* Links */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold mb-4">{group.heading}</h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <NavLink
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {year} {SITE.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              Contact <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
