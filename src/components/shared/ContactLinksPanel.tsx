import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import {
  FaBehance,
  FaDribbble,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaXTwitter,
} from "react-icons/fa6";
import { Link } from "@/lib/router-compat";
import { useBrandLinks } from "@/hooks/use-brand-links";
import { PROFESSIONAL_LINKS } from "@/data/constants";
import type { ComponentType, SVGProps } from "react";
import type { BrandLinkRow } from "@/types/database";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const SOCIAL_ICONS: Record<string, IconType> = {
  linkedin: FaLinkedin as IconType,
  github: FaGithub as IconType,
  x: FaXTwitter as IconType,
  instagram: FaInstagram as IconType,
  dribbble: FaDribbble as IconType,
  behance: FaBehance as IconType,
};

const CONTACT_ICONS: Record<string, IconType> = {
  mail: Mail as unknown as IconType,
  "message-circle": MessageCircle as unknown as IconType,
  phone: Phone as unknown as IconType,
  "map-pin": MapPin as unknown as IconType,
};

function getContactIcon(link: BrandLinkRow): IconType {
  if (link.icon_key && CONTACT_ICONS[link.icon_key]) return CONTACT_ICONS[link.icon_key];
  if (link.key === "email") return Mail as unknown as IconType;
  if (link.key === "whatsapp") return MessageCircle as unknown as IconType;
  if (link.key === "phone") return Phone as unknown as IconType;
  if (link.key === "address") return MapPin as unknown as IconType;
  return Mail as unknown as IconType;
}

function isExternalContact(link: BrandLinkRow): boolean {
  return link.key === "whatsapp";
}

interface Props {
  /** Hides the internal "explore" links when the surface already lists them. */
  showProfessionalLinks?: boolean;
}

/**
 * Shared right-hand rail for every contact surface: direct channels, social
 * profiles and professional destinations, so the experience stays consistent.
 */
export default function ContactLinksPanel({ showProfessionalLinks = true }: Props) {
  const { contact, social } = useBrandLinks();

  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Direct channels
        </p>
        <ul className="mt-4 space-y-3">
          {contact.map((link) => {
            const Icon = getContactIcon(link);
            const external = isExternalContact(link);
            return (
              <li key={link.key}>
                <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-3 transition-colors hover:border-primary/30">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{link.label}</p>
                    {link.href ? (
                      <a
                        href={link.href}
                        target={external ? "_blank" : undefined}
                        rel={external ? "noopener noreferrer" : undefined}
                        className="break-words text-sm font-medium transition-colors hover:text-primary"
                      >
                        {link.value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium">{link.value}</p>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Every enquiry gets a reply within{" "}
            <span className="font-medium text-foreground">24 hours</span>, usually with first
            questions and a suggested next step.
          </p>
        </div>
      </div>

      <div className="card-premium p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Follow along
        </p>
        <ul className="mt-4 grid grid-cols-2 gap-2">
          {social.map((link) => {
            const Icon = SOCIAL_ICONS[link.icon_key ?? link.key];
            return (
              <li key={link.key}>
                <a
                  href={link.href ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2.5 rounded-xl border border-border/70 bg-background/60 px-3 py-2.5 transition-all hover:border-primary/40 hover:bg-primary/5"
                >
                  {Icon && (
                    <Icon
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                      aria-hidden="true"
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-medium">{link.label}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {link.value}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {showProfessionalLinks && PROFESSIONAL_LINKS.length > 0 && (
        <div className="card-premium p-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Explore Sterova
          </p>
          <ul className="mt-4 divide-y divide-border/70">
            {PROFESSIONAL_LINKS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="group flex items-center justify-between gap-3 py-3 transition-colors hover:text-primary"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{item.label}</span>
                    {item.description && (
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    )}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
