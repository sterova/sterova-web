import { CHATBOT_CONFIG } from "@/data/chatbot/config";
import { FORM_VALIDATION_MESSAGES, FORMS } from "@/data/chatbot/forms";
import { getNode, HOME_NODE_ID } from "@/data/chatbot/flows";
import { matchKeyword } from "@/data/chatbot/keywords";
import type { ChatNode, FormDefinition, FormId, FormStep } from "@/data/chatbot/types";

/**
 * Pure conversation-engine helpers. No React, no side effects — everything
 * here is deterministic so the behaviour can be reasoned about and tested.
 */

export type EntryRole = "bot" | "user";

export interface ChatEntry {
  id: string;
  role: EntryRole;
  /** Plain bubble text. */
  text?: string;
  /** When set, the entry renders the node's content block (cards, menu, …). */
  nodeId?: string;
  /** When set, the entry renders the node's action buttons. */
  actionsFor?: string;
  ts: number;
}

let counter = 0;
export function entryId(): string {
  counter += 1;
  return `e${Date.now().toString(36)}-${counter}`;
}

/** Typing delay proportional to message length, clamped by config. */
export function typingDelay(text: string): number {
  const { baseMs, perCharMs, maxMs } = CHATBOT_CONFIG.typing;
  return Math.min(maxMs, baseMs + text.length * perCharMs);
}

export function userEntry(text: string): ChatEntry {
  return { id: entryId(), role: "user", text, ts: Date.now() };
}

export function botText(text: string): ChatEntry {
  return { id: entryId(), role: "bot", text, ts: Date.now() };
}

/**
 * Expands a node into the sequence of transcript entries it produces:
 * one bubble per message, then the content block, then the action row.
 */
export function entriesForNode(node: ChatNode): ChatEntry[] {
  const entries: ChatEntry[] = node.messages.map((message) => botText(message));

  const hasContentBlock = node.kind !== "message" || Boolean(node.heading);
  if (hasContentBlock) {
    entries.push({ id: entryId(), role: "bot", nodeId: node.id, ts: Date.now() });
  }
  if (node.actions?.length) {
    entries.push({ id: entryId(), role: "bot", actionsFor: node.id, ts: Date.now() });
  }
  return entries;
}

export function resolveNode(id: string): ChatNode {
  return getNode(id) ?? getNode(HOME_NODE_ID)!;
}

/** Free-text routing. Returns the node id or null for the fallback path. */
export function routeFreeText(input: string): string | null {
  return matchKeyword(input);
}

/* ── Forms ─────────────────────────────────────────────────────────────── */

export interface FormState {
  formId: FormId;
  stepIndex: number;
  answers: Record<string, string>;
  submitting: boolean;
  done: boolean;
}

export function getForm(id: FormId): FormDefinition {
  return FORMS[id];
}

export function currentStep(state: FormState): FormStep | undefined {
  return getForm(state.formId).steps[state.stepIndex];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+]?[\d\s()-]{7,20}$/;

/** Returns an error message, or null when the value is acceptable. */
export function validateStep(step: FormStep, raw: string): string | null {
  const value = raw.trim();
  if (!value) {
    return step.optional ? null : FORM_VALIDATION_MESSAGES.nonEmpty;
  }
  switch (step.validate) {
    case "email":
      return EMAIL_RE.test(value) ? null : FORM_VALIDATION_MESSAGES.email;
    case "phone":
      return PHONE_RE.test(value) ? null : FORM_VALIDATION_MESSAGES.phone;
    case "date":
      return Number.isNaN(Date.parse(value)) ? FORM_VALIDATION_MESSAGES.date : null;
    case "time":
      return /^\d{1,2}:\d{2}/.test(value) ? null : FORM_VALIDATION_MESSAGES.time;
    case "nonEmpty":
      return value.length >= 2 ? null : FORM_VALIDATION_MESSAGES.nonEmpty;
    default:
      return null;
  }
}

export function isLastStep(state: FormState): boolean {
  return state.stepIndex >= getForm(state.formId).steps.length - 1;
}

/** Formats a skipped optional answer for the transcript. */
export const SKIPPED_LABEL = "Skipped";
