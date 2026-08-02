/**
 * Time-of-day and returning-visitor greetings. Pure data — the engine picks
 * one based on the local clock and the stored visitor flag.
 */

export interface Greeting {
  id: string;
  title: string;
  lines: string[];
}

export const GREETINGS: Record<"morning" | "afternoon" | "evening" | "returning", Greeting> = {
  morning: {
    id: "morning",
    title: "Good morning 👋",
    lines: ["Welcome to Sterova.", "How can we help you today?"],
  },
  afternoon: {
    id: "afternoon",
    title: "Good afternoon 👋",
    lines: ["Looking for your next digital solution?"],
  },
  evening: {
    id: "evening",
    title: "Good evening 👋",
    lines: ["Let's build something amazing together."],
  },
  returning: {
    id: "returning",
    title: "Welcome back!",
    lines: ["Continue exploring Sterova."],
  },
};

export const WELCOME_SCREEN = {
  emoji: "👋",
  title: "Welcome to Sterova",
  subtitle: "Build better digital products with confidence.",
  question: "What would you like to explore today?",
};

export const EMPTY_STATE = {
  emoji: "👋",
  title: "Welcome to Sterova.",
  body: "We're here to help you explore our services, portfolio, technologies, and development process.",
  hint: "Choose any option below to get started.",
};

export const UNKNOWN_INPUT_MESSAGE =
  "I couldn't find that information.\nPlease choose one of the options below.";

/**
 * Picks the greeting for the current hour.
 * 05:00–11:59 morning · 12:00–17:59 afternoon · otherwise evening.
 */
export function greetingForHour(hour: number, returning: boolean): Greeting {
  if (returning) return GREETINGS.returning;
  if (hour >= 5 && hour < 12) return GREETINGS.morning;
  if (hour >= 12 && hour < 18) return GREETINGS.afternoon;
  return GREETINGS.evening;
}
