import { AnimatePresence, motion } from "framer-motion";
import { AlignJustify, ArrowLeft, Loader2, Maximize2, Minimize2, Rows3, RotateCcw, Send, X } from "lucide-react";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import avatar from "@/assets/chatbot-avatar.png";
import { ChatActions } from "@/components/chatbot/ChatActions";
import { useChatbot } from "@/components/chatbot/ChatbotProvider";
import { NodeBlock } from "@/components/chatbot/NodeBlock";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

import { Shimmer } from "@/components/ai-elements/shimmer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CHATBOT_CONFIG } from "@/data/chatbot/config";
import { EMPTY_STATE } from "@/data/chatbot/greetings";
import { getForm, currentStep, type ChatEntry } from "@/lib/chatbot/engine";
import { resolveNode } from "@/lib/chatbot/engine";
import { cn } from "@/lib/utils";

const DENSITY_KEY = "sterova-chat-density";

export function ChatbotWindow() {
  const {
    isOpen,
    isExpanded,
    close,
    toggleExpanded,
    restart,
    entries,
    isTyping,
    form,
    sendText,
    skipFormStep,
    cancelForm,
    fallbackActions,
  } = useChatbot();


  const [value, setValue] = useState("");
  const [compact, setCompact] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const entryRefs = useRef<Array<HTMLDivElement | null>>([]);
  const prevCountRef = useRef(0);
  const anchorIndexRef = useRef<number | null>(null);
  const historyPushedRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* When new entries arrive, scroll to them instantly. */
  useEffect(() => {
    if (!isOpen) return;
    const prev = prevCountRef.current;
    prevCountRef.current = entries.length;

    if (entries.length > prev && anchorIndexRef.current === null) {
      anchorIndexRef.current = prev;

      const immediateTarget = entryRefs.current[prev];
      if (immediateTarget) {
        window.setTimeout(() => {
          immediateTarget.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 50);
      }
    }

    if (!isTyping) {
      anchorIndexRef.current = null;
    }
  }, [entries, isOpen, isTyping]);

  /* Small screens present the chat as a full-page view with a back button. */
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639.98px)");
    const sync = () => setIsSmall(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  /* Full-page chat locks the page behind it, like a route change. */
  useEffect(() => {
    if (!isSmall || !isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.dataset.chatFullscreen = "true";
    return () => {
      document.body.style.overflow = previous;
      delete document.body.dataset.chatFullscreen;
    };
  }, [isSmall, isOpen]);

  /* Push a history entry so the device/browser back button closes the chat. */
  useEffect(() => {
    if (!isSmall || !isOpen) {
      /* Chat closed some other way — drop the entry we added. */
      if (historyPushedRef.current) {
        historyPushedRef.current = false;
        window.history.back();
      }
      return;
    }
    if (!historyPushedRef.current) {
      window.history.pushState({ sterovaChat: true }, "");
      historyPushedRef.current = true;
    }
    const onPopState = () => {
      historyPushedRef.current = false;
      close();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [isSmall, isOpen, close]);

  /* Back button in the header — unwind history so the stack stays clean. */
  const goBack = useCallback(() => {
    if (isSmall && historyPushedRef.current) {
      window.history.back();
      return;
    }
    close();
  }, [isSmall, close]);


  /* Restore the saved density preference. */
  useEffect(() => {
    try {
      setCompact(window.localStorage.getItem(DENSITY_KEY) === "compact");
    } catch {
      /* storage unavailable */
    }
  }, []);

  const toggleCompact = useCallback(() => {
    setCompact((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(DENSITY_KEY, next ? "compact" : "default");
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const step = form && !form.done ? currentStep(form) : undefined;

  const isSubmitting = Boolean(form?.submitting);

  /* Keep the composer focused during normal use. */
  useEffect(() => {
    if (!isOpen || isSmall) return;
    const id = window.setTimeout(() => textareaRef.current?.focus(), 120);
    return () => window.clearTimeout(id);
  }, [isOpen, form?.stepIndex, isTyping, isSmall]);

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const text = (message.text ?? value).trim();
      if (!text || isSubmitting) return;
      sendText(text);
      setValue("");
      if (window.matchMedia("(max-width: 639.98px)").matches) {
        textareaRef.current?.blur();
      }
    },
    [isSubmitting, sendText, value],
  );

  const placeholder = useMemo(() => {
    if (step) return step.placeholder;
    return "Message";
  }, [step]);



  /* Escape closes the panel. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, isOpen]);



  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="sterova-chat"
          role="dialog"
          data-chatbot-surface=""
          aria-label="Sterova assistant"
          aria-modal={isSmall ? true : undefined}
          initial={isSmall ? { opacity: 0, x: 40 } : { opacity: 0, y: 24, scale: 0.98 }}
          animate={isSmall ? { opacity: 1, x: 0 } : { opacity: 1, y: 0, scale: 1 }}
          exit={isSmall ? { opacity: 0, x: 40 } : { opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 30 }}
          className={cn(
            "fixed z-[70] flex flex-col overflow-hidden bg-background shadow-2xl",
            "inset-0 rounded-none border-0",
            "sm:inset-auto sm:bottom-24 sm:right-6 sm:rounded-2xl sm:border sm:border-border/70 sm:bg-background/95 sm:backdrop-blur-xl",
            isExpanded
              ? "sm:h-[min(90vh,860px)] sm:w-[min(94vw,760px)]"
              : "sm:h-[min(78vh,680px)] sm:w-[min(92vw,420px)]",
          )}
        >
          <Header
            isExpanded={isExpanded}
            isCompact={compact}
            isSmall={isSmall}
            onBack={goBack}
            onClose={close}
            onToggleExpanded={toggleExpanded}
            onToggleCompact={toggleCompact}
            onRestart={restart}
          />

          <Conversation className="flex-1" resize={isTyping ? undefined : "smooth"}>
            <ConversationContent
              className={cn(compact ? "gap-2 px-2.5 py-2.5" : "gap-3.5 px-4 py-4")}
            >
              {entries.length === 0 ? <EmptyState /> : null}

              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  ref={(el) => {
                    entryRefs.current[index] = el;
                  }}
                  className="scroll-mt-2"
                >
                  <EntryRow entry={entry} compact={compact} fallbackActionsId="__fallback" />
                </div>
              ))}

              {isTyping ? (
                <div className="flex items-center gap-2 pl-1">
                  <img
                    src={avatar}
                    alt=""
                    width={20}
                    height={20}
                    loading="lazy"
                    className="size-5 rounded-full"
                  />
                  <Shimmer className="text-xs text-muted-foreground">Typing…</Shimmer>
                </div>
              ) : null}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          {/* Form controls (only while a form is active) */}
          <div className={cn(form && step ? "border-t border-border/60 px-3 pt-2" : "hidden")}>
            {form && step ? (
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <Badge variant="secondary" className="rounded-full text-[11px]">
                  {getForm(form.formId).title} · step {form.stepIndex + 1} of{" "}
                  {getForm(form.formId).steps.length}
                </Badge>
                {step.choices?.map((choice) => (
                  <Button
                    key={choice}
                    type="button"
                    size="sm"
                    variant="outline"
                    className="h-auto min-h-8 rounded-full px-3 py-1.5 text-xs"
                    onClick={() => sendText(choice)}
                    disabled={isSubmitting}
                  >
                    {choice}
                  </Button>
                ))}
                {step.optional ? (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-auto min-h-8 rounded-full px-3 py-1.5 text-xs text-muted-foreground"
                    onClick={skipFormStep}
                    disabled={isSubmitting}
                  >
                    Skip
                  </Button>
                ) : null}
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-auto min-h-8 rounded-full px-3 py-1.5 text-xs text-muted-foreground"
                  onClick={cancelForm}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            ) : null}
          </div>

          {/* WhatsApp-like Composer */}
          <div className="relative z-10 p-2 sm:p-3 bg-[#f0f2f5] dark:bg-[#202c33] pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <PromptInput
              onSubmit={handleSubmit}
              className="[&_[data-slot=input-group]]:h-auto [&_[data-slot=input-group]]:overflow-visible [&_[data-slot=input-group]]:border-0 [&_[data-slot=input-group]]:!ring-0 [&_[data-slot=input-group]]:shadow-none [&_[data-slot=input-group]]:bg-transparent [&_[data-slot=input-group]]:p-0 mx-auto max-w-3xl"
            >
              <div className="flex items-end gap-2 w-full">
                <div className="flex-1 bg-white dark:bg-[#2a3942] rounded-3xl shadow-sm flex items-end">
                  <PromptInputTextarea
                    ref={textareaRef}
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                    placeholder={placeholder}
                    disabled={isSubmitting}
                    className="flex-1 min-h-[44px] max-h-[160px] py-[10px] px-4 text-base touch-action-manipulation bg-transparent border-0 focus-visible:ring-0 resize-none leading-relaxed text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <PromptInputSubmit
                  size="icon-sm"
                  status={isSubmitting ? "submitted" : undefined}
                  disabled={!value.trim() || isSubmitting}
                  className="!size-[44px] shrink-0 rounded-full bg-[#00a884] hover:bg-[#008f6f] text-white shadow-sm transition-all flex items-center justify-center mb-0 disabled:opacity-50 disabled:hover:bg-[#00a884]"
                >
                  {isSubmitting ? (
                    <Loader2 className="size-5 animate-spin text-white" />
                  ) : (
                    <Send className="size-[20px] text-white ml-0.5 fill-white" />
                  )}
                </PromptInputSubmit>
              </div>
            </PromptInput>
          </div>

          {/* Fallback actions live inside entries; nothing else renders here. */}
          <span className="sr-only">{fallbackActions.length} quick options available</span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Header({
  isExpanded,
  isCompact,
  isSmall,
  onBack,
  onClose,
  onToggleExpanded,
  onToggleCompact,
  onRestart,
}: {
  isExpanded: boolean;
  isCompact: boolean;
  isSmall: boolean;
  onBack: () => void;
  onClose: () => void;
  onToggleExpanded: () => void;
  onToggleCompact: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border/60 bg-card/60 px-3 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] sm:gap-3 sm:px-4 sm:pt-3">
      <Button
        type="button"
        size="icon-sm"
        variant="ghost"
        onClick={onBack}
        aria-label="Back"
        className="-ml-1 shrink-0 sm:hidden"
      >
        <ArrowLeft className="size-5" />
      </Button>
      <img
        src={avatar}
        alt="Sterova assistant"
        width={36}
        height={36}
        className="size-9 shrink-0 rounded-full"
      />
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">Sterova Assistant</p>
        <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span aria-hidden className="size-1.5 rounded-full bg-emerald-500" />
          Online · replies instantly
        </p>
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={onToggleCompact}
          aria-pressed={isCompact}
          aria-label={
            isCompact ? "Switch to default message layout" : "Switch to compact message layout"
          }
          title={isCompact ? "Default layout" : "Compact layout"}
        >
          {isCompact ? <AlignJustify className="size-4" /> : <Rows3 className="size-4" />}
        </Button>

        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={onRestart}
          aria-label="Restart conversation"
        >
          <RotateCcw className="size-4" />
        </Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={onToggleExpanded}
          aria-label={isExpanded ? "Collapse chat" : "Expand chat"}
          className="hidden sm:inline-flex"
        >
          {isExpanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
        {isSmall ? null : (
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={onClose}
            aria-label="Close chat"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <img src={avatar} alt="" width={48} height={48} className="size-12 rounded-full" />
      <p className="text-sm font-semibold text-foreground">{EMPTY_STATE.title}</p>
      <p className="max-w-xs text-xs leading-relaxed text-muted-foreground">{EMPTY_STATE.body}</p>
      <p className="text-[11px] text-muted-foreground">{EMPTY_STATE.hint}</p>
    </div>
  );
}

function EntryRow({
  entry,
  compact,
  fallbackActionsId,
}: {
  entry: ChatEntry;
  compact: boolean;
  fallbackActionsId: string;
}) {
  const { fallbackActions } = useChatbot();

  if (entry.actionsFor) {
    if (entry.actionsFor === fallbackActionsId) {
      return <ChatActions actions={fallbackActions} className="pl-1" />;
    }
    if (entry.actionsFor.startsWith("form-success-")) {
      const formId = entry.actionsFor.replace("form-success-", "") as "lead" | "consultation";
      return <ChatActions actions={getForm(formId).successActions} className="pl-1" />;
    }
    const node = resolveNode(entry.actionsFor);
    return <ChatActions actions={node.actions ?? []} className="pl-1" />;
  }

  if (entry.nodeId) {
    return (
      <Message from="assistant" className={compact ? "gap-1" : "gap-2"}>
        <MessageContent className={cn("w-full px-0 py-0", compact ? "gap-1" : "gap-2")}>
          <NodeBlock nodeId={entry.nodeId} />
        </MessageContent>
      </Message>
    );
  }

  return (
    <Message
      from={entry.role === "user" ? "user" : "assistant"}
      className={compact ? "gap-1" : "gap-2"}
    >
      <MessageContent
        className={cn(
          "px-0 py-0",
          compact
            ? "gap-1 group-[.is-user]:px-2.5 group-[.is-user]:py-1.5"
            : "gap-2 group-[.is-user]:px-3.5 group-[.is-user]:py-2.5",
        )}
      >
        <p
          className={cn(
            "whitespace-pre-line",
            compact ? "text-[13px] leading-[1.35]" : "text-sm leading-relaxed",
          )}
        >
          {entry.text}
        </p>
      </MessageContent>
    </Message>
  );
}

export const CHAT_FOOTER_TAGLINE = CHATBOT_CONFIG.fullscreenFooter.tagline;
