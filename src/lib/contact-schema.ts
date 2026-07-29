import { z } from "zod";

/** Free/disposable mailbox providers we don't accept for project enquiries. */
const DISPOSABLE_DOMAINS = [
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "dispostable.com",
];

const URL_PATTERN = /https?:\/\/|www\.[a-z0-9-]+\.[a-z]{2,}/gi;
const NAME_PATTERN = /^[\p{L}\p{M}'’.\- ]+$/u;

export const MESSAGE_MAX = 2000;

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters).")
    .max(80, "Name must be under 80 characters.")
    .regex(NAME_PATTERN, "Name can only contain letters, spaces, apostrophes and hyphens."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .max(254, "Email must be under 254 characters.")
    .email("Please enter a valid email address.")
    .refine(
      (value) => !DISPOSABLE_DOMAINS.includes(value.split("@")[1] ?? ""),
      "Please use a permanent email address we can reply to.",
    ),

  subject: z
    .string()
    .trim()
    .max(120, "Subject must be under 120 characters.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more — at least 20 characters.")
    .max(MESSAGE_MAX, `Message must be under ${MESSAGE_MAX} characters.`)
    .refine(
      (value) => (value.match(URL_PATTERN) ?? []).length <= 2,
      "Please include at most two links in your message.",
    )
    .refine(
      (value) => !/(.)\1{9,}/.test(value),
      "Your message looks like repeated characters. Please rewrite it.",
    ),

  /** Honeypot — must stay empty. Hidden from real users. */
  website: z.string().max(0, "Submission blocked.").optional().or(z.literal("")),
});

export type ContactSchemaValues = z.infer<typeof contactSchema>;

/**
 * Service enquiry — a richer, project-scoping version of the contact form used
 * by /start-project. The service itself is intentionally optional.
 */
export const serviceInquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters).")
    .max(80, "Name must be under 80 characters.")
    .regex(NAME_PATTERN, "Name can only contain letters, spaces, apostrophes and hyphens."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .max(254, "Email must be under 254 characters.")
    .email("Please enter a valid email address.")
    .refine(
      (value) => !DISPOSABLE_DOMAINS.includes(value.split("@")[1] ?? ""),
      "Please use a permanent email address we can reply to.",
    ),

  company: z
    .string()
    .trim()
    .max(120, "Company must be under 120 characters.")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .trim()
    .max(32, "Phone must be under 32 characters.")
    .optional()
    .or(z.literal("")),
  /** Service slug — optional, users may leave it unselected. */
  service: z.string().trim().max(64).optional().or(z.literal("")),

  message: z

    .string()
    .trim()
    .min(30, "Tell us a little more about the project — at least 30 characters.")
    .max(MESSAGE_MAX, `Message must be under ${MESSAGE_MAX} characters.`)
    .refine(
      (value) => (value.match(URL_PATTERN) ?? []).length <= 3,
      "Please include at most three links in your message.",
    )
    .refine(
      (value) => !/(.)\1{9,}/.test(value),
      "Your message looks like repeated characters. Please rewrite it.",
    ),

  /** Honeypot — must stay empty. */
  website: z.string().max(0, "Submission blocked.").optional().or(z.literal("")),
});

export type ServiceInquiryValues = z.infer<typeof serviceInquirySchema>;

/** Minimum time a genuine human takes to fill the form. */
export const MIN_FILL_MS = 3000;
/** Minimum gap between two submissions from the same browser. */
export const RESUBMIT_COOLDOWN_MS = 60_000;
export const LAST_SUBMIT_KEY = "sterova:contact:last-submit";

export function getCooldownRemainingMs(now = Date.now()): number {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem(LAST_SUBMIT_KEY);
  const last = raw ? Number(raw) : 0;
  if (!last || Number.isNaN(last)) return 0;
  return Math.max(0, RESUBMIT_COOLDOWN_MS - (now - last));
}
