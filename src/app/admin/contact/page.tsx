import type { Metadata } from "next";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/types";

export const metadata: Metadata = { title: "Contact Messages" };

async function getMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    return data ?? [];
  } catch {
    return [];
  }
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  read: "bg-secondary text-muted-foreground",
  replied: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  archived: "bg-secondary text-muted-foreground/60",
};

export default async function AdminContactPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");
  const messages = await getMessages();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display">Contact Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {messages.filter(m => m.status === "new").length} new · {messages.length} total
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm rounded-2xl border bg-background">
          No messages yet.
        </div>
      ) : (
        <div className="rounded-2xl border overflow-hidden bg-background">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/30">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Service</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden lg:table-cell">Budget</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground hidden xl:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {messages.map(msg => (
                <tr key={msg.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 font-medium">{msg.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    <a href={`mailto:${msg.email}`} className="hover:text-primary transition-colors">{msg.email}</a>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{msg.service ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{msg.budget ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize", STATUS_COLORS[msg.status] ?? "bg-secondary")}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden xl:table-cell whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
