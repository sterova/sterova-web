import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const supabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL as
  | string
  | undefined;
const supabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as
  | string
  | undefined;

/**
 * True when the Supabase keys are present at build time. The public site is
 * designed to degrade gracefully (falling back to bundled static content)
 * rather than crash if they are ever missing.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "[v0] Supabase env vars missing — falling back to static content. " +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

/**
 * Browser Supabase client using the anon key only.
 *
 * Every table this client touches is protected by Row Level Security, so the
 * anon key grants exactly: read published posts / active projects / approved
 * reviews, and insert into the contact + review forms. Nothing else. The
 * service role key is never referenced in frontend code.
 */
export const supabase = createClient<Database>(
  supabaseUrl ?? "http://localhost:54321",
  supabaseAnonKey ?? "public-anon-key-placeholder",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "sterova-auth",
    },
  },
);
