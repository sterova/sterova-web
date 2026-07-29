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
import { SITE, SOCIAL_LINKS, PROFESSIONAL_LINKS } from "@/data/constants";
import { getWhatsAppUrl } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

const SOCIAL_ICONS: Record<string, IconType> = {
  linkedin: FaLinkedin as IconType,
  github: FaGithub as IconType,
  x: FaXTwitter as IconType,
  instagram: FaInstagram as IconType,
  dribbble: FaDribbble as IconType,
  behance: FaBehance as IconType,
};

const waUrl = getWhatsAppUrl(SITE.whatsapp, "Hi Sterova, I'd like to discuss a project.");

const CONTACT_DETAILS = [
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, external: false },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.whatsappDisplay,
    href: waUrl,
    external: true,
  },
  ...(SITE.phone
    ? [
        {
          icon: Phone,
          label: "Phone",
          value: SITE.phone,
          href: `tel:${SITE.phone.replace(/\s/g, "")}`,
          external: false,
        },
      ]
    : []),
  ...(SITE.address
    ? [{ icon: MapPin, label: "Office", value: SITE.address, href: null, external: false }]
    : []),
];

interface Props {
  /** Hides the internal “explore” links when the surface already lists them. */
  showProfessionalLinks?: boolean;
}

/**
 * Shared right-hand rail for every contact surface: direct channels, social
 * profiles and professional destinations, so the experience stays consistent.
 */
export default function ContactLinksPanel({ showProfessionalLinks = true }: Props) {
  return (
    <div className="space-y-6">
      <div className="card-premium p-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          Direct channels
        </p>
        <ul className="mt-4 space-y-3">
          {CONTACT_DETAILS.map(({ icon: Icon, label, value, href, external }) => (
            <li key={label}>
              <div className="flex items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-3 transition-colors hover:border-primary/30">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="break-words text-sm font-medium transition-colors hover:text-primary"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium">{value}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
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
          {SOCIAL_LINKS.map((social) => {
            const Icon = SOCIAL_ICONS[social.key];
            return (
              <li key={social.key}>
                <a
                  href={social.href}
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
                    <span className="block truncate text-xs font-medium">{social.label}</span>
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {social.handle}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {showProfessionalLinks && (
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
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
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
