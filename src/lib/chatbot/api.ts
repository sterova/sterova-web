import { isSupabaseConfigured, SUPABASE_NOT_CONFIGURED_MESSAGE, supabase } from "@/lib/supabase";
import { readEvents, getSessionId } from "@/lib/chatbot/session";

/**
 * Chatbot persistence.
 *
 * The dedicated tables are created by `sql/0006_chatbot.sql`. Until that file
 * has been run, submissions gracefully fall back to `contact_messages` so a
 * lead is never lost.
 */

export interface ChatLeadInput {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  timeline?: string;
  message: string;
  sourceNode?: string;
}

export interface ConsultationInput {
  name: string;
  email: string;
  phone: string;
  topic?: string;
  date?: string;
  time?: string;
  notes?: string;
}

const clean = (value?: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

function pageUrl(): string | null {
  return typeof window === "undefined" ? null : window.location.href;
}

/** True when PostgREST reports the table itself is absent. */
function isMissingTable(message: string): boolean {
  return /could not find the table|relation .* does not exist|schema cache/i.test(message);
}

function assertConfigured(): void {
  if (!isSupabaseConfigured) throw new Error(SUPABASE_NOT_CONFIGURED_MESSAGE);
}

export async function submitChatbotLead(input: ChatLeadInput): Promise<void> {
  assertConfigured();

  const row = {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: clean(input.phone),
    company: clean(input.company),
    service: clean(input.service),
    timeline: clean(input.timeline),
    message: input.message.trim(),
    source_node: clean(input.sourceNode),
    page_url: pageUrl(),
    session_id: getSessionId(),
  };

  const { error } = await supabase.from("chatbot_leads").insert(row);
  if (!error) return;
  if (!isMissingTable(error.message)) throw new Error(error.message);

  // Fallback: fold everything into the shared contact inbox.
  const details = [
    input.company && `Company: ${input.company}`,
    input.phone && `Phone: ${input.phone}`,
    input.service && `Service: ${input.service}`,
    input.timeline && `Timeline: ${input.timeline}`,
  ]
    .filter(Boolean)
    .join("\n");

  const retry = await supabase.from("contact_messages").insert({
    name: row.name,
    email: row.email,
    subject: "Chatbot quote request",
    message: details ? `${details}\n\n${row.message}` : row.message,
  });
  if (retry.error) throw new Error(retry.error.message);
}

export async function submitConsultationBooking(input: ConsultationInput): Promise<void> {
  assertConfigured();

  const row = {
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    topic: clean(input.topic),
    preferred_date: clean(input.date),
    preferred_time: clean(input.time),
    notes: clean(input.notes),
    page_url: pageUrl(),
    session_id: getSessionId(),
  };

  const { error } = await supabase.from("consultation_bookings").insert(row);
  if (!error) return;
  if (!isMissingTable(error.message)) throw new Error(error.message);

  const details = [
    `Phone: ${row.phone}`,
    input.topic && `Topic: ${input.topic}`,
    input.date && `Preferred date: ${input.date}`,
    input.time && `Preferred time: ${input.time}`,
  ]
    .filter(Boolean)
    .join("\n");

  const retry = await supabase.from("contact_messages").insert({
    name: row.name,
    email: row.email,
    subject: "Consultation booking request",
    message: `${details}${row.notes ? `\n\n${row.notes}` : ""}`,
  });
  if (retry.error) throw new Error(retry.error.message);
}

/**
 * Best-effort analytics flush. Silent by design — analytics must never
 * interrupt a conversation or surface an error to a visitor.
 */
export async function flushChatbotEvents(): Promise<void> {
  if (!isSupabaseConfigured) return;
  const events = readEvents();
  if (!events.length) return;
  const sessionId = getSessionId();
  try {
    await supabase.from("chatbot_events").insert(
      events.map((event) => ({
        session_id: sessionId,
        event_type: event.type,
        value: event.value ?? null,
        page_url: pageUrl(),
      })),
    );
  } catch {
    /* ignore */
  }
}
