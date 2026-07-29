import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ADMIN_BASE } from "@/data/admin-constants";
import AdminShell from "./AdminShell";

/**
 * Client-side gate for CMS routes. This is a UX layer, not the security
 * boundary — every CMS table enforces is_admin() through RLS in Postgres.
 */
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { session, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !session) {
      navigate({ to: ADMIN_BASE, replace: true });
    }
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying access…</p>
      </div>
    );
  }

  if (!session) return null;

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-destructive/10">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <h1 className="font-display mb-2 text-lg font-semibold">Access denied</h1>
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            Your account is signed in but is not authorised to use the content management system.
          </p>
          <Button variant="outline" size="sm" onClick={() => void signOut()}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
