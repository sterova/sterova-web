import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
  /** Heading element to render. Use "h1" for page heroes. */
  as?: "h1" | "h2";
  /** "page" for page hero titles, "section" for in-page section titles. */
  size?: "page" | "section";
}

/* Typographic roles from the shared design system (src/styles.css). */
const TITLE_SIZES = {
  page: "heading-1",
  section: "heading-2",
};

export default function SectionHeader({
  badge,
  title,
  description,
  centered = false,
  className,
  as,
  size = "section",
}: SectionHeaderProps) {
  const Heading = as ?? (size === "page" ? "h1" : "h2");
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn(centered ? "text-center" : "", className)}
    >
      {badge && (
        <span className={cn("eyebrow mb-5", centered && "mx-auto")}>
          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          {badge}
        </span>
      )}
      <Heading className={cn("font-semibold text-balance", TITLE_SIZES[size])}>{title}</Heading>
      {description && (
        <p
          className={cn("body-lead mt-5 text-pretty", centered ? "mx-auto max-w-2xl" : "max-w-2xl")}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
