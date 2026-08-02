import type { ChatAction, MenuOption } from "./types";

export const MAIN_MENU: MenuOption[] = [
  { label: "Home", node: "home", emoji: "🏠", description: "Start over" },
  { label: "Services", node: "services", emoji: "🚀", description: "What we build" },
  { label: "Portfolio", node: "portfolio", emoji: "💼", description: "Selected work" },
  { label: "Development Process", node: "process", emoji: "⚙️", description: "How we work" },
  { label: "FAQs", node: "faqs", emoji: "❓", description: "Common questions" },
  { label: "Contact", node: "contact", emoji: "📞", description: "Reach the team" },
  { label: "Project Estimator", node: "estimator", emoji: "🧮", description: "Scope your build" },
];

/** Quick-reply chips shown above the composer. */
export const QUICK_REPLIES: { label: string; node: string }[] = [
  { label: "Build a Website", node: "service-web-development" },
  { label: "Develop Mobile App", node: "service-mobile-apps" },
  { label: "Custom Software", node: "service-custom-software" },
  { label: "UI/UX Design", node: "service-ui-ux" },
  { label: "Portfolio", node: "portfolio" },
  { label: "Industries", node: "industries" },
  { label: "Project Timeline", node: "timelines" },
  { label: "Service Request", node: "quote" },
  { label: "Why Sterova?", node: "why-sterova" },
  { label: "FAQs", node: "faqs" },
  { label: "Contact", node: "contact" },
  { label: "Book Consultation", node: "book-consultation" },
  { label: "Project Estimator", node: "estimator" },
];

/** Fallback options offered whenever the bot does not recognise free text. */
export const FALLBACK_ACTIONS: ChatAction[] = [
  { kind: "node", label: "Services", node: "services", icon: "Rocket" },
  { kind: "node", label: "Portfolio", node: "portfolio", icon: "Briefcase" },
  { kind: "node", label: "Service Request", node: "quote", icon: "FileText" },
  { kind: "node", label: "Blog", node: "blog", icon: "Newspaper" },
  { kind: "node", label: "FAQs", node: "faqs", icon: "HelpCircle" },
  { kind: "node", label: "Contact", node: "contact", icon: "Phone" },
  { kind: "home", label: "Main Menu", icon: "Home" },
];
