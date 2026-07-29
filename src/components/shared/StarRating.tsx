import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-6 w-6" } as const;

export default function StarRating({
  value,
  onChange,
  readonly = false,
  size = "md",
}: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  const cls = SIZES[size];

  if (readonly) {
    return (
      <div className="flex gap-1" role="img" aria-label={`${value} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            aria-hidden="true"
            className={cn(
              cls,
              star <= display ? "fill-brand-amber text-brand-amber" : "text-muted-foreground/25",
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onFocus={() => setHovered(star)}
          onBlur={() => setHovered(0)}
          onClick={() => onChange?.(star)}
          aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
          aria-pressed={value === star}
          className="rounded-md outline-none transition-transform duration-200 hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none"
        >
          <Star
            aria-hidden="true"
            className={cn(
              cls,
              star <= display ? "fill-brand-amber text-brand-amber" : "text-muted-foreground/25",
            )}
          />
        </button>
      ))}
    </div>
  );
}
