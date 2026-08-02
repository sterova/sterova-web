import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calculator, CheckCircle2, Loader2, Mail, Phone, Save, Trash2, Trophy } from "lucide-react";
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
  adminDeleteEstimatorSubmission,
  adminFetchEstimatorSubmissions,
  adminSetEstimatorStatus,
  adminUpdateEstimatorSubmission,
} from "@/lib/estimator-api";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ChatbotLeadStatus, EstimatorSubmissionRow } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/estimates")({
  head: () => privateSeo("Estimator Requests · CMS"),
  component: () => <AdminEstimatesPage />,
});

const STATUSES: ChatbotLeadStatus[] = ["new", "contacted", "qualified", "won", "lost", "spam"];
type Filter = "all" | ChatbotLeadStatus;

function AdminEstimatesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [pendingDelete, setPendingDelete] = useState<EstimatorSubmissionRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "estimator-submissions"],
    queryFn: adminFetchEstimatorSubmissions,
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["admin", "estimator-submissions"] });

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: data?.length ?? 0 };
    for (const status of STATUSES) {
      base[status] = data?.filter((row) => row.status === status).length ?? 0;
    }
    return base;
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!term) return true;
      return [row.name, row.email, row.phone, row.project_type]
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
    mutationFn: ({ id, status }: { id: string; status: ChatbotLeadStatus }) =>
      adminSetEstimatorStatus(id, status),
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({
        title: "Could not update request",
        description: err.message,
        variant: "destructive",
      }),
  });

  const saveNotes = useMutation({
    mutationFn: ({ id, admin_notes }: { id: string; admin_notes: string }) =>
      adminUpdateEstimatorSubmission(id, { admin_notes: admin_notes.trim() || null }),
    onSuccess: () => {
      invalidate();
      toast({ title: "Notes saved" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save notes", description: err.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: adminDeleteEstimatorSubmission,
    onSuccess: (_d, id) => {
      setPendingDelete(null);
      if (selectedId === id) setSelectedId(null);
      invalidate();
      toast({ title: "Request deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete request",
        description: err.message,
        variant: "destructive",
      }),
  });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeading
        eyebrow="Chatbot"
        title="Estimator requests"
        description="Submissions from the public Project Estimator, newest first."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total requests" value={counts.all ?? 0} icon={Calculator} accent />
        <StatTile label="New" value={counts.new ?? 0} icon={Mail} />
        <StatTile label="Qualified" value={counts.qualified ?? 0} icon={CheckCircle2} />
        <StatTile label="Won" value={counts.won ?? 0} icon={Trophy} />
      </div>

      <AdminCard>
        <AdminToolbar>
          <AdminSearch
            value={search}
            onChange={setSearch}
            placeholder="Search name, email, project type…"
          />
          <AdminFilterTabs<Filter>
            value={filter}
            onChange={setFilter}
            label="Filter requests by status"
            options={[
              { value: "all", label: "All", count: counts.all },
              ...STATUSES.map((status) => ({
                value: status as Filter,
                label: status[0].toUpperCase() + status.slice(1),
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
            icon={Calculator}
            title="No estimator requests yet"
            description="Estimates submitted on /estimate will land here."
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Contact</th>
                <th>Project</th>
                <th>Estimate</th>
                <th>Status</th>
                <th>Received</th>
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
                  <p className="font-medium">{row.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">{row.email}</p>
                </td>
                <td className="text-muted-foreground">{row.project_type}</td>
                <td className="text-muted-foreground">
                  {row.estimate_cost ?? "—"}
                  {row.estimate_weeks ? ` · ${row.estimate_weeks} wks` : ""}
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
                  {selected.name ?? selected.email}
                  <StatusBadge status={selected.status} />
                </DialogTitle>
                <DialogDescription>Received {formatDate(selected.created_at)}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { icon: Mail, value: selected.email },
                    { icon: Phone, value: selected.phone },
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

                <dl className="grid gap-2 border-t border-border/70 pt-4 text-xs sm:grid-cols-2">
                  {[
                    { label: "Project type", value: selected.project_type },
                    { label: "Design need", value: selected.design_need ?? "—" },
                    { label: "Timeline preference", value: selected.timeline_pref ?? "—" },
                    { label: "Estimated cost", value: selected.estimate_cost ?? "—" },
                    { label: "Estimated weeks", value: selected.estimate_weeks ?? "—" },
                    {
                      label: "Features",
                      value: selected.features.length ? selected.features.join(", ") : "—",
                    },
                  ].map((item) => (
                    <div key={item.label}>
                      <dt className="font-medium text-muted-foreground">{item.label}</dt>
                      <dd className="text-foreground">{item.value}</dd>
                    </div>
                  ))}
                </dl>

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
                      {status[0].toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>

                <div className="flex flex-col gap-2 border-t border-border/70 pt-4">
                  <Label htmlFor="estimate-notes">Internal notes</Label>
                  <Textarea
                    id="estimate-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Context for your team — never shown to the requester."
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
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => setPendingDelete(selected)}
                  >
                    <Trash2 className="mr-1.5 h-4 w-4" /> Delete request
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
            <AlertDialogTitle>Delete this estimator request?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the submission from {pendingDelete?.email}. This cannot be
              undone.
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
