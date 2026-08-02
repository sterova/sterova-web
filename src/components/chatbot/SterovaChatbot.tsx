import { ChatbotLauncher } from "@/components/chatbot/ChatbotLauncher";
import { ChatbotProvider } from "@/components/chatbot/ChatbotProvider";
import { ChatbotWindow } from "@/components/chatbot/ChatbotWindow";

/**
 * Mount once, near the root. Renders the floating launcher and the chat panel.
 * The chatbot is entirely rule-based — see src/data/chatbot for the content.
 */
export function SterovaChatbot() {
  return (
    <ChatbotProvider>
      <ChatbotLauncher />
      <ChatbotWindow />
    </ChatbotProvider>
  );
}
