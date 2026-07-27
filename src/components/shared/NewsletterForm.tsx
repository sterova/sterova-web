import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, sleep } from "@/lib/utils";
import type { NewsletterFormData } from "@/types";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface Props {
  compact?: boolean;
}

export default function NewsletterForm({ compact = false }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "success">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: NewsletterFormData) => {
    setState("loading");
    // Simulates subscribe — replace with Mailchimp/ConvertKit/Resend API call
    await sleep(800);
    setState("success");
    reset();
  };

  if (state === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
        <Check className="h-4 w-4 shrink-0" />
        <span>You&apos;re subscribed — thanks!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={cn("flex gap-2", compact ? "flex-row" : "flex-col sm:flex-row")}>
        <div className="flex-1">
          <Input
            type="email"
            placeholder="Your email address"
            aria-label="Email address for newsletter"
            aria-invalid={!!errors.email}
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          variant="gradient"
          size="sm"
          disabled={state === "loading"}
          className={cn(!compact && "sm:w-auto w-full")}
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Subscribe
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
