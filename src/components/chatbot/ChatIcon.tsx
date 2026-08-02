import * as Icons from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import type { ComponentType } from "react";

/**
 * Resolves an icon key from the chatbot config to a lucide component, with a
 * safe default so a typo in content never crashes the chat.
 */
export function ChatIcon({ name, className }: { name?: string; className?: string }) {
  if (name === "FaWhatsapp") {
    return <FaWhatsapp className={className} />;
  }

  const registry = Icons as unknown as Record<string, ComponentType<{ className?: string }>>;
  const Component = (name && registry[name]) || Icons.Dot;
  return <Component className={className} />;
}
