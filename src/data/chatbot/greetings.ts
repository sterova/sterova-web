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
    lines: [
      "Welcome to Sterova — custom software engineering for startups and enterprises.",
      "How can we help you today?",
    ],
  },
  afternoon: {
    id: "afternoon",
    title: "Good afternoon 👋",
    lines: [
      "You're in the right place for serious software.",
      "What are you looking to build?",
    ],
  },
  evening: {
    id: "evening",
    title: "Good evening 👋",
    lines: [
      "Great ideas don't wait for office hours.",
      "Let's talk about what you want to build.",
    ],
  },
  returning: {
    id: "returning",
    title: "Welcome back!",
    lines: [
      "Good to see you again.",
      "Ready to pick up where we left off?",
    ],
  },
};

export const WELCOME_SCREEN = {
  emoji: "🚀",
  title: "Sterova Assistant",
  subtitle: "Ask me about our services, process, portfolio, or pricing. I'll point you in the right direction.",
  question: "What would you like to explore?",
};

export const EMPTY_STATE = {
  emoji: "🚀",
  title: "Hi, I'm the Sterova assistant.",
  body: "I can help you understand our services, explore our portfolio, learn about our process, or connect you with the team.",
  hint: "Choose a topic below or type your question.",
};

export const UNKNOWN_INPUT_MESSAGE =
  "I didn't quite catch that — let me show you the most helpful options.";

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
