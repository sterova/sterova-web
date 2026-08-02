import type { ChatAction } from "./types";

/**
 * Chatbot behaviour configuration. Everything here is tunable without touching
 * the conversation engine or any component.
 */
export const CHATBOT_CONFIG = {
  version: "1.0.0",
  /** Launcher */
  launcher: {
    tooltip: "Need help?",
    ariaLabel: "Open the Sterova assistant",
    /** Show the unread dot until the visitor opens the chat once. */
    unreadIndicator: true,
    /** Delay (ms) before the launcher appears on first paint. */
    appearDelayMs: 1200,
  },
  /** Typing simulation */
  typing: {
    /** Base delay before a bot bubble appears. */
    baseMs: 320,
    /** Extra delay per character, capped by maxMs. */
    perCharMs: 9,
    maxMs: 1100,
  },
  /** Session memory */
  session: {
    transcriptKey: "sterova-chat-transcript",
    visitorKey: "sterova-chat-visitor",
    analyticsKey: "sterova-chat-session",
    /** Transcript older than this is discarded on load. */
    maxAgeMs: 1000 * 60 * 60 * 6,
  },
  /** Routes on the marketing site the bot can send visitors to. */
  routes: {
    contact: "/contact",
    estimate: "/estimate",
    startProject: "/start-project",
    portfolio: "/portfolio",
    blog: "/blog",
    services: "/services",
    process: "/process",
    about: "/about",
    privacy: "/privacy",
    terms: "/terms",
  },
  fullscreenFooter: {
    tagline: "Building Digital Experiences That Drive Growth.",
  },
} as const;

/** The pricing answer. The bot never quotes a number, anywhere. */
export const PRICING_RESPONSE =
  "Every project is unique.\nContact Sterova for a personalized quotation.";

/** Standard call-to-action row appended to commercial nodes. */
export const PRIMARY_CTAS: ChatAction[] = [
  { kind: "form", label: "Request Quote", form: "lead", icon: "FileText" },
  { kind: "route", label: "Project Estimator", to: "/estimate", icon: "Calculator" },
  { kind: "whatsapp", label: "WhatsApp", icon: "FaWhatsapp" },
  { kind: "tel", label: "Call", icon: "Phone" },
  { kind: "form", label: "Book Consultation", form: "consultation", icon: "CalendarDays" },
];

/** Navigation footer actions present on nearly every node. */
export const NAV_ACTIONS: ChatAction[] = [
  { kind: "back", label: "Back", icon: "ArrowLeft" },
  { kind: "home", label: "Main Menu", icon: "Home" },
];

/** Convenience helper for composing a node's action list. */
export function withNav(...actions: ChatAction[]): ChatAction[] {
  return [...actions, ...NAV_ACTIONS];
}
