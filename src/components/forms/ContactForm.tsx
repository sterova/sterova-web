import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CONTACT } from "@/data/constants";
import { submitContactMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  contactSchema,
  getCooldownRemainingMs,
  LAST_SUBMIT_KEY,
  MESSAGE_MAX,
  MIN_FILL_MS,
  type ContactSchemaValues,
} from "@/lib/contact-schema";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  /** Timestamp the form was mounted — used as a bot "filled too fast" check. */
  const mountedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<ContactSchemaValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  const messageValue = watch("message") ?? "";
  const isBusy = status === "loading" || isSubmitting;

  useEffect(() => {
    if (status === "error") setFocus("name");
  }, [status, setFocus]);

  const onSubmit = async (data: ContactSchemaValues) => {
    // Anti-spam gate 1: honeypot filled → silently pretend success.
    if (data.website) {
      setStatus("success");
      reset();
      return;
    }

    // Anti-spam gate 2: submitted implausibly fast.
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setErrorMessage("That was quick! Please take a moment to review your message and try again.");
      setStatus("error");
      return;
    }

    // Anti-spam gate 3: per-browser cooldown between submissions.
    const remaining = getCooldownRemainingMs();
    if (remaining > 0) {
      setErrorMessage(
        `You've just sent us a message. Please wait ${Math.ceil(remaining / 1000)}s before sending another.`,
      );
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    try {
      await submitContactMessage({
        name: data.name,
        email: data.email,
        subject: data.subject || undefined,
        message: data.message,
      });
      try {
        window.localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
      } catch {
        /* storage unavailable — cooldown simply doesn't persist */
      }
      setStatus("success");
      reset();
    } catch {
      setErrorMessage(
        "We couldn't send your message just now. Please try again, or email us directly.",
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        <CheckCircle2 className="h-14 w-14 text-success mb-4" aria-hidden="true" />
        <h3 className="text-xl font-semibold mb-2">Message received!</h3>
        <p className="text-muted-foreground max-w-sm">
          We&apos;ll review your message and get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-6"
          onClick={() => {
            mountedAt.current = Date.now();
            setStatus("idle");
          }}
        >
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isBusy} className="space-y-5">
      {/* Honeypot — hidden from humans, irresistible to bots. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div className="space-y-1.5">
          <Label htmlFor="name">
            {CONTACT.formFields.name}{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="name"
            autoComplete="name"
            maxLength={80}
            disabled={isBusy}
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
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            disabled={isBusy}
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

      {/* Subject */}
      <div className="space-y-1.5">
        <Label htmlFor="subject">{CONTACT.formFields.subject}</Label>
        <Input
          id="subject"
          autoComplete="off"
          maxLength={120}
          disabled={isBusy}
          aria-invalid={!!errors.subject}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={cn(errors.subject && "border-destructive")}
          {...register("subject")}
        />
        {errors.subject && (
          <p id="subject-error" className="text-xs text-destructive" role="alert">
            {errors.subject.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="space-y-1.5">
        <Label htmlFor="message">
          {CONTACT.formFields.message}{" "}
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        </Label>
        <Textarea
          id="message"
          rows={5}
          maxLength={MESSAGE_MAX}
          disabled={isBusy}
          placeholder="How can we help you?"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : "message-count"}
          className={cn(errors.message && "border-destructive")}
          {...register("message")}
        />
        <div className="flex items-start justify-between gap-3">
          {errors.message ? (
            <p id="message-error" className="text-xs text-destructive" role="alert">
              {errors.message.message}
            </p>
          ) : (
            <span className="text-xs text-muted-foreground">Minimum 20 characters.</span>
          )}
          <span id="message-count" className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {messageValue.length}/{MESSAGE_MAX}
          </span>
        </div>
      </div>

      {status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          {errorMessage ?? "Something went wrong. Please try again or email us directly."}
        </div>
      )}

      <Button type="submit" variant="gradient" size="lg" className="w-full" disabled={isBusy}>
        {isBusy ? (
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
        <a href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        . We&apos;ll respond within 24 hours.
      </p>
    </form>
  );
}
