import type { ComponentType, SVGProps } from "react";
import { Globe, Link2, Mail, Phone } from "lucide-react";
import {
  FaBehance,
  FaDev,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaMedium,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export type SocialIcon = ComponentType<SVGProps<SVGSVGElement>>;

export interface SocialPlatform {
  /** Key used inside the team_members.links jsonb object. */
  key: string;
  label: string;
  icon: SocialIcon;
  kind: "url" | "email" | "tel";
  placeholder: string;
}

/**
 * Single source of truth for the optional links an administrator can attach to
 * a team member. Adding a platform here automatically exposes it in the CMS
 * form and renders its icon on the public site — no other file needs editing.
 */
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: FaLinkedin as SocialIcon,
    kind: "url",
    placeholder: "https://linkedin.com/in/…",
  },
  {
    key: "github",
    label: "GitHub",
    icon: FaGithub as SocialIcon,
    kind: "url",
    placeholder: "https://github.com/…",
  },
  {
    key: "x",
    label: "X (Twitter)",
    icon: FaXTwitter as SocialIcon,
    kind: "url",
    placeholder: "https://x.com/…",
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: FaInstagram as SocialIcon,
    kind: "url",
    placeholder: "https://instagram.com/…",
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: FaFacebook as SocialIcon,
    kind: "url",
    placeholder: "https://facebook.com/…",
  },
  {
    key: "behance",
    label: "Behance",
    icon: FaBehance as SocialIcon,
    kind: "url",
    placeholder: "https://behance.net/…",
  },
  {
    key: "dribbble",
    label: "Dribbble",
    icon: FaDribbble as SocialIcon,
    kind: "url",
    placeholder: "https://dribbble.com/…",
  },
  {
    key: "medium",
    label: "Medium",
    icon: FaMedium as SocialIcon,
    kind: "url",
    placeholder: "https://medium.com/@…",
  },
  {
    key: "devto",
    label: "Dev.to",
    icon: FaDev as SocialIcon,
    kind: "url",
    placeholder: "https://dev.to/…",
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: FaYoutube as SocialIcon,
    kind: "url",
    placeholder: "https://youtube.com/@…",
  },
  {
    key: "portfolio",
    label: "Portfolio",
    icon: Link2 as SocialIcon,
    kind: "url",
    placeholder: "https://…",
  },
  {
    key: "website",
    label: "Personal website",
    icon: Globe as SocialIcon,
    kind: "url",
    placeholder: "https://…",
  },
  {
    key: "email",
    label: "Email",
    icon: Mail as SocialIcon,
    kind: "email",
    placeholder: "name@sterova.com",
  },
  {
    key: "phone",
    label: "Phone",
    icon: Phone as SocialIcon,
    kind: "tel",
    placeholder: "+1 555 000 0000",
  },
];

export const CUSTOM_LINK_ICON: SocialIcon = Link2 as SocialIcon;

export interface ResolvedSocialLink {
  key: string;
  label: string;
  href: string;
  icon: SocialIcon;
  external: boolean;
}

function normaliseUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^(https?:|mailto:|tel:)/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

/** Only returns entries that actually have a value — never renders empty icons. */
export function resolveSocialLinks(
  links: Record<string, unknown> | null | undefined,
): ResolvedSocialLink[] {
  if (!links || typeof links !== "object") return [];
  const out: ResolvedSocialLink[] = [];

  for (const platform of SOCIAL_PLATFORMS) {
    const raw = links[platform.key];
    if (typeof raw !== "string" || !raw.trim()) continue;
    const value = raw.trim();
    const href =
      platform.kind === "email"
        ? `mailto:${value.replace(/^mailto:/i, "")}`
        : platform.kind === "tel"
          ? `tel:${value.replace(/\s+/g, "")}`
          : normaliseUrl(value);
    if (!href) continue;
    out.push({
      key: platform.key,
      label: platform.label,
      href,
      icon: platform.icon,
      external: platform.kind === "url",
    });
  }

  const custom = links.custom;
  if (Array.isArray(custom)) {
    custom.forEach((entry, index) => {
      if (!entry || typeof entry !== "object") return;
      const { label, url } = entry as { label?: unknown; url?: unknown };
      if (typeof url !== "string" || !url.trim()) return;
      out.push({
        key: `custom-${index}`,
        label: typeof label === "string" && label.trim() ? label.trim() : "Link",
        href: normaliseUrl(url),
        icon: CUSTOM_LINK_ICON,
        external: true,
      });
    });
  }

  return out;
}
