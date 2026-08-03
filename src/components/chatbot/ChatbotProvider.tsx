import { useNavigate } from "@tanstack/react-router";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { CHATBOT_CONFIG } from "@/data/chatbot/config";
import { FORM_CANCEL_MESSAGE } from "@/data/chatbot/forms";
import { HOME_NODE_ID } from "@/data/chatbot/flows";
import { greetingForHour } from "@/data/chatbot/greetings";
import { FALLBACK_ACTIONS, UNKNOWN_INPUT_MESSAGE, matchInput } from "@/lib/chatbot/matcher";
import { peekHistory, popHistory, pushHistory } from "@/lib/chatbot/navigator";
import type { ChatAction, FormId } from "@/data/chatbot/types";
import { SITE } from "@/data/constants";
import { submitChatbotLead, submitConsultationBooking } from "@/lib/chatbot/api";
import {
  botText,
  currentStep,
  entriesForNode,
  entryId,
  getForm,
  isLastStep,
  resolveNode,
  routeFreeText,
  typingDelay,
  userEntry,
  validateStep,
  type ChatEntry,
  type FormState,
} from "@/lib/chatbot/engine";
import {
  clearSnapshot,
  isReturningVisitor,
  loadSnapshot,
  markVisited,
  saveSnapshot,
  trackEvent,
} from "@/lib/chatbot/session";
import { getWhatsAppUrl } from "@/lib/utils";

import { ChatbotContext, type ChatbotContextValue } from "./context";

