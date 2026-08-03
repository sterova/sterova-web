import { withNav } from "./config";
import { FAQ_CATEGORIES } from "./faqs";
import { INDUSTRY_CATEGORIES, INDUSTRY_INTRO, OTHER_INDUSTRY_MESSAGE } from "./industries";
import { MAIN_MENU } from "./menu";
import { PROCESS_INTRO, PROCESS_STAGES, TIMELINE_GUIDE, TIMELINE_NOTE } from "./process";
import { CHAT_SERVICES } from "./services";
import { TECH_GROUPS, TECH_INTRO } from "./technologies";
import type { ChatNode, NodeRegistry } from "./types";
import { ABOUT_STEROVA, COMPANY_VALUES, WHY_STEROVA, WHY_STEROVA_INTRO } from "./why-sterova";

/**
 * The complete conversation graph. Every reachable bot state is declared here
 * or generated from the content files above — nothing is composed at runtime.
 */

const HOME: ChatNode = {
  id: "home",
  kind: "menu",
  messages: ["What would you like to explore?"],
  options: MAIN_MENU.filter((option) => option.node !== "home"),
  columns: 2,
};

const SERVICES: ChatNode = {
  id: "services",
  kind: "menu",
  heading: "Our Services",
  messages: [
    "Sterova delivers four core services, each handled end to end by a senior team.",
    "Which one would you like to know more about?",
  ],
  options: CHAT_SERVICES.map((service) => ({
    label: service.title,
    node: `service-${service.id}`,
    emoji: service.emoji,
    description: service.short,
  })),
  actions: withNav(
    { kind: "route", label: "All services page", to: "/services", icon: "ExternalLink" },
    { kind: "form", label: "Request Quote", form: "lead", icon: "FileText" },
  ),
};

const SERVICE_NODES: ChatNode[] = CHAT_SERVICES.map((service) => ({
  id: `service-${service.id}`,
  kind: "service" as const,
  service,
  heading: service.title,
  messages: [service.long],
  actions: withNav(
    {
      kind: "route",
      label: "Service Request Form",
      to: `/start-project?service=${service.id}`,
      icon: "FileText",
    },
    { kind: "form", label: "Request Quote", form: "lead", icon: "FileText" },
    { kind: "form", label: "Book Consultation", form: "consultation", icon: "CalendarDays" },
    { kind: "route", label: "Project Estimator", to: "/estimate", icon: "Calculator" },
    { kind: "node", label: "Other services", node: "services", icon: "Rocket" },
  ),
}));

const PORTFOLIO: ChatNode = {
  id: "portfolio",
  kind: "dynamic",
  source: "portfolio",
  heading: "Selected Work",
  messages: ["Here are some of the projects we've delivered recently."],
  actions: withNav(
    { kind: "route", label: "View full portfolio", to: "/portfolio", icon: "ExternalLink" },
    { kind: "form", label: "Start a similar project", form: "lead", icon: "FileText" },
  ),
};

const BLOG: ChatNode = {
  id: "blog",
  kind: "dynamic",
  source: "blog",
  heading: "From the Blog",
  messages: ["Our latest writing on design, engineering and building digital products."],
  actions: withNav({
    kind: "route",
    label: "Read all articles",
    to: "/blog",
    icon: "ExternalLink",
  }),
};

const PROCESS: ChatNode = {
  id: "process",
  kind: "cards",
  heading: "How We Work",
  messages: [PROCESS_INTRO],
  cards: PROCESS_STAGES.map((stage) => ({
    title: `${stage.step}. ${stage.title}`,
    body: `${stage.body}\n\nTypical duration: ${stage.duration}`,
    icon: stage.icon,
    items: stage.deliverables,
  })),
  actions: withNav(
    { kind: "node", label: "Typical timelines", node: "timelines", icon: "Clock" },
    { kind: "form", label: "Book Consultation", form: "consultation", icon: "CalendarDays" },
  ),
};

const TIMELINES: ChatNode = {
  id: "timelines",
  kind: "cards",
  heading: "Typical Timelines",
  messages: ["Here's roughly how long each type of project takes.", TIMELINE_NOTE],
  cards: TIMELINE_GUIDE,
  actions: withNav(
    { kind: "node", label: "Our process", node: "process", icon: "Settings2" },
    { kind: "form", label: "Request Quote", form: "lead", icon: "FileText" },
  ),
};

const INDUSTRIES: ChatNode = {
  id: "industries",
  kind: "menu",
  heading: "Industries We Serve",
  messages: [INDUSTRY_INTRO],
  columns: 1,
  options: [
    ...INDUSTRY_CATEGORIES.map((category) => ({
      label: category.label,
      node: `industry-${category.id}`,
      emoji: category.emoji,
      description: `${category.industries.length} sectors`,
    })),
    { label: "My industry isn't listed", node: "industry-other", emoji: "❓" },
  ],
  actions: withNav(),
};

