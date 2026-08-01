import { SITE } from "@/data/constants";

interface BrandLogoProps {
  /** Rendered size in CSS px — also used for width/height to prevent CLS. */
  size?: number;
  className?: string;
  /** Decorative marks inside a labelled link can drop the alt text. */
  alt?: string;
  /** Eager + high priority for the above-the-fold LCP mark. */
  priority?: boolean;
}

/**
 * Single source for the brand mark. Serves a 128px WebP with a PNG fallback so
 * the 512px master never ships to the browser, and always declares intrinsic
 * dimensions so the surrounding layout cannot shift.
 */
export default function BrandLogo({
  size = 32,
  className,
  alt = `${SITE.name} logo`,
  priority = false,
}: BrandLogoProps) {
  return (
    <picture>
      <source srcSet="/logo-128.webp" type="image/webp" />
      <img
        src="/logo-128.png"
        alt={alt}
        width={size}
        height={size}
        decoding={priority ? "sync" : "async"}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className={className}
      />
    </picture>
  );
}
