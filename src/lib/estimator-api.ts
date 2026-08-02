import { supabase } from "@/lib/supabase";
import type { ChatbotLeadStatus, EstimatorSubmissionRow } from "@/types/database";

/**
 * Reads/writes for the Project Estimator (`/estimate`), backed by the table in
 * `sql/0007_estimator_submissions.sql`. Public visitors may only insert; every
 * read path runs under RLS as a signed-in admin.
 */

const MISSING_TABLE_HINT =
  "Estimator table is not created yet. Run sql/0007_estimator_submissions.sql in the Supabase SQL editor.";

function isMissingTable(message: string): boolean {
  return /could not find the table|relation .* does not exist|schema cache/i.test(message);
}

export interface EstimatorSubmissionInput {
  name?: string | null;
  email: string;
  phone?: string | null;
  projectType: string;
  features: string[];
  designNeed?: string | null;
  timelinePref?: string | null;
  estimateCost?: string | null;
  estimateWeeks?: string | null;
}

/** Public write — called from the estimator's final step. */
export async function submitEstimatorRequest(input: EstimatorSubmissionInput): Promise<void> {
  const { error } = await supabase.from("estimator_submissions").insert({
    name: input.name?.trim() || null,
    email: input.email.trim(),
    phone: input.phone?.trim() || null,
    project_type: input.projectType,
    features: input.features,
    design_need: input.designNeed ?? null,
    timeline_pref: input.timelinePref ?? null,
    estimate_cost: input.estimateCost ?? null,
    estimate_weeks: input.estimateWeeks ?? null,
    page_url: typeof window === "undefined" ? null : window.location.href,
  });
  if (error) throw new Error(isMissingTable(error.message) ? MISSING_TABLE_HINT : error.message);
}

/* ── Admin ────────────────────────────────────────────────────────────── */

export async function adminFetchEstimatorSubmissions(): Promise<EstimatorSubmissionRow[]> {
  const { data, error } = await supabase
    .from("estimator_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(isMissingTable(error.message) ? MISSING_TABLE_HINT : error.message);
  return (data ?? []) as EstimatorSubmissionRow[];
}

export async function adminUpdateEstimatorSubmission(
  id: string,
  input: Partial<EstimatorSubmissionRow>,
): Promise<void> {
  const { error } = await supabase.from("estimator_submissions").update(input).eq("id", id);
  if (error) throw new Error(error.message);
}

export function adminSetEstimatorStatus(id: string, status: ChatbotLeadStatus): Promise<void> {
  return adminUpdateEstimatorSubmission(id, { status });
}

export async function adminDeleteEstimatorSubmission(id: string): Promise<void> {
  const { error } = await supabase.from("estimator_submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
