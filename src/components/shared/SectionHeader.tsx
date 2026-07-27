import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
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

const TITLE_SIZES = {
  page: "text-4xl sm:text-5xl lg:text-6xl leading-[1.1]",
  section: "text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.15]",
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0, margin: "0px 0px -10px 0px" }}
      transition={{ duration: 0.5 }}
      className={cn(centered ? "text-center" : "", className)}
    >
      {badge && (
        <Badge variant="sterova" className="mb-4">
          {badge}
        </Badge>
      )}
      <Heading
        className={cn(
          "font-display font-bold tracking-tight mb-5 text-balance",
          TITLE_SIZES[size]
        )}
      >
        {title}
      </Heading>
      {description && (
        <p
          className={cn(
            "text-muted-foreground text-lg sm:text-xl leading-relaxed text-pretty",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
