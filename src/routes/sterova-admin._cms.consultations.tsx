import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarCheck2,
  CalendarClock,
  Clock,
  Loader2,
  Mail,
  Phone,
  Save,
  Trash2,
} from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  adminDeleteConsultation,
  adminFetchConsultations,
  adminSetConsultationStatus,
  adminUpdateConsultation,
} from "@/lib/chatbot/admin-api";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ConsultationBookingRow, ConsultationStatus } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/consultations")({
  head: () => privateSeo("Consultations · CMS"),
  component: () => <AdminConsultationsPage />,
});

const STATUSES: ConsultationStatus[] = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "no_show",
];
const STATUS_LABEL: Record<ConsultationStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
};
type Filter = "all" | ConsultationStatus;

function AdminConsultationsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ConsultationBookingRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "consultations"],
    queryFn: adminFetchConsultations,
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["admin", "consultations"] });

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: data?.length ?? 0 };
    for (const status of STATUSES) {
      base[status] = data?.filter((row) => row.status === status).length ?? 0;
    }
    return base;
  }, [data]);

  const upcoming = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (data ?? []).filter(
      (row) =>
        row.preferred_date &&
        row.preferred_date >= today &&
        (row.status === "pending" || row.status === "confirmed"),
    ).length;
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!term) return true;
      return [row.name, row.email, row.phone, row.topic, row.notes]
        .filter(Boolean)
        .some((field) => (field as string).toLowerCase().includes(term));
    });
  }, [data, search, filter]);

  const selected = useMemo(
    () => (data ?? []).find((row) => row.id === selectedId) ?? null,
    [data, selectedId],
  );

  useEffect(() => {
    setNotes(selected?.admin_notes ?? "");
  }, [selected?.id, selected?.admin_notes]);

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ConsultationStatus }) =>
      adminSetConsultationStatus(id, status),
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({
        title: "Could not update booking",
        description: err.message,
        variant: "destructive",
      }),
  });

  const saveNotes = useMutation({
    mutationFn: ({ id, admin_notes }: { id: string; admin_notes: string }) =>
      adminUpdateConsultation(id, { admin_notes: admin_notes.trim() || null }),
    onSuccess: () => {
      invalidate();
      toast({ title: "Notes saved" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save notes", description: err.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: adminDeleteConsultation,
    onSuccess: (_d, id) => {
      setPendingDelete(null);
      if (selectedId === id) setSelectedId(null);
      invalidate();
      toast({ title: "Booking deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete booking",
        description: err.message,
        variant: "destructive",
      }),
  });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeading
        eyebrow="Chatbot"
        title="Consultations"
        description="Free 30-minute consultation requests booked through the assistant."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total bookings" value={counts.all ?? 0} icon={CalendarClock} accent />
        <StatTile label="Pending" value={counts.pending ?? 0} icon={Clock} />
        <StatTile label="Confirmed" value={counts.confirmed ?? 0} icon={CalendarCheck2} />
        <StatTile label="Upcoming" value={upcoming} icon={CalendarClock} />
      </div>

      <AdminCard>
        <AdminToolbar>
          <AdminSearch
            value={search}
            onChange={setSearch}
            placeholder="Search name, email, topic…"
          />
          <AdminFilterTabs<Filter>
            value={filter}
            onChange={setFilter}
            label="Filter bookings by status"
            options={[
              { value: "all", label: "All", count: counts.all },
              ...STATUSES.map((status) => ({
                value: status as Filter,
                label: STATUS_LABEL[status],
                count: counts[status],
              })),
            ]}
          />
        </AdminToolbar>

        {isLoading ? (
          <AdminTableSkeleton rows={6} cols={5} />
        ) : error ? (
          <div className="p-5">
            <AdminError message={(error as Error).message} />
          </div>
        ) : filtered.length === 0 ? (
          <AdminEmpty
            icon={CalendarClock}
            title="No consultations booked yet"
            description="Bookings made inside the chatbot will appear here."
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Contact</th>
                <th>Topic</th>
                <th>Preferred slot</th>
                <th>Status</th>
                <th>Requested</th>
              </>
            }
          >
            {filtered.map((row) => (
              <AdminRow
                key={row.id}
                onClick={() => setSelectedId(row.id)}
                className="cursor-pointer"
              >
                <td>
                  <p className="font-medium">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </td>
                <td className="text-muted-foreground">{row.topic ?? "—"}</td>
                <td className="whitespace-nowrap text-muted-foreground">
                  {row.preferred_date ?? "—"}
                  {row.preferred_time ? ` · ${row.preferred_time}` : ""}
                </td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(row.created_at)}
                </td>
              </AdminRow>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-2">
                  {selected.name}
                  <StatusBadge status={selected.status} />
                </DialogTitle>
                <DialogDescription>Requested {formatDate(selected.created_at)}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { icon: Mail, value: selected.email },
                    { icon: Phone, value: selected.phone },
                    {
                      icon: CalendarClock,
                      value: [selected.preferred_date, selected.preferred_time]
                        .filter(Boolean)
                        .join(" · "),
                    },
                  ]
                    .filter((item) => Boolean(item.value))
                    .map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
                        >
                          <Icon className="h-3 w-3" aria-hidden="true" />
                          {item.value}
                        </span>
                      );
                    })}
                </div>

                {selected.topic && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Topic:</span> {selected.topic}
                  </p>
                )}

                {selected.notes && (
                  <p className="whitespace-pre-wrap border-t border-border/70 pt-4 leading-relaxed">
                    {selected.notes}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
                  <span className="text-xs font-medium text-muted-foreground">Status</span>
                  {STATUSES.map((status) => (
                    <Button
                      key={status}
                      type="button"
                      size="sm"
                      variant={selected.status === status ? "gradient" : "outline"}
                      disabled={setStatus.isPending}
                      onClick={() => setStatus.mutate({ id: selected.id, status })}
                    >
                      {STATUS_LABEL[status]}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-col gap-2 border-t border-border/70 pt-4">
                  <Label htmlFor="booking-notes">Internal notes</Label>
                  <Textarea
                    id="booking-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Meeting link, prep notes, outcome…"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="self-start"
                    disabled={saveNotes.isPending || notes === (selected.admin_notes ?? "")}
                    onClick={() => saveNotes.mutate({ id: selected.id, admin_notes: notes })}
                  >
                    {saveNotes.isPending ? (
                      <>
                        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> Saving…
                      </>
                    ) : (
                      <>
                        <Save className="mr-1.5 h-4 w-4" /> Save notes
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
                  <Button asChild size="sm" variant="gradient">
                    <a href={`mailto:${selected.email}?subject=Your Sterova consultation`}>
                      <Mail className="mr-1.5 h-4 w-4" /> Email
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <a href={`tel:${selected.phone}`}>
                      <Phone className="mr-1.5 h-4 w-4" /> Call
                    </a>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="text-destructive"
                    onClick={() => setPendingDelete(selected)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name}&rsquo;s consultation request will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && remove.mutate(pendingDelete.id)}
              disabled={remove.isPending}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
