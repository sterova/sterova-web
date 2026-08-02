import { supabase } from "@/lib/supabase";
import type {
  ChatbotEventRow,
  ChatbotLeadRow,
  ChatbotLeadStatus,
  ConsultationBookingRow,
  ConsultationStatus,
} from "@/types/database";

/**
 * Admin-side reads/writes for the scripted chatbot tables created by
 * `sql/0006_chatbot.sql`. Every call runs under RLS as the signed-in admin.
 *
 * If the migration has not been run yet, PostgREST reports a missing table —
 * we translate that into a friendly, actionable message instead of a raw error.
 */

const MISSING_TABLE_HINT =
  "Chatbot tables are not created yet. Run sql/0006_chatbot.sql in the Supabase SQL editor.";

function isMissingTable(message: string): boolean {
  return /could not find the table|relation .* does not exist|schema cache/i.test(message);
}

function unwrap<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(isMissingTable(error.message) ? MISSING_TABLE_HINT : error.message);
  return (data ?? []) as T;
}

/* ── Leads ────────────────────────────────────────────────────────────── */

export async function adminFetchChatbotLeads(): Promise<ChatbotLeadRow[]> {
  const { data, error } = await supabase
    .from("chatbot_leads")
    .select("*")
    .order("created_at", { ascending: false });
  return unwrap(data as ChatbotLeadRow[] | null, error);
}

export async function adminUpdateChatbotLead(
  id: string,
  input: Partial<ChatbotLeadRow>,
): Promise<void> {
  const { error } = await supabase.from("chatbot_leads").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export function adminSetChatbotLeadStatus(id: string, status: ChatbotLeadStatus): Promise<void> {
  return adminUpdateChatbotLead(id, { status });
}

export async function adminDeleteChatbotLead(id: string): Promise<void> {
  const { error } = await supabase.from("chatbot_leads").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Consultations ────────────────────────────────────────────────────── */

export async function adminFetchConsultations(): Promise<ConsultationBookingRow[]> {
  const { data, error } = await supabase
    .from("consultation_bookings")
    .select("*")
    .order("created_at", { ascending: false });
  return unwrap(data as ConsultationBookingRow[] | null, error);
}

export async function adminUpdateConsultation(
  id: string,
  input: Partial<ConsultationBookingRow>,
): Promise<void> {
  const { error } = await supabase.from("consultation_bookings").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export function adminSetConsultationStatus(id: string, status: ConsultationStatus): Promise<void> {
  return adminUpdateConsultation(id, { status });
}

export async function adminDeleteConsultation(id: string): Promise<void> {
  const { error } = await supabase.from("consultation_bookings").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/* ── Analytics ────────────────────────────────────────────────────────── */

/** Raw events for the last `days` days (capped so the admin view stays fast). */
export async function adminFetchChatbotEvents(days = 30): Promise<ChatbotEventRow[]> {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("chatbot_events")
    .select("*")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(5000);
  return unwrap(data as ChatbotEventRow[] | null, error);
}

export interface ChatbotAnalytics {
  sessions: number;
  opens: number;
  nodeViews: number;
  optionClicks: number;
  freeText: number;
  fallbacks: number;
  formsStarted: number;
  formsSubmitted: number;
  formsAbandoned: number;
  ctaClicks: number;
  /** Percentage of started forms that were submitted. */
  conversionRate: number;
  /** Percentage of free-text messages that hit the fallback node. */
  fallbackRate: number;
  topNodes: { label: string; count: number }[];
  topOptions: { label: string; count: number }[];
  topQuestions: { label: string; count: number }[];
  dropOffNodes: { label: string; count: number }[];
  daily: { date: string; sessions: number; events: number }[];
}

function rank(rows: ChatbotEventRow[], type: string, limit = 8) {
  const counts = new Map<string, number>();
  for (const row of rows) {
    if (row.event_type !== type) continue;
    const key = row.value?.trim();
    if (!key) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/** Pure aggregation — keeps the analytics page a thin rendering layer. */
export function summariseChatbotEvents(rows: ChatbotEventRow[]): ChatbotAnalytics {
  const count = (type: string) => rows.filter((r) => r.event_type === type).length;

  const sessions = new Set(rows.map((r) => r.session_id)).size;
  const formsStarted = count("form_started");
  const formsSubmitted = count("form_submitted");
  const freeText = count("free_text");
  const fallbacks = count("fallback");

  // The last node a session viewed before leaving without submitting a form.
  const bySession = new Map<string, ChatbotEventRow[]>();
  for (const row of rows) {
    const list = bySession.get(row.session_id);
    if (list) list.push(row);
    else bySession.set(row.session_id, [row]);
  }
  const dropOffs = new Map<string, number>();
  for (const [, events] of bySession) {
    const ordered = [...events].sort((a, b) => a.created_at.localeCompare(b.created_at));
    if (ordered.some((e) => e.event_type === "form_submitted")) continue;
    const lastNode = [...ordered].reverse().find((e) => e.event_type === "node_viewed")?.value;
    if (!lastNode) continue;
    dropOffs.set(lastNode, (dropOffs.get(lastNode) ?? 0) + 1);
  }

  const dailyMap = new Map<string, { sessions: Set<string>; events: number }>();
  for (const row of rows) {
    const date = row.created_at.slice(0, 10);
    const entry = dailyMap.get(date) ?? { sessions: new Set<string>(), events: 0 };
    entry.sessions.add(row.session_id);
    entry.events += 1;
    dailyMap.set(date, entry);
  }

  return {
    sessions,
    opens: count("chat_opened"),
    nodeViews: count("node_viewed"),
    optionClicks: count("option_clicked"),
    freeText,
    fallbacks,
    formsStarted,
    formsSubmitted,
    formsAbandoned: count("form_abandoned"),
    ctaClicks: count("cta_clicked"),
    conversionRate: formsStarted ? Math.round((formsSubmitted / formsStarted) * 100) : 0,
    fallbackRate: freeText ? Math.round((fallbacks / freeText) * 100) : 0,
    topNodes: rank(rows, "node_viewed"),
    topOptions: rank(rows, "option_clicked"),
    topQuestions: rank(rows, "free_text", 12),
    dropOffNodes: [...dropOffs.entries()]
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8),
    daily: [...dailyMap.entries()]
      .map(([date, entry]) => ({ date, sessions: entry.sessions.size, events: entry.events }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-14),
  };
}
