import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client using the publishable (anon) key.
 *
 * Credentials are read exclusively from environment variables — nothing is
 * hardcoded. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env
 * file (locally) or in your hosting dashboard (Vercel / Cloudflare).
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * True when the Supabase keys are present at build time. The public site is
 * designed to degrade gracefully (falling back to bundled static content)
 * rather than crash if they are ever missing.
 */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Shown in the UI and thrown from writes when the backend is not wired up. */
export const SUPABASE_NOT_CONFIGURED_MESSAGE =
  "Content service is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.";

if (!isSupabaseConfigured) {
  console.warn(
    "[sterova] Supabase env vars missing — falling back to static content. " +
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.",
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
export const supabase = createClient(
  // A syntactically valid placeholder keeps createClient from throwing when the
  // env vars are absent. It is never contacted: the fetch shim below fails the
  // request locally instead, so unconfigured builds produce one clear warning
  // rather than a stream of ERR_CONNECTION_REFUSED console noise.
  supabaseUrl ?? "https://placeholder.supabase.co",
  supabaseAnonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "sterova-auth",
    },
    ...(isSupabaseConfigured
      ? {}
      : {
          global: {
            fetch: () => Promise.reject(new Error(SUPABASE_NOT_CONFIGURED_MESSAGE)),
          },
        }),
  },
);
