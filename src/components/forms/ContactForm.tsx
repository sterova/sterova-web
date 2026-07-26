"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CONTACT } from "@/data/constants";
import { cn } from "@/lib/utils";
import type { ContactFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z
    .string()
    .min(20, "Please describe your project in at least 20 characters")
    .max(5000, "Message must be under 5000 characters"),
});

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      reset();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" aria-hidden="true" />
        <h3 className="text-xl font-semibold mb-2">Message received!</h3>
        <p className="text-muted-foreground max-w-sm">
          We&apos;ll review your project details and get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">
            {CONTACT.formFields.name}{" "}
            <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name && (
            <p id="name-error" className="text-xs text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">
            {CONTACT.formFields.email}{" "}
            <span className="text-destructive" aria-hidden="true">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && (
            <p id="email-error" className="text-xs text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Company */}
      <div className="space-y-1.5">
        <Label htmlFor="company">{CONTACT.formFields.company}</Label>
        <Input
          id="company"
          autoComplete="organization"
          {...register("company")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Service */}
        <div className="space-y-1.5">
          <Label htmlFor="service">{CONTACT.formFields.service}</Label>
          <select
            id="service"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue=""
            {...register("service")}
          >
            <option value="">Select a service</option>
            {CONTACT.serviceOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Budget */}
        <div className="space-y-1.5">
          <Label htmlFor="budget">{CONTACT.formFields.budget}</Label>
          <select
            id="budget"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            defaultValue=""
            {...register("budget")}
          >
            <option value="">Select a range</option>
            {CONTACT.budgetOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          {CONTACT.formFields.message}{" "}
          <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="message"
          rows={6}
          placeholder="Tell us about your project — what you're building, your timeline, and any technical details that are relevant."
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(errors.message && "border-destructive")}
          {...register("message")}
        />
        {errors.message && (
          <p id="message-error" className="text-xs text-destructive" role="alert">
            {errors.message.message}
          </p>
        )}
      </div>

      {/* Server error */}
      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        variant="gradient"
        size="lg"
        className="w-full"
        disabled={status === "loading"}
      >
        {status === "loading" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          "Send Message"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By submitting this form you agree to our{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
