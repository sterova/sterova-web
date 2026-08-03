import type { ChatAction, MenuOption } from "./types";

export const MAIN_MENU: MenuOption[] = [
  { label: "Home", node: "home", emoji: "🏠", description: "Start over" },
  {
    label: "Service Request",
    node: "service-request",
    emoji: "📝",
    description: "Start a project",
  },
  { label: "Services", node: "services", emoji: "🚀", description: "What we build" },
  { label: "Portfolio", node: "portfolio", emoji: "💼", description: "Selected work" },
  { label: "Development Process", node: "process", emoji: "⚙️", description: "How we work" },
  { label: "FAQs", node: "faqs", emoji: "❓", description: "Common questions" },
  { label: "Contact", node: "contact", emoji: "📞", description: "Reach the team" },
];

/** Quick-reply chips shown above the composer. */
export const QUICK_REPLIES: { label: string; node: string }[] = [
  { label: "Build a Website", node: "service-web-development" },
  { label: "Develop Mobile App", node: "service-mobile-apps" },
  { label: "SaaS Product", node: "service-saas" },
  { label: "Custom Software", node: "service-custom-software" },
  { label: "API Integration", node: "service-api-integration" },
  { label: "UI/UX Design", node: "service-design" },
  { label: "Portfolio", node: "portfolio" },
  { label: "FAQs", node: "faqs" },
  { label: "Contact", node: "contact" },
];

/** Fallback options offered whenever the bot does not recognise free text. */
export const FALLBACK_ACTIONS: ChatAction[] = [
  { kind: "node", label: "Services", node: "services", icon: "Rocket" },
  { kind: "node", label: "Portfolio", node: "portfolio", icon: "Briefcase" },
  { kind: "node", label: "Service Request", node: "service-request", icon: "FileText" },
  { kind: "node", label: "Blog", node: "blog", icon: "Newspaper" },
  { kind: "node", label: "FAQs", node: "faqs", icon: "HelpCircle" },
  { kind: "node", label: "Contact", node: "contact", icon: "Phone" },
  { kind: "home", label: "Main Menu", icon: "Home" },
];
