import { toast as sonnerToast } from "sonner";

type ToastInput = {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
};

/**
 * Thin shadcn-compatible wrapper over sonner so admin screens can keep the
 * familiar `toast({ title, description, variant })` shape.
 */
export function useToast() {
  const toast = ({ title, description, variant }: ToastInput) => {
    const message = title ?? description ?? "";
    const options = title && description ? { description } : undefined;
    if (variant === "destructive") return sonnerToast.error(message, options);
    return sonnerToast.success(message, options);
  };

  return { toast };
}

export { sonnerToast as toast };
