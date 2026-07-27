import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CONTACT } from "@/data/constants";
import { submitContactMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ContactFormData } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().optional(),
  message: z
    .string()
    .min(10, "Please enter at least 10 characters")
    .max(5000, "Message must be under 5000 characters"),
});

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      await submitContactMessage(data);
      setStatus("success");
      reset();
    } catch (err) {
      console.error("[v0] contact submit failed:", err);
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <CheckCircle2 className="h-14 w-14 text-green-500 mb-4" aria-hidden="true" />
        <h3 className="text-xl font-semibold mb-2">Message received!</h3>
        <p className="text-muted-foreground max-w-sm">
          We&apos;ll review your message and get back to you within 24 hours.
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
            className={cn(errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive" role="alert">{errors.name.message}</p>
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
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive" role="alert">{errors.email.message}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="space-y-1.5">
        <Label htmlFor="subject">{CONTACT.formFields.subject}</Label>
        <Input
          id="subject"
          autoComplete="off"
          {...register("subject")}
        />
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          {CONTACT.formFields.message}{" "}
          <span className="text-destructive" aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="message"
          rows={5}
          placeholder="How can we help you?"
          aria-invalid={!!errors.message}
          className={cn(errors.message && "border-destructive")}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive" role="alert">{errors.message.message}</p>
        )}
      </div>

      {status === "error" && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          Something went wrong. Please try again or email us directly.
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
        By submitting you agree to our{" "}
        <a href="/privacy" className="underline hover:text-foreground">Privacy Policy</a>.
        We&apos;ll respond within 24 hours.
      </p>
    </form>
  );
}
