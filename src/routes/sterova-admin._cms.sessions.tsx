import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Laptop, LogOut, Monitor, ShieldCheck, Smartphone, Trash2, Users } from "lucide-react";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeading,
  AdminRow,
  AdminSearch,
  AdminTable,
  AdminTableSkeleton,
  AdminToolbar,
  StatTile,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  adminFetchSessions,
  adminPruneSessions,
  adminRevokeSession,
  adminRevokeUserSessions,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import { cn, formatDate } from "@/lib/utils";
import type { AdminSessionRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/sessions")({
  head: () => privateSeo("Sessions · CMS"),
  component: () => <AdminSessionsPage />,
});

type Filter = "active" | "revoked" | "all";

/** A session is treated as idle once its heartbeat is older than 5 minutes. */
const ONLINE_WINDOW_MS = 5 * 60_000;

function isOnline(row: AdminSessionRow) {
  return !row.revoked_at && Date.now() - new Date(row.last_seen_at).getTime() < ONLINE_WINDOW_MS;
}

/** Best-effort, purely cosmetic device label parsed from the user agent. */
function describeDevice(userAgent: string | null) {
  const ua = userAgent ?? "";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Unknown browser";
  const os = /Windows/.test(ua)
    ? "Windows"
    : /Mac OS X|Macintosh/.test(ua)
      ? "macOS"
      : /Android/.test(ua)
        ? "Android"
        : /iPhone|iPad|iOS/.test(ua)
          ? "iOS"
          : /Linux/.test(ua)
            ? "Linux"
            : "Unknown OS";
  const mobile = /Mobile|Android|iPhone/.test(ua);
  const Icon = mobile ? Smartphone : /Macintosh|Windows|Linux/.test(ua) ? Laptop : Monitor;
  return { label: `${browser} · ${os}`, Icon };
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return formatDate(iso);
}

function AdminSessionsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { sessionId: currentSessionId } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("active");
  const [pendingRevoke, setPendingRevoke] = useState<AdminSessionRow | null>(null);
  const [pendingAccount, setPendingAccount] = useState<AdminSessionRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "sessions"],
    queryFn: adminFetchSessions,
    // Keeps the list close to live without a socket.
    refetchInterval: 30_000,
  });

  const rows = useMemo(() => data ?? [], [data]);
  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] });

  const counts = useMemo(
    () => ({
      active: rows.filter((r) => !r.revoked_at).length,
      revoked: rows.filter((r) => Boolean(r.revoked_at)).length,
      online: rows.filter(isOnline).length,
      accounts: new Set(rows.filter((r) => !r.revoked_at).map((r) => r.user_id)).size,
      all: rows.length,
    }),
    [rows],
  );

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows
      .filter((r) =>
        filter === "active" ? !r.revoked_at : filter === "revoked" ? Boolean(r.revoked_at) : true,
      )
      .filter(
        (r) =>
          !term ||
          r.email.toLowerCase().includes(term) ||
          (r.user_agent ?? "").toLowerCase().includes(term),
      );
  }, [rows, filter, search]);

  const revokeOne = useMutation({
    mutationFn: (row: AdminSessionRow) => adminRevokeSession(row.session_id),
    onSuccess: () => {
      invalidate();
      toast({
        title: "Session signed out",
        description: "That browser loses CMS access on its next request.",
      });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not revoke session",
        description: err.message,
        variant: "destructive",
      }),
  });

  const revokeAccount = useMutation({
    mutationFn: (row: AdminSessionRow) => adminRevokeUserSessions(row.user_id, true),
    onSuccess: (count, row) => {
      invalidate();
      toast({
        title: `Signed out ${count} session${count === 1 ? "" : "s"}`,
        description: `${row.email} has been logged out everywhere except this device.`,
      });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not revoke sessions",
        description: err.message,
        variant: "destructive",
      }),
  });

  const prune = useMutation({
    mutationFn: adminPruneSessions,
    onSuccess: (count) => {
      invalidate();
      toast({
        title:
          count > 0 ? `Removed ${count} stale record${count === 1 ? "" : "s"}` : "Nothing to clear",
        description: "Sessions inactive for over 30 days are deleted.",
      });
    },
    onError: (err: Error) =>
      toast({ title: "Could not clear history", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <AdminPageHeading
        eyebrow="Security"
        title="Active sessions"
        description="Every browser signed in to the CMS. Revoking a session removes its access immediately — the device is signed out within a minute."
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => prune.mutate()}
            disabled={prune.isPending}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Clear old records
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Online now"
          value={counts.online}
          icon={ShieldCheck}
          accent
          hint="Seen in the last 5 minutes"
        />
        <StatTile label="Active sessions" value={counts.active} icon={Monitor} hint="Not revoked" />
        <StatTile
          label="Admin accounts"
          value={counts.accounts}
          icon={Users}
          hint="With at least one session"
        />
        <StatTile label="Revoked" value={counts.revoked} icon={LogOut} hint="Remotely signed out" />
      </div>

      <AdminCard>
        <AdminToolbar>
          <AdminFilterTabs
            label="Filter sessions"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "active", label: "Active", count: counts.active },
              { value: "revoked", label: "Revoked", count: counts.revoked },
              { value: "all", label: "All", count: counts.all },
            ]}
          />
          <AdminSearch value={search} onChange={setSearch} placeholder="Search email or device…" />
        </AdminToolbar>

        {isLoading ? (
          <AdminTableSkeleton rows={5} cols={5} />
        ) : error ? (
          <AdminError message={(error as Error).message} />
        ) : visible.length === 0 ? (
          <AdminEmpty
            icon={Monitor}
            title={filter === "revoked" ? "No revoked sessions" : "No sessions to show"}
            description={
              search
                ? "No session matches that search."
                : "Sessions appear here as administrators sign in to the CMS."
            }
          />
        ) : (
          <AdminTable
            head={
              <>
                <th scope="col">Administrator</th>
                <th scope="col">Device</th>
                <th scope="col">Signed in</th>
                <th scope="col">Last active</th>
                <th scope="col" className="text-right">
                  <span className="sr-only">Actions</span>
                </th>
              </>
            }
          >
            {visible.map((row) => {
              const device = describeDevice(row.user_agent);
              const isCurrent = row.session_id === currentSessionId;
              const online = isOnline(row);
              return (
                <AdminRow key={row.session_id}>
                  <td>
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-2 font-medium">
                        {row.email}
                        {isCurrent && (
                          <span className="status-pill bg-info-soft text-info-foreground ring-info-border">
                            This device
                          </span>
                        )}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            online ? "bg-success" : "bg-muted-foreground/40",
                          )}
                          aria-hidden="true"
                        />
                        {row.revoked_at ? "Revoked" : online ? "Online" : "Idle"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <device.Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {device.label}
                    </span>
                  </td>
                  <td className="text-sm text-muted-foreground">{formatDate(row.created_at)}</td>
                  <td className="text-sm text-muted-foreground">
                    {row.revoked_at ? (
                      <StatusBadge status="revoked" />
                    ) : (
                      relativeTime(row.last_seen_at)
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex justify-end gap-2">
                      {!row.revoked_at && !isCurrent && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPendingRevoke(row)}
                            disabled={revokeOne.isPending}
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                            Sign out
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPendingAccount(row)}
                            disabled={revokeAccount.isPending}
                          >
                            Sign out account
                          </Button>
                        </>
                      )}
                      {isCurrent && (
                        <span className="text-xs text-muted-foreground">Current session</span>
                      )}
                    </div>
                  </td>
                </AdminRow>
              );
            })}
          </AdminTable>
        )}
      </AdminCard>

      <AlertDialog
        open={Boolean(pendingRevoke)}
        onOpenChange={(open) => !open && setPendingRevoke(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out this session?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRevoke?.email} loses CMS access on that device immediately, and the browser is
              signed out within a minute. They can sign in again with their password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRevoke) revokeOne.mutate(pendingRevoke);
                setPendingRevoke(null);
              }}
            >
              Sign out session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(pendingAccount)}
        onOpenChange={(open) => !open && setPendingAccount(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out every session for this account?</AlertDialogTitle>
            <AlertDialogDescription>
              All devices signed in as {pendingAccount?.email} will lose CMS access. Your own
              session stays signed in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingAccount) revokeAccount.mutate(pendingAccount);
                setPendingAccount(null);
              }}
            >
              Sign out everywhere
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
