import { AnimatePresence, motion } from "framer-motion";
import { X, BotMessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

import { useChatbot } from "@/components/chatbot/context";
import { CHATBOT_CONFIG } from "@/data/chatbot/config";
import { cn } from "@/lib/utils";

/** Floating launcher button, bottom-right on every page. */
export function ChatbotLauncher() {
  const { isOpen, toggle, hasUnread } = useChatbot();
  const [visible, setVisible] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setVisible(true), CHATBOT_CONFIG.launcher.appearDelayMs);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!visible) return;

    let showCount = 0;
    const maxShows = 3;

    const showBubble = () => {
      if (showCount >= maxShows) return;
      setShowGreeting(true);
      showCount++;
      window.setTimeout(() => setShowGreeting(false), 4000);
    };

    // Initial delay before showing for the first time
    const initialDelay = window.setTimeout(showBubble, 1500);

    // Set up the recurring interval
    const interval = window.setInterval(() => {
      if (showCount >= maxShows) {
        window.clearInterval(interval);
        return;
      }
      showBubble();
    }, 12000);

    return () => {
      window.clearTimeout(initialDelay);
      window.clearInterval(interval);
    };
  }, [visible]);

  useEffect(() => {
    if (isOpen) {
      setShowGreeting(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {visible ? (
        <div className="fixed bottom-5 right-5 z-[71] flex items-end justify-end sm:bottom-6 sm:right-6 pointer-events-none">
          <AnimatePresence>
            {showGreeting && !isOpen ? (
              <motion.div
                initial={{ opacity: 0, x: 20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                className="absolute right-[4.5rem] bottom-1 whitespace-nowrap rounded-2xl rounded-br-sm bg-background p-3 px-4 text-sm font-medium text-foreground shadow-lg border border-border pointer-events-auto cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={toggle}
              >
                <span className="hidden sm:inline">Need help? Ask the Sterova assistant 👋</span>
                <span className="sm:hidden">Need help? 👋</span>
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={toggle}
            aria-label={isOpen ? "Close the Sterova assistant" : CHATBOT_CONFIG.launcher.ariaLabel}
            aria-expanded={isOpen}
            initial={{ opacity: 0, scale: 0.7, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 360, damping: 24 }}
            className={cn(
              "pointer-events-auto relative flex size-12 sm:size-14 items-center justify-center rounded-full",
              "overflow-hidden bg-primary text-primary-foreground shadow-xl shadow-primary/25",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            )}
          >
            {isOpen ? (
              <X className="size-5 sm:size-6" />
            ) : (
              <>
                <div className="flex size-12 sm:size-14 items-center justify-center rounded-full bg-primary">
                  <BotMessageSquare className="size-5 sm:size-6 text-primary-foreground" />
                </div>
                {hasUnread && CHATBOT_CONFIG.launcher.unreadIndicator ? (
                  <span className="absolute right-1 top-1 flex size-3">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex size-3 rounded-full border-2 border-primary bg-emerald-400" />
                  </span>
                ) : null}
              </>
            )}
          </motion.button>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
