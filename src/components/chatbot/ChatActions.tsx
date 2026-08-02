import { Button } from "@/components/ui/button";
import { ChatIcon } from "@/components/chatbot/ChatIcon";
import { useChatbot } from "@/components/chatbot/ChatbotProvider";
import type { ChatAction } from "@/data/chatbot/types";
import { cn } from "@/lib/utils";

/** The button row rendered underneath a bot message. */
export function ChatActions({ actions, className }: { actions: ChatAction[]; className?: string }) {
  const { runAction } = useChatbot();
  if (!actions.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {actions.map((action, index) => {
        const isNav = action.kind === "back" || action.kind === "home";
        const isPrimary = action.kind === "form" || action.kind === "whatsapp";
        return (
          <Button
            key={`${action.kind}-${action.label}-${index}`}
            type="button"
            size="sm"
            variant={isPrimary ? "default" : isNav ? "ghost" : "outline"}
            onClick={() => runAction(action)}
            className={cn(
              "h-auto min-h-7 rounded-full px-2.5 py-1 text-[11px] font-medium shadow-none",
              isNav && "text-muted-foreground opacity-80 hover:opacity-100",
            )}
          >
            {"icon" in action && action.icon ? (
              <ChatIcon name={action.icon} className="mr-1.5 size-3" />
            ) : null}
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}
