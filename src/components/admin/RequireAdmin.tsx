import { useEffect } from "react";
import { useLocation } from "wouter";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ADMIN_BASE } from "@/data/admin-constants";

/**
 * Client-side gate for CMS routes.
 *
 * This is a UX layer, not the security boundary. Actual enforcement lives in
 * Postgres: every CMS table has RLS policies requiring is_admin(), so even a
 * user who bypassed this component in devtools would receive empty result sets
 * and rejected writes.
 */
export default function RequireAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isAdmin, loading, signOut } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !session) {
      navigate(ADMIN_BASE, { replace: true });
    }
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying access…</p>
      </div>
    );
  }

  if (!session) return null;

  // Authenticated with Supabase but not on the admin allowlist.
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="text-lg font-semibold mb-2">Access denied</h1>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Your account is signed in but is not authorised to use the content
            management system.
          </p>
          <Button variant="outline" size="sm" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