const INDUSTRY_NODES: ChatNode[] = INDUSTRY_CATEGORIES.map((category) => ({
  id: `industry-${category.id}`,
  kind: "cards" as const,
  heading: `${category.emoji} ${category.label}`,
  messages: [
    `Sectors we work with in ${category.label.toLowerCase()}, and what we typically build:`,
  ],
  cards: category.industries.map((industry) => ({
    title: `${industry.emoji} ${industry.name}`,
    body: industry.solution,
  })),
  actions: withNav(
    { kind: "node", label: "Other industries", node: "industries", icon: "Building2" },
    { kind: "form", label: "Discuss my project", form: "lead", icon: "FileText" },
  ),
}));

const INDUSTRY_OTHER: ChatNode = {
  id: "industry-other",
  kind: "message",
  messages: [OTHER_INDUSTRY_MESSAGE],
  actions: withNav(
    { kind: "form", label: "Tell us about it", form: "lead", icon: "FileText" },
    { kind: "form", label: "Book Consultation", form: "consultation", icon: "CalendarDays" },
  ),
};

const TECHNOLOGIES: ChatNode = {
  id: "technologies",
  kind: "cards",
  heading: "Our Technology Stack",
  messages: [TECH_INTRO],
  cards: TECH_GROUPS,
  actions: withNav(
    { kind: "node", label: "Our process", node: "process", icon: "Settings2" },
    { kind: "form", label: "Discuss my stack", form: "consultation", icon: "CalendarDays" },
  ),
};

const WHY: ChatNode = {
  id: "why-sterova",
  kind: "cards",
  heading: "Why Sterova",
  messages: [WHY_STEROVA_INTRO],
  cards: WHY_STEROVA,
  actions: withNav(
    { kind: "node", label: "Our values", node: "values", icon: "Heart" },
    { kind: "node", label: "See our work", node: "portfolio", icon: "Briefcase" },
    { kind: "form", label: "Request Quote", form: "lead", icon: "FileText" },
  ),
};

const VALUES: ChatNode = {
  id: "values",
  kind: "cards",
  heading: "What We Value",
  messages: ["Four principles guide how we work with every client."],
  cards: COMPANY_VALUES,
  actions: withNav({ kind: "node", label: "About Sterova", node: "about", icon: "Info" }),
};

const ABOUT: ChatNode = {
  id: "about",
  kind: "message",
  heading: "About Sterova",
  messages: ABOUT_STEROVA,
  actions: withNav(
    { kind: "node", label: "Why Sterova", node: "why-sterova", icon: "Star" },
    { kind: "route", label: "About page", to: "/about", icon: "ExternalLink" },
  ),
};

const FAQS: ChatNode = {
  id: "faqs",
  kind: "menu",
  heading: "Frequently Asked Questions",
  messages: ["Pick a topic and I'll show the most common questions we get."],
  columns: 2,
  options: FAQ_CATEGORIES.map((category) => ({
    label: category.label,
    node: `faq-${category.id}`,
    emoji: category.emoji,
    description: `${category.items.length} questions`,
  })),
  actions: withNav({ kind: "form", label: "Ask the team", form: "lead", icon: "FileText" }),
};

const FAQ_NODES: ChatNode[] = FAQ_CATEGORIES.map((category) => ({
  id: `faq-${category.id}`,
  kind: "accordion" as const,
  heading: `${category.emoji} ${category.label}`,
  messages: ["Tap a question to see the answer."],
  items: category.items,
  actions: withNav(
    { kind: "node", label: "Other FAQ topics", node: "faqs", icon: "HelpCircle" },
    { kind: "node", label: "Contact us", node: "contact", icon: "Phone" },
  ),
}));

const SERVICE_REQUEST: ChatNode = {
  id: "service-request",
  kind: "menu",
  heading: "Service Request",
  messages: ["Which service are you interested in?"],
  columns: 1,
  options: CHAT_SERVICES.map((service) => ({
    label: service.title,
    node: `service-request-${service.id}`,
    emoji: service.emoji,
  })),
  actions: withNav(),
};

const SERVICE_REQUEST_NODES: ChatNode[] = CHAT_SERVICES.map((service) => ({
  id: `service-request-${service.id}`,
  kind: "message",
  heading: service.title,
  messages: [`Great! Please click below to open the ${service.title} request form.`],
  actions: withNav(
    {
      kind: "route",
      label: `Open ${service.title} Form`,
      to: `/start-project?service=${service.id}`,
      icon: "FileText",
    },
    { kind: "node", label: "Other services", node: "service-request", icon: "Rocket" },
  ),
}));

const QUOTE: ChatNode = {
  id: "quote",
  kind: "form",
  form: "lead",
  messages: [],
};

const BOOK: ChatNode = {
  id: "book-consultation",
  kind: "form",
  form: "consultation",
  messages: [],
};

