"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeader({
  badge,
  title,
  description,
  centered = false,
  className,
}: SectionHeaderProps) {
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
      <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-4 text-balance">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-muted-foreground text-lg leading-relaxed text-pretty",
            centered ? "mx-auto max-w-2xl" : "max-w-2xl"
          )}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}
