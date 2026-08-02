import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BellRing, CheckCheck, Trash2 } from "lucide-react";
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
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import {
  adminDeleteNotification,
  adminFetchNotifications,
  adminMarkAllNotificationsRead,
  adminMarkNotificationRead,
} from "@/lib/cms-api";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { AdminNotificationRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/notifications")({
  head: () => privateSeo("Notifications · CMS"),
  component: () => <NotificationsPage />,
});

type Filter = "all" | "unread" | "read";

function NotificationsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: () => adminFetchNotifications(),
    retry: false,
  });

  const rows = useMemo(() => {
    const list = data ?? [];
    const term = search.trim().toLowerCase();
    return list.filter((row) => {
      if (filter === "unread" && row.is_read) return false;
      if (filter === "read" && !row.is_read) return false;
      if (!term) return true;
      return [row.title, row.body, row.kind]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [data, filter, search]);

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] });

  const markRead = useMutation({
    mutationFn: (input: { row: AdminNotificationRow; isRead: boolean }) =>
      adminMarkNotificationRead(input.row.id, input.isRead),
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  const markAll = useMutation({
    mutationFn: adminMarkAllNotificationsRead,
    onSuccess: () => {
      invalidate();
      toast({ title: "All notifications marked as read" });
    },
    onError: (err: Error) =>
      toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: (row: AdminNotificationRow) => adminDeleteNotification(row.id),
    onSuccess: invalidate,
  });

  const unread = data?.filter((row) => !row.is_read).length ?? 0;

  return (
    <>
      <AdminPageHeading
        eyebrow="Activity"
        title="Notifications"
        description="New leads, bookings, estimates and applications as they arrive."
        actions={
          <Button size="sm" variant="outline" disabled={!unread} onClick={() => markAll.mutate()}>
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : (
        <AdminCard>
          <AdminToolbar>
            <AdminSearch value={search} onChange={setSearch} placeholder="Search notifications…" />
            <AdminFilterTabs
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All", count: data?.length },
                { value: "unread", label: "Unread", count: unread },
                { value: "read", label: "Read", count: (data?.length ?? 0) - unread },
              ]}
            />
          </AdminToolbar>

          {isLoading ? (
            <AdminTableSkeleton cols={4} />
          ) : rows.length === 0 ? (
            <AdminEmpty
              icon={BellRing}
              title="Nothing to show"
              description="Notifications appear here when visitors submit forms or book calls."
            />
          ) : (
            <AdminTable
              head={
                <>
                  <th>Notification</th>
                  <th>Type</th>
                  <th>Received</th>
                  <th className="text-right">Actions</th>
                </>
              }
            >
              {rows.map((row) => (
                <AdminRow key={row.id} className={row.is_read ? "opacity-70" : undefined}>
                  <td className="max-w-lg">
                    <p className="font-medium">{row.title}</p>
                    {row.body && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">{row.body}</p>
                    )}
                    {row.link && (
                      <a href={row.link} className="text-xs text-primary hover:underline">
                        Open
                      </a>
                    )}
                  </td>
                  <td>
                    <StatusBadge status={row.kind} />
                  </td>
                  <td className="text-xs text-muted-foreground">{formatDate(row.created_at)}</td>
                  <td>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markRead.mutate({ row, isRead: !row.is_read })}
                      >
                        {row.is_read ? "Mark unread" : "Mark read"}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Delete notification"
                        onClick={() => remove.mutate(row)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </AdminRow>
              ))}
            </AdminTable>
          )}
        </AdminCard>
      )}
    </>
  );
}
