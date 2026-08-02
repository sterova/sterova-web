import { HOME_NODE_ID } from "@/data/chatbot/flows";

/**
 * History stack powering "Back" and "Main menu" on every node.
 *
 * Pure functions over a plain string[] so the provider stays a thin shell and
 * the navigation rules can be reasoned about (and tested) in isolation.
 */

/** Keeps the persisted transcript snapshot small. */
export const MAX_HISTORY = 40;

/** Pushes a node id, collapsing consecutive duplicates. */
export function pushHistory(history: string[], nodeId: string): string[] {
  if (history[history.length - 1] === nodeId) return history;
  return [...history, nodeId].slice(-MAX_HISTORY);
}

/** The node "Back" should return to — home when the stack is empty. */
export function peekHistory(history: string[]): string {
  return history[history.length - 1] ?? HOME_NODE_ID;
}

/** Drops the most recent entry. */
export function popHistory(history: string[]): string[] {
  return history.slice(0, -1);
}

/** True when a Back button should be offered. */
export function canGoBack(history: string[]): boolean {
  return history.length > 0;
}

/** Resets to the main menu. */
export function clearHistory(): string[] {
  return [];
}
