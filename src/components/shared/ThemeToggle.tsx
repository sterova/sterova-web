import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function ThemeToggle({
  className,
  variant = "icon",
}: {
  className?: string;
  variant?: "icon" | "full";
}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return variant === "icon" ? (
      <div
        className={cn(
          "w-9 h-9 rounded-lg border border-border/50 bg-secondary/50",
          className
        )}
      />
    ) : (
      <div className={cn("h-9 rounded-md bg-secondary/50", className)} />
    );
  }

  const isDark = theme === "dark";

  if (variant === "full") {
    return (
      <button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        className={cn(
          "flex items-center gap-2.5 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
          "text-muted-foreground hover:bg-secondary hover:text-foreground",
          className
        )}
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        {isDark ? "Light mode" : "Dark mode"}
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "w-9 h-9 rounded-lg border border-border/50 flex items-center justify-center",
        "bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground",
        "transition-all duration-200",
        className
      )}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.span
            key="sun"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
