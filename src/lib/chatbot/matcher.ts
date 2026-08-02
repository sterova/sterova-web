import { matchKeyword } from "@/data/chatbot/keywords";
import { UNKNOWN_INPUT_MESSAGE } from "@/data/chatbot/greetings";
import { FALLBACK_ACTIONS } from "@/data/chatbot/menu";
import type { ChatAction } from "@/data/chatbot/types";

/**
 * Free-text routing. Exact keyword lookup against the curated synonym table
 * only — no fuzzy guessing, no generation. Anything unmatched resolves to the
 * unknown-input response with the standard quick options.
 */

export interface MatchResult {
  /** Node to navigate to, or null when nothing matched. */
  nodeId: string | null;
  /** Message to show when nothing matched. */
  fallbackMessage: string;
  /** Options offered alongside the fallback message. */
  fallbackActions: ChatAction[];
}

export function matchInput(input: string): MatchResult {
  return {
    nodeId: matchKeyword(input),
    fallbackMessage: UNKNOWN_INPUT_MESSAGE,
    fallbackActions: FALLBACK_ACTIONS,
  };
}

export { UNKNOWN_INPUT_MESSAGE, FALLBACK_ACTIONS };