const MAX_ENTRIES = 120;

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [entries, setEntries] = useState<ChatEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(HOME_NODE_ID);
  const [history, setHistory] = useState<string[]>([]);
  const [form, setForm] = useState<FormState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const queue = useRef<ChatEntry[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bootstrapped = useRef(false);

  /* ── Typing queue ─────────────────────────────────────────────────────── */

  const drain = useCallback(() => {
    if (timer.current) return;
    const next = queue.current.shift();
    if (!next) {
      setIsTyping(false);
      return;
    }
    setIsTyping(true);
    const delay = next.text ? typingDelay(next.text) : CHATBOT_CONFIG.typing.baseMs;
    timer.current = setTimeout(() => {
      timer.current = null;
      setEntries((prev) => [...prev, next].slice(-MAX_ENTRIES));
      drain();
    }, delay);
  }, []);

  const enqueue = useCallback(
    (items: ChatEntry[]) => {
      queue.current.push(...items);
      drain();
    },
    [drain],
  );

  const pushImmediate = useCallback((item: ChatEntry) => {
    setEntries((prev) => [...prev, item].slice(-MAX_ENTRIES));
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  /* ── Bootstrap: restore transcript or greet ───────────────────────────── */

  const greet = useCallback(() => {
    const greeting = greetingForHour(new Date().getHours(), isReturningVisitor());
    const node = resolveNode(HOME_NODE_ID);
    enqueue([
      botText(greeting.title),
      ...greeting.lines.map((line) => botText(line)),
      ...entriesForNode(node),
    ]);
    setCurrentNodeId(HOME_NODE_ID);
    markVisited();
  }, [enqueue]);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;
    const saved = loadSnapshot<ChatEntry>();
    if (saved?.entries?.length) {
      setEntries(saved.entries.slice(-MAX_ENTRIES));
      setCurrentNodeId(saved.nodeId || HOME_NODE_ID);
      setHistory(saved.history ?? []);
      setIsExpanded(saved.isExpanded);
      setIsOpen(saved.isOpen);
      setHasUnread(false);

      // Restore a half-finished form so the composer resumes on the same step.
      const savedForm = saved.form as FormState | null;
      if (savedForm && !savedForm.done) {
        try {
          const definition = getForm(savedForm.formId);
          const stepIndex = Math.min(
            Math.max(savedForm.stepIndex ?? 0, 0),
            definition.steps.length - 1,
          );
          setForm({
            formId: savedForm.formId,
            stepIndex,
            answers: savedForm.answers ?? {},
            submitting: false,
            done: false,
          });
        } catch {
          setForm(null);
        }
      }
    } else {
      greet();
    }
  }, [greet]);

  useEffect(() => {
    if (!bootstrapped.current || !entries.length) return;
    saveSnapshot({
      entries,
      nodeId: currentNodeId,
      history,
      form: form && !form.submitting ? form : null,
      isOpen,
      isExpanded,
    });
  }, [currentNodeId, entries, form, history, isExpanded, isOpen]);

  /* ── Navigation ───────────────────────────────────────────────────────── */

  const goToNode = useCallback(
    (nodeId: string, label?: string) => {
      const node = resolveNode(nodeId);
      if (label) pushImmediate(userEntry(label));
      setForm(null);
      setFormError(null);

      if (node.kind === "form") {
        startForm(node.form);
        return;
      }

      setHistory((prev) => pushHistory(prev, currentNodeId));
      setCurrentNodeId(node.id);
      trackEvent("node_viewed", node.id);
      enqueue(entriesForNode(node));
    },
    // startForm is declared below; it is stable via useCallback
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentNodeId, enqueue, pushImmediate],
  );

  const goBack = useCallback(() => {
    const previous = peekHistory(history);
    setHistory((prev) => popHistory(prev));
    const node = resolveNode(previous);
    setCurrentNodeId(node.id);
    setForm(null);
    enqueue(entriesForNode(node));
  }, [enqueue, history]);

  /* ── Forms ────────────────────────────────────────────────────────────── */

  const startForm = useCallback(
    (formId: FormId) => {
      const definition = getForm(formId);
      setForm({ formId, stepIndex: 0, answers: {}, submitting: false, done: false });
      setFormError(null);
      trackEvent("form_started", formId);
      enqueue([botText(definition.intro), botText(definition.steps[0].prompt)]);
    },
    [enqueue],
  );

  const finishForm = useCallback(
    async (state: FormState) => {
      const definition = getForm(state.formId);
      setForm({ ...state, submitting: true });
      try {
        if (state.formId === "lead") {
          await submitChatbotLead({
            name: state.answers.name,
            email: state.answers.email,
            phone: state.answers.phone,
            company: state.answers.company,
            service: state.answers.service,
            timeline: state.answers.timeline,
            message: state.answers.message,
            sourceNode: currentNodeId,
          });
        } else {
          await submitConsultationBooking({
            name: state.answers.name,
            email: state.answers.email,
            phone: state.answers.phone,
            topic: state.answers.topic,
            date: state.answers.date,
            time: state.answers.time,
            notes: state.answers.notes,
          });
        }
        trackEvent("form_submitted", state.formId);
        setForm({ ...state, submitting: false, done: true });
        enqueue([
          ...definition.successMessages.map((message) => botText(message)),
          {
            id: entryId(),
            role: "bot",
            actionsFor: `form-success-${definition.id}`,
            ts: Date.now(),
          },
        ]);
      } catch (error) {
        setForm({ ...state, submitting: false });
        const message = error instanceof Error ? error.message : "Something went wrong.";
        toast.error("We couldn't send that", { description: message });
        enqueue([
          botText(
            "Sorry — I couldn't send that just now. Please try again, or reach us directly on WhatsApp or email.",
          ),
        ]);
      }
    },
    [currentNodeId, enqueue],
  );

  const submitFormStep = useCallback(
    (value: string) => {
      if (!form) return;
      const step = currentStep(form);
      if (!step) return;

      const error = validateStep(step, value);
      if (error) {
        setFormError(error);
        pushImmediate(userEntry(value));
        enqueue([botText(error)]);
        return;
      }

      setFormError(null);
      pushImmediate(userEntry(value.trim()));
      const answers = { ...form.answers, [step.id]: value.trim() };
      trackEvent("form_step", `${form.formId}:${step.id}`);

      if (isLastStep(form)) {
        void finishForm({ ...form, answers });
        return;
      }
      const nextIndex = form.stepIndex + 1;
      setForm({ ...form, stepIndex: nextIndex, answers });
      enqueue([botText(getForm(form.formId).steps[nextIndex].prompt)]);
    },
    [enqueue, finishForm, form, pushImmediate],
  );

  const skipFormStep = useCallback(() => {
    if (!form) return;
    const step = currentStep(form);
    if (!step?.optional) return;
    pushImmediate(userEntry("Skip"));
    if (isLastStep(form)) {
      void finishForm(form);
      return;
    }
    const nextIndex = form.stepIndex + 1;
    setForm({ ...form, stepIndex: nextIndex });
    enqueue([botText(getForm(form.formId).steps[nextIndex].prompt)]);
  }, [enqueue, finishForm, form, pushImmediate]);

  const cancelForm = useCallback(() => {
    if (!form) return;
    trackEvent("form_abandoned", `${form.formId}:${form.stepIndex}`);
    setForm(null);
    setFormError(null);
    enqueue([botText(FORM_CANCEL_MESSAGE), ...entriesForNode(resolveNode(HOME_NODE_ID))]);
    setCurrentNodeId(HOME_NODE_ID);
  }, [enqueue, form]);

  /* ── Actions ──────────────────────────────────────────────────────────── */

  const runAction = useCallback(
    (action: ChatAction) => {
      trackEvent("option_clicked", action.label);
      switch (action.kind) {
        case "node":
          goToNode(action.node, action.label);
          break;
        case "form":
          pushImmediate(userEntry(action.label));
          startForm(action.form);
          break;
        case "route":
          trackEvent("cta_clicked", action.to);
          setIsOpen(false);
          void navigate({ to: action.to });
          break;
        case "link":
          trackEvent("cta_clicked", action.href);
          window.open(action.href, "_blank", "noopener,noreferrer");
          break;
        case "whatsapp":
          trackEvent("cta_clicked", "whatsapp");
          window.open(
            getWhatsAppUrl(SITE.whatsapp, "Hi Sterova, I'd like to discuss a project."),
            "_blank",
            "noopener,noreferrer",
          );
          break;
        case "tel":
          trackEvent("cta_clicked", "tel");
          window.location.href = `tel:${SITE.phone.replace(/\s/g, "")}`;
          break;
        case "back":
          goBack();
          break;
        case "home":
          goToNode(HOME_NODE_ID, action.label);
          break;
      }
    },
    [goBack, goToNode, navigate, pushImmediate, startForm],
  );

  /* ── Free text ────────────────────────────────────────────────────────── */

  const sendText = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;

      if (form && !form.done) {
        submitFormStep(text);
        return;
      }

      pushImmediate(userEntry(text));
      trackEvent("free_text", text.slice(0, 120));

      const { nodeId, fallbackMessage } = matchInput(text);
      if (!nodeId) {
        trackEvent("fallback", text.slice(0, 120));
        enqueue([
          botText(fallbackMessage),
          { id: entryId(), role: "bot", actionsFor: "__fallback", ts: Date.now() },
        ]);
        return;
      }

      const node = resolveNode(nodeId);
      if (node.kind === "form") {
        startForm(node.form);
        return;
      }
      setHistory((prev) => pushHistory(prev, currentNodeId));
      setCurrentNodeId(node.id);
      trackEvent("node_viewed", node.id);
      enqueue(entriesForNode(node));
    },
    [currentNodeId, enqueue, form, pushImmediate, startForm, submitFormStep],
  );

  /* ── Open / close ─────────────────────────────────────────────────────── */

  const open = useCallback(() => {
    setIsOpen(true);
    setHasUnread(false);
    trackEvent("chat_opened");
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    trackEvent("chat_closed");
  }, []);

  const toggle = useCallback(() => (isOpen ? close() : open()), [close, isOpen, open]);
  const toggleExpanded = useCallback(() => setIsExpanded((v) => !v), []);

  const restart = useCallback(() => {
    queue.current = [];
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    clearSnapshot();
    setEntries([]);
    setHistory([]);
    setForm(null);
    setFormError(null);
    setIsTyping(false);
    greet();
  }, [greet]);

  const value = useMemo<ChatbotContextValue>(
    () => ({
      isOpen,
      isExpanded,
      hasUnread,
      entries,
      isTyping,
      currentNodeId,
      form,
      formError,
      open,
      close,
      toggle,
      toggleExpanded,
      goToNode,
      runAction,
      sendText,
      submitFormStep,
      skipFormStep,
      cancelForm,
      restart,
      fallbackActions: FALLBACK_ACTIONS,
    }),
    [
      cancelForm,
      close,
      currentNodeId,
      entries,
      form,
      formError,
      goToNode,
      hasUnread,
      isExpanded,
      isOpen,
      isTyping,
      open,
      restart,
      runAction,
      sendText,
      skipFormStep,
      submitFormStep,
      toggle,
      toggleExpanded,
    ],
  );

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>;
}
