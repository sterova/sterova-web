/**
 * Sterova scripted chatbot — type definitions.
 *
 * The chatbot is 100% rule based. Every message the bot can ever say is
 * declared in this folder as data. The engine (src/lib/chatbot) only walks the
 * node graph — it never composes or invents text.
 */

/** Icon keys are resolved to lucide components in the renderer. */
export type IconKey = string;

/**
 * An action rendered as a button/chip underneath a bot message.
 *
 * - `node`  — move to another conversation node (stays inside the chat)
 * - `route` — navigate the site (internal route)
 * - `link`  — open an external URL (WhatsApp, maps, socials)
 * - `tel`   — dial a number
 * - `form`  — start a scripted data-collection flow
 * - `back` / `home` — navigation helpers handled by the engine
 */
export type ChatAction =
  | { kind: "node"; label: string; node: string; icon?: IconKey; description?: string }
  | { kind: "route"; label: string; to: string; icon?: IconKey; description?: string }
  | { kind: "link"; label: string; href: string; icon?: IconKey; description?: string }
  | { kind: "tel"; label: string; icon?: IconKey; description?: string }
  | { kind: "whatsapp"; label: string; icon?: IconKey; description?: string }
  | { kind: "form"; label: string; form: FormId; icon?: IconKey; description?: string }
  | { kind: "back"; label: string; icon?: IconKey }
  | { kind: "home"; label: string; icon?: IconKey };

export type FormId = "lead" | "consultation";

/** A tile in a menu-style node. */
export interface MenuOption {
  label: string;
  node: string;
  icon?: IconKey;
  description?: string;
  emoji?: string;
}

/** A rich informational card (why-us, technologies, industries, process). */
export interface InfoCard {
  title: string;
  body?: string;
  icon?: IconKey;
  items?: string[];
  node?: string;
}

export interface QAItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ServiceDetail {
  id: string;
  title: string;
  emoji: string;
  icon: IconKey;
  short: string;
  long: string;
  features: string[];
  benefits: string[];
  idealClients: string[];
  stack: string[];
  timeline: string;
  offerings?: string[];
  faqs: QAItem[];
  /** Matching route on the marketing site, used by the "Learn more" CTA. */
  route: string;
}

/** Live content pulled from Supabase rather than from config. */
export type DynamicSource = "portfolio" | "blog" | "contact" | "social";

interface NodeBase {
  id: string;
  /** Bot messages, rendered one bubble at a time with a typing delay. */
  messages: string[];
  /** Buttons rendered after the content block. */
  actions?: ChatAction[];
  /** Optional heading shown above the content block. */
  heading?: string;
}

export type ChatNode =
  | (NodeBase & { kind: "message" })
  | (NodeBase & { kind: "menu"; options: MenuOption[]; columns?: 1 | 2 })
  | (NodeBase & { kind: "cards"; cards: InfoCard[] })
  | (NodeBase & { kind: "accordion"; items: QAItem[] })
  | (NodeBase & { kind: "dynamic"; source: DynamicSource })
  | (NodeBase & { kind: "service"; service: ServiceDetail })
  | (NodeBase & { kind: "form"; form: FormId });

export type NodeRegistry = Record<string, ChatNode>;

/** One step of a scripted data-collection form. */
export interface FormStep {
  id: string;
  prompt: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "textarea" | "date" | "time" | "choice";
  optional?: boolean;
  choices?: string[];
  /** Zod-free lightweight validation hint used for the error message. */
  validate?: "email" | "phone" | "nonEmpty" | "date" | "time";
}

export interface FormDefinition {
  id: FormId;
  title: string;
  intro: string;
  steps: FormStep[];
  successMessages: string[];
  successActions: ChatAction[];
}
