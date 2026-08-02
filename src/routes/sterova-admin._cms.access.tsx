import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { History, Loader2, ShieldCheck, Trash2, UserPlus } from "lucide-react";
import {
  AdminCard,
  AdminCardHeader,
  AdminEmpty,
  AdminError,
  AdminPageHeading,
  AdminRow,
  AdminSearch,
  AdminTable,
  AdminTableSkeleton,
  AdminToolbar,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminAssignRole,
  adminFetchAuditLogs,
  adminFetchUserRoles,
  adminRevokeRole,
  recordAudit,
} from "@/lib/cms-api";
import { exportToCsv } from "@/lib/export";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { AppRole, UserRoleRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/access")({
  head: () => privateSeo("Access & audit · CMS"),
  component: () => <AccessPage />,
});

const ROLES: AppRole[] = ["super_admin", "admin", "editor"];

const ROLE_HINTS: Record<AppRole, string> = {
  super_admin: "Full control, including role management",
  admin: "Manage all content, leads and settings",
  editor: "Create and edit content only",
};

function AccessPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState<AppRole>("editor");
  const [search, setSearch] = useState("");

  const roles = useQuery({
    queryKey: ["admin", "user-roles"],
    queryFn: adminFetchUserRoles,
    retry: false,
  });
  const logs = useQuery({
    queryKey: ["admin", "audit-logs"],
    queryFn: () => adminFetchAuditLogs(),
    retry: false,
  });

  const filteredLogs = useMemo(() => {
    const list = logs.data ?? [];
    const term = search.trim().toLowerCase();
    if (!term) return list;
    return list.filter((row) =>
      [row.action, row.entity, row.actor_email, row.summary]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [logs.data, search]);

  const assign = useMutation({
    mutationFn: async () => {
      await adminAssignRole(userId.trim(), role);
      await recordAudit({
        action: "grant_role",
        entity: "user_roles",
        entity_id: userId.trim(),
        summary: role,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "user-roles"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      setUserId("");
      toast({ title: "Role granted" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not grant role", description: err.message, variant: "destructive" }),
  });

  const revoke = useMutation({
    mutationFn: async (row: UserRoleRow) => {
      await adminRevokeRole(row.id);
      await recordAudit({
        action: "revoke_role",
        entity: "user_roles",
        entity_id: row.user_id,
        summary: row.role,
      });
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "user-roles"] });
      void queryClient.invalidateQueries({ queryKey: ["admin", "audit-logs"] });
      toast({ title: "Role revoked" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not revoke role", description: err.message, variant: "destructive" }),
  });

  return (
    <>
      <AdminPageHeading
        eyebrow="Security"
        title="Access & audit"
        description="Grant admin roles and review every change made in the CMS."
      />

      <div className="space-y-6">
        {roles.error ? (
          <AdminError message={(roles.error as Error).message} />
        ) : (
          <AdminCard>
            <AdminCardHeader
              title="Roles"
              description="Roles are stored separately from profiles and checked server-side"
            />
            <div className="grid grid-cols-1 gap-4 border-b border-border/70 p-5 sm:grid-cols-[1fr_12rem_auto] sm:items-end">
              <div className="space-y-1.5">
                <Label htmlFor="role-user">User ID</Label>
                <Input
                  id="role-user"
                  placeholder="auth user UUID"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="role-select">Role</Label>
                <select
                  id="role-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value as AppRole)}
                  className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm"
                >
                  {ROLES.map((value) => (
                    <option key={value} value={value}>
                      {value.replace("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
              <Button disabled={assign.isPending || !userId.trim()} onClick={() => assign.mutate()}>
                {assign.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                Grant role
              </Button>
              <p className="text-xs text-muted-foreground sm:col-span-3">{ROLE_HINTS[role]}</p>
            </div>

            {roles.isLoading ? (
              <AdminTableSkeleton cols={3} />
            ) : (roles.data?.length ?? 0) === 0 ? (
              <AdminEmpty
                icon={ShieldCheck}
                title="No roles granted"
                description="Grant a role to give a teammate CMS access."
              />
            ) : (
              <AdminTable
                head={
                  <>
                    <th>User</th>
                    <th>Role</th>
                    <th>Granted</th>
                    <th className="text-right">Actions</th>
                  </>
                }
              >
                {roles.data?.map((row) => (
                  <AdminRow key={row.id}>
                    <td className="font-mono text-xs">{row.user_id}</td>
                    <td>
                      <StatusBadge status={row.role} />
                    </td>
                    <td className="text-xs text-muted-foreground">{formatDate(row.created_at)}</td>
                    <td className="text-right">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Revoke role"
                        onClick={() => revoke.mutate(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </AdminRow>
                ))}
              </AdminTable>
            )}
          </AdminCard>
        )}

        {logs.error ? (
          <AdminError message={(logs.error as Error).message} />
        ) : (
          <AdminCard>
            <AdminCardHeader title="Audit log" description="The 200 most recent CMS actions" />
            <AdminToolbar>
              <AdminSearch value={search} onChange={setSearch} placeholder="Search audit log…" />
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                disabled={!filteredLogs.length}
                onClick={() =>
                  exportToCsv("audit-log", filteredLogs, [
                    { header: "When", value: (r) => r.created_at },
                    { header: "Actor", value: (r) => r.actor_email ?? r.actor_id ?? "" },
                    { header: "Action", value: (r) => r.action },
                    { header: "Entity", value: (r) => r.entity },
                    { header: "Entity ID", value: (r) => r.entity_id ?? "" },
                    { header: "Summary", value: (r) => r.summary ?? "" },
                  ])
                }
              >
                Export CSV
              </Button>
            </AdminToolbar>

            {logs.isLoading ? (
              <AdminTableSkeleton cols={4} />
            ) : filteredLogs.length === 0 ? (
              <AdminEmpty
                icon={History}
                title="No activity recorded"
                description="Content changes made from the CMS are logged here."
              />
            ) : (
              <AdminTable
                head={
                  <>
                    <th>When</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Entity</th>
                  </>
                }
              >
                {filteredLogs.map((row) => (
                  <AdminRow key={row.id}>
                    <td className="whitespace-nowrap text-xs text-muted-foreground">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="text-sm">{row.actor_email ?? "—"}</td>
                    <td>
                      <StatusBadge status={row.action} />
                    </td>
                    <td className="text-sm text-muted-foreground">
                      {row.entity}
                      {row.summary ? ` · ${row.summary}` : ""}
                    </td>
                  </AdminRow>
                ))}
              </AdminTable>
            )}
          </AdminCard>
        )}
      </div>
    </>
  );
}
