import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface AuthState {
  session: Session | null;
  user: User | null;
  /**
   * Verified against the database via the is_admin() RPC — never inferred from
   * client state. RLS enforces the same check on every query, so a tampered
   * value here cannot unlock any data.
   */
  isAdmin: boolean;
  /** True until the initial session lookup and admin check have settled. */
  loading: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const verifyAdmin = useCallback(async (activeSession: Session | null) => {
    if (!activeSession) return false;
    const { data, error } = await supabase.rpc("is_admin");
    if (error) {
      console.error("[v0] is_admin check failed:", error.message);
      return false;
    }
    return data === true;
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Resolve the persisted session on mount.
    supabase.auth.getSession().then(async ({ data }) => {
      const admin = await verifyAdmin(data.session);
      if (cancelled) return;
      setSession(data.session);
      setIsAdmin(admin);
      setLoading(false);
    });

    // Keep in sync with sign-in / sign-out / token refresh.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      // TOKEN_REFRESHED fires often and does not change identity, so skip the
      // extra round trip for it.
      if (event === "TOKEN_REFRESHED") {
        setSession(nextSession);
        return;
      }

      setSession(nextSession);

      if (!nextSession) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      void verifyAdmin(nextSession).then((admin) => {
        if (cancelled) return;
        setIsAdmin(admin);
        setLoading(false);
      });
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [verifyAdmin]);

  const signIn = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { error: error.message };
    }

    // Authenticating is not the same as being authorised. Reject any valid
    // Supabase user that is not on the admin allowlist.
    const { data: adminCheck } = await supabase.rpc("is_admin");
    if (adminCheck !== true) {
      await supabase.auth.signOut();
      return { error: "This account does not have CMS access." };
    }

    setSession(data.session);
    setIsAdmin(true);
    return { error: null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(false);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      isAdmin,
      loading,
      signIn,
      signOut,
    }),
    [session, isAdmin, loading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
