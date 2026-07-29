import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitServiceInquiry } from "@/lib/api";
import { cn } from "@/lib/utils";
import { SERVICES } from "@/data/constants";
import {
  getCooldownRemainingMs,
  LAST_SUBMIT_KEY,
  MESSAGE_MAX,
  MIN_FILL_MS,
  serviceInquirySchema,
  type ServiceInquiryValues,
} from "@/lib/contact-schema";
type Status = "idle" | "loading" | "success" | "error";

const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

interface Props {
  /** Slug of the service the visitor arrived from — preselects the dropdown. */
  initialService?: string;
}

export default function ServiceInquiryForm({ initialService = "" }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mountedAt = useRef(Date.now());

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ServiceInquiryValues>({
    resolver: zodResolver(serviceInquirySchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      company: "",
      phone: "",
      service: initialService,
      message: "",
      website: "",
    },
  });

  // Keep the dropdown in sync when the visitor switches service via the URL.
  useEffect(() => {
    setValue("service", initialService);
  }, [initialService, setValue]);

  const messageValue = watch("message") ?? "";
  const isBusy = status === "loading" || isSubmitting;

  const onSubmit = async (data: ServiceInquiryValues) => {
    if (data.website) {
      setStatus("success");
      reset();
      return;
    }
    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      setErrorMessage("That was quick! Please review your brief and try again.");
      setStatus("error");
      return;
    }
    const remaining = getCooldownRemainingMs();
    if (remaining > 0) {
      setErrorMessage(
        `You've just sent us a brief. Please wait ${Math.ceil(remaining / 1000)}s before sending another.`,
      );
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    try {
      const service = SERVICES.find((s) => s.slug === data.service);
      await submitServiceInquiry({
        name: data.name,
        email: data.email,
        company: data.company,
        phone: data.phone,
        serviceSlug: service?.slug,
        serviceTitle: service?.title,
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
        "We couldn't send your brief just now. Please try again, or email us directly.",
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <CheckCircle2 className="mb-4 h-14 w-14 text-success" aria-hidden="true" />
        <h2 className="mb-2 text-xl font-semibold">Brief received!</h2>
        <p className="max-w-sm text-muted-foreground">
          Thanks — an engineer will review your project and reply within 24 hours.
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
          Send another brief
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate aria-busy={isBusy} className="space-y-5">
      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
      >
        <label htmlFor="si-website">Website</label>
        <input
          id="si-website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("website")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="si-name">
            Full name{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="si-name"
            autoComplete="name"
            maxLength={80}
            disabled={isBusy}
            aria-invalid={!!errors.name}
            className={cn(errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs text-destructive" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="si-email">
            Work email{" "}
            <span className="text-destructive" aria-hidden="true">
              *
            </span>
          </Label>
          <Input
            id="si-email"
            type="email"
            autoComplete="email"
            maxLength={254}
            disabled={isBusy}
            aria-invalid={!!errors.email}
            className={cn(errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="si-company">Company (optional)</Label>
          <Input id="si-company" maxLength={120} disabled={isBusy} {...register("company")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="si-phone">Phone / WhatsApp (optional)</Label>
          <Input id="si-phone" type="tel" maxLength={32} disabled={isBusy} {...register("phone")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="si-service">Service (optional)</Label>
        <select id="si-service" className={selectClass} disabled={isBusy} {...register("service")}>
          <option value="">Not sure yet — help me choose</option>
          {SERVICES.filter((s) => s.is_active).map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">
          Preselected from the service you came from — change it any time.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="si-message">
          Project details{" "}
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        </Label>
        <Textarea
          id="si-message"
          rows={6}
          maxLength={MESSAGE_MAX}
          disabled={isBusy}
          placeholder="What are you building, who is it for, what problem should it solve, and what does success look like? Mention any existing systems, integrations or deadlines."
          aria-invalid={!!errors.message}
          className={cn(errors.message && "border-destructive")}
          {...register("message")}
        />
        <div className="flex items-start justify-between gap-3">
          {errors.message ? (
            <p className="text-xs text-destructive" role="alert">
              {errors.message.message}
            </p>
          ) : (
            <span className="text-xs text-muted-foreground">Minimum 30 characters.</span>
          )}
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
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
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
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
          "Send project brief"
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By submitting you agree to our{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </a>
        .
      </p>
    </form>
  );
}
