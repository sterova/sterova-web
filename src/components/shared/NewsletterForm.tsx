"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { NewsletterFormData } from "@/types";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

interface NewsletterFormProps {
  compact?: boolean;
}

export default function NewsletterForm({ compact = false }: NewsletterFormProps) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      setState("success");
      reset();
    } catch {
      setState("error");
    }
  };

  if (state === "success") {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <Check className="h-4 w-4" />
        <span>You&apos;re subscribed — thanks!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className={cn("flex gap-2", compact ? "flex-row" : "flex-col")}>
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
          {state === "error" && (
            <p className="mt-1 text-xs text-destructive" role="alert">
              Something went wrong. Please try again.
            </p>
          )}
        </div>
        <Button
          type="submit"
          variant="gradient"
          size="sm"
          disabled={state === "loading"}
          className={cn(!compact && "w-full")}
        >
          {state === "loading" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </div>
    </form>
  );
}
