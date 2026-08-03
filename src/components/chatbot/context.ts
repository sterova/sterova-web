import { createContext, useContext } from "react";
import type { ChatAction } from "@/data/chatbot/types";
import type { ChatEntry, FormState } from "@/lib/chatbot/engine";

export interface ChatbotContextValue {
  isOpen: boolean;
  isExpanded: boolean;
  hasUnread: boolean;
  entries: ChatEntry[];
  isTyping: boolean;
  currentNodeId: string;
  form: FormState | null;
  formError: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  toggleExpanded: () => void;
  goToNode: (nodeId: string, label?: string) => void;
  runAction: (action: ChatAction) => void;
  sendText: (text: string) => void;
  submitFormStep: (value: string) => void;
  skipFormStep: () => void;
  cancelForm: () => void;
  restart: () => void;
  fallbackActions: ChatAction[];
}

export const ChatbotContext = createContext<ChatbotContextValue | null>(null);

export function useChatbot(): ChatbotContextValue {
  const context = useContext(ChatbotContext);
  if (!context) throw new Error("useChatbot must be used inside <ChatbotProvider>");
  return context;
}
