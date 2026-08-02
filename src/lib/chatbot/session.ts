import { CHATBOT_CONFIG } from "@/data/chatbot/config";

/**
 * Lightweight client-side session + analytics buffer for the scripted chatbot.
 * Events are kept in sessionStorage; the admin analytics phase will drain them
 * to the database. Nothing here blocks or breaks the chat if storage fails.
 */

export interface ChatEvent {
  type:
    | "chat_opened"
    | "chat_closed"
    | "node_viewed"
    | "option_clicked"
    | "free_text"
    | "fallback"
    | "form_started"
    | "form_step"
    | "form_abandoned"
    | "form_submitted"
    | "cta_clicked";
  value?: string;
  at: number;
}

const { analyticsKey, visitorKey, transcriptKey, maxAgeMs } = CHATBOT_CONFIG.session;

function safeSession(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.sessionStorage;
  } catch {
    return null;
  }
}

function safeLocal(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getSessionId(): string {
  const store = safeSession();
  const existing = store?.getItem(`${analyticsKey}-id`);
  if (existing) return existing;
  const id = `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  store?.setItem(`${analyticsKey}-id`, id);
  return id;
}

export function trackEvent(type: ChatEvent["type"], value?: string): void {
  const store = safeSession();
  if (!store) return;
  try {
    const raw = store.getItem(analyticsKey);
    const events: ChatEvent[] = raw ? JSON.parse(raw) : [];
    events.push({ type, value, at: Date.now() });
    store.setItem(analyticsKey, JSON.stringify(events.slice(-200)));
  } catch {
    /* analytics must never break the chat */
  }
}

export function readEvents(): ChatEvent[] {
  const store = safeSession();
  if (!store) return [];
  try {
    const raw = store.getItem(analyticsKey);
    return raw ? (JSON.parse(raw) as ChatEvent[]) : [];
  } catch {
    return [];
  }
}

export function isReturningVisitor(): boolean {
  return safeLocal()?.getItem(visitorKey) === "1";
}

export function markVisited(): void {
  safeLocal()?.setItem(visitorKey, "1");
}

/**
 * Full conversation snapshot. Persisted in sessionStorage so a page reload
 * restores exactly where the visitor was: transcript, current flow node,
 * back-history and any half-finished form step.
 */
export interface ChatSnapshot<T> {
  /** Schema version — a bump invalidates older snapshots safely. */
  v: number;
  at: number;
  entries: T[];
  nodeId: string;
  history: string[];
  form: unknown | null;
  isOpen: boolean;
  isExpanded: boolean;
}

export const SNAPSHOT_VERSION = 2;

export function saveSnapshot<T>(snapshot: Omit<ChatSnapshot<T>, "v" | "at">): void {
  const store = safeSession();
  if (!store) return;
  try {
    const payload: ChatSnapshot<T> = { v: SNAPSHOT_VERSION, at: Date.now(), ...snapshot };
    store.setItem(transcriptKey, JSON.stringify(payload));
  } catch {
    /* quota or private mode — chat continues in memory */
  }
}

export function loadSnapshot<T>(): ChatSnapshot<T> | null {
  const store = safeSession();
  if (!store) return null;
  try {
    const raw = store.getItem(transcriptKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ChatSnapshot<T>>;
    if (!parsed?.at || parsed.v !== SNAPSHOT_VERSION) return null;
    if (Date.now() - parsed.at > maxAgeMs) return null;
    return {
      v: SNAPSHOT_VERSION,
      at: parsed.at,
      entries: Array.isArray(parsed.entries) ? parsed.entries : [],
      nodeId: typeof parsed.nodeId === "string" ? parsed.nodeId : "",
      history: Array.isArray(parsed.history)
        ? parsed.history.filter((h) => typeof h === "string")
        : [],
      form: parsed.form ?? null,
      isOpen: Boolean(parsed.isOpen),
      isExpanded: Boolean(parsed.isExpanded),
    };
  } catch {
    return null;
  }
}

export function clearSnapshot(): void {
  safeSession()?.removeItem(transcriptKey);
}
