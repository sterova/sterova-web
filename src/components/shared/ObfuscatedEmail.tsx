import { useEffect, useState, type ReactNode } from "react";
import { SITE } from "@/data/constants";

interface ObfuscatedEmailProps {
  className?: string;
  /** Optional subject appended to the mailto: link. */
  subject?: string;
  /** Optional leading content (icon, etc.) rendered before the address. */
  children?: ReactNode;
  /** Optional email address, falls back to SITE.email if not provided. */
  email?: string;
}

/**
 * Renders the contact address without ever putting a scrapable `foo@bar`
 * string in the server HTML. The real address and `mailto:` href are assembled
 * in the browser after hydration, so harvesters that never run JS see only a
 * masked placeholder while people and JS-rendering crawlers get a live link.
 */
export default function ObfuscatedEmail({ className, subject, children, email }: ObfuscatedEmailProps) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => setRevealed(true), []);

  const targetEmail = email || SITE.email;
  const [localPart, domainPart] = targetEmail.split("@");

  const address = `${localPart}@${domainPart}`;
  const label = (
    <>
      {children}
      {revealed ? address : `${localPart} [at] ${domainPart}`}
    </>
  );

  if (!revealed) {
    return <span className={className}>{label}</span>;
  }

  const href = subject
    ? `mailto:${address}?subject=${encodeURIComponent(subject)}`
    : `mailto:${address}`;

  return (
    <a href={href} className={className}>
      {label}
    </a>
  );
}