const CONTACT: ChatNode = {
  id: "contact",
  kind: "dynamic",
  source: "contact",
  heading: "Contact Sterova",
  messages: ["Here's how to reach us — pick whichever is easiest."],
  actions: withNav(
    { kind: "route", label: "Contact page", to: "/contact", icon: "ExternalLink" },
    { kind: "form", label: "Request Quote", form: "lead", icon: "FileText" },
  ),
};

const SUPPORT: ChatNode = {
  id: "support",
  kind: "message",
  heading: "Support & Maintenance",
  messages: [
    "Launch is the beginning, not the end. Our maintenance covers uptime monitoring, security patches, bug fixes, performance tuning and new feature work.",
    "Critical issues are triaged immediately; everything else is scheduled into the next maintenance cycle.",
  ],
  actions: withNav(
    { kind: "node", label: "Support FAQs", node: "faq-support", icon: "HelpCircle" },
    { kind: "node", label: "Contact us", node: "contact", icon: "Phone" },
  ),
};

const SECURITY: ChatNode = {
  id: "security",
  kind: "message",
  heading: "Security & Ownership",
  messages: [
    "Security is built in: least-privilege access, encryption in transit and at rest, dependency scanning, secure authentication and reviewed deployments.",
    "On ownership — you own everything. Source code, designs, repositories and infrastructure are transferred to you on final delivery, and we're happy to sign an NDA before we even start talking details.",
  ],
  actions: withNav(
    { kind: "node", label: "Support & Security FAQs", node: "faq-support", icon: "HelpCircle" },
    { kind: "route", label: "Privacy policy", to: "/privacy", icon: "ExternalLink" },
  ),
};

const HIRING: ChatNode = {
  id: "hiring",
  kind: "message",
  heading: "Working With Sterova",
  messages: [
    "Thanks for your interest in Sterova! For roles, collaborations or partnership enquiries, the fastest route is a direct message to the team.",
  ],
  actions: withNav({ kind: "node", label: "Contact details", node: "contact", icon: "Phone" }),
};

const GREETING_REPLY: ChatNode = {
  id: "greeting-reply",
  kind: "menu",
  messages: ["Hello! 👋 Great to have you here.", "What can I help you with today?"],
  columns: 2,
  options: MAIN_MENU.filter((option) => option.node !== "home").slice(0, 6),
  actions: [{ kind: "home", label: "See all options", icon: "Home" }],
};

const THANKS_REPLY: ChatNode = {
  id: "thanks-reply",
  kind: "message",
  messages: ["You're very welcome! 😊", "Anything else you'd like to explore?"],
  actions: withNav(
    { kind: "node", label: "Services", node: "services", icon: "Rocket" },
    { kind: "form", label: "Request Quote", form: "lead", icon: "FileText" },
  ),
};

const BYE_REPLY: ChatNode = {
  id: "bye-reply",
  kind: "message",
  messages: [
    "Thanks for stopping by — it was good talking with you. 👋",
    "Whenever you're ready to start a project, we're here.",
  ],
  actions: [
    { kind: "form", label: "Request Quote", form: "lead", icon: "FileText" },
    { kind: "home", label: "Main Menu", icon: "Home" },
  ],
};

const HUMAN: ChatNode = {
  id: "human-handoff",
  kind: "message",
  heading: "Talk to the team",
  messages: [
    "Of course — I'm a scripted assistant, so let me put you in front of a real person.",
    "WhatsApp usually gets the fastest reply, or leave your details and the team will come back to you within one business day.",
  ],
  actions: withNav(
    { kind: "whatsapp", label: "WhatsApp us", icon: "FaWhatsapp" },
    { kind: "tel", label: "Call the office", icon: "Phone" },
    { kind: "form", label: "Leave my details", form: "lead", icon: "FileText" },
  ),
};

const NODE_LIST: ChatNode[] = [
  HOME,
  SERVICES,
  ...SERVICE_NODES,
  PORTFOLIO,
  BLOG,
  PROCESS,
  TIMELINES,
  INDUSTRIES,
  ...INDUSTRY_NODES,
  INDUSTRY_OTHER,
  TECHNOLOGIES,
  WHY,
  VALUES,
  ABOUT,
  FAQS,
  ...FAQ_NODES,
  SERVICE_REQUEST,
  ...SERVICE_REQUEST_NODES,
  QUOTE,
  BOOK,
  CONTACT,
  SUPPORT,
  SECURITY,
  HIRING,
  GREETING_REPLY,
  THANKS_REPLY,
  BYE_REPLY,
  HUMAN,
];

export const NODES: NodeRegistry = Object.fromEntries(NODE_LIST.map((node) => [node.id, node]));

export const HOME_NODE_ID = "home";

export function getNode(id: string): ChatNode | undefined {
  return NODES[id];
}
