import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import type { AuditLog } from "@/types";

export const metadata: Metadata = { title: "Audit Log" };

async function getLogs(): Promise<AuditLog[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function AdminAuditPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const logs = await getLogs();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display">Audit Log</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Last 200 admin actions</p>
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm rounded-2xl border bg-background">
          No audit logs yet.
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Action</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Resource</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Actor</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs">{log.action}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                    {log.resource ? `${log.resource}${log.resource_id ? `/${log.resource_id.slice(0, 8)}` : ""}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">{log.actor_email ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{formatDate(log.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
