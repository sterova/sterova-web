import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Building2,
  CalendarRange,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Trash2,
  Trophy,
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
  adminDeleteChatbotLead,
  adminFetchChatbotLeads,
  adminSetChatbotLeadStatus,
  adminUpdateChatbotLead,
} from "@/lib/chatbot/admin-api";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ChatbotLeadRow, ChatbotLeadStatus } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/chat-leads")({
  head: () => privateSeo("Chat Leads · CMS"),
  component: () => <AdminChatLeadsPage />,
});

const STATUSES: ChatbotLeadStatus[] = ["new", "contacted", "qualified", "won", "lost", "spam"];
type Filter = "all" | ChatbotLeadStatus;

function AdminChatLeadsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ChatbotLeadRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "chatbot-leads"],
    queryFn: adminFetchChatbotLeads,
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["admin", "chatbot-leads"] });

  const counts = useMemo(() => {
    const base: Record<string, number> = { all: data?.length ?? 0 };
    for (const status of STATUSES) {
      base[status] = data?.filter((lead) => lead.status === status).length ?? 0;
    }
    return base;
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((lead) => {
      if (filter !== "all" && lead.status !== filter) return false;
      if (!term) return true;
      return [lead.name, lead.email, lead.company, lead.service, lead.message]
        .filter(Boolean)
        .some((field) => (field as string).toLowerCase().includes(term));
    });
  }, [data, search, filter]);

  const selected = useMemo(
    () => (data ?? []).find((lead) => lead.id === selectedId) ?? null,
    [data, selectedId],
  );

  useEffect(() => {
    setNotes(selected?.admin_notes ?? "");
  }, [selected?.id, selected?.admin_notes]);

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ChatbotLeadStatus }) =>
      adminSetChatbotLeadStatus(id, status),
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({ title: "Could not update lead", description: err.message, variant: "destructive" }),
  });

  const saveNotes = useMutation({
    mutationFn: ({ id, admin_notes }: { id: string; admin_notes: string }) =>
      adminUpdateChatbotLead(id, { admin_notes: admin_notes.trim() || null }),
    onSuccess: () => {
      invalidate();
      toast({ title: "Notes saved" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save notes", description: err.message, variant: "destructive" }),
  });

  const remove = useMutation({
    mutationFn: adminDeleteChatbotLead,
    onSuccess: (_d, id) => {
      setPendingDelete(null);
      if (selectedId === id) setSelectedId(null);
      invalidate();
      toast({ title: "Lead deleted" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not delete lead", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeading
        eyebrow="Chatbot"
        title="Chat leads"
        description="Quote requests captured by the scripted assistant, newest first."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile label="Total leads" value={counts.all ?? 0} icon={MessageSquare} accent />
        <StatTile label="New" value={counts.new ?? 0} icon={Mail} />
        <StatTile label="Qualified" value={counts.qualified ?? 0} icon={CheckCircle2} />
        <StatTile label="Won" value={counts.won ?? 0} icon={Trophy} />
      </div>

      <AdminCard>
        <AdminToolbar>
          <AdminSearch
            value={search}
            onChange={setSearch}
            placeholder="Search name, email, company…"
          />
          <AdminFilterTabs<Filter>
            value={filter}
            onChange={setFilter}
            label="Filter leads by status"
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
            icon={MessageSquare}
            title="No chat leads yet"
            description="Quote requests submitted inside the chatbot will land here."
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Contact</th>
                <th>Service</th>
                <th>Timeline</th>
                <th>Status</th>
                <th>Received</th>
              </>
            }
          >
            {filtered.map((lead) => (
              <AdminRow
                key={lead.id}
                onClick={() => setSelectedId(lead.id)}
                className="cursor-pointer"
              >
                <td>
                  <p className="font-medium">{lead.name}</p>
                  <p className="text-xs text-muted-foreground">{lead.email}</p>
                </td>
                <td className="text-muted-foreground">{lead.service ?? "—"}</td>
                <td className="text-muted-foreground">{lead.timeline ?? "—"}</td>
                <td>
                  <StatusBadge status={lead.status} />
                </td>
                <td className="whitespace-nowrap text-xs text-muted-foreground">
                  {formatDate(lead.created_at)}
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
                <DialogDescription>Received {formatDate(selected.created_at)}</DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 text-sm">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { icon: Mail, value: selected.email },
                    { icon: Phone, value: selected.phone },
                    { icon: Building2, value: selected.company },
                    { icon: CalendarRange, value: selected.timeline },
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

                {selected.service && (
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Service:</span> {selected.service}
                  </p>
                )}

                <p className="whitespace-pre-wrap border-t border-border/70 pt-4 leading-relaxed">
                  {selected.message}
                </p>

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
                  <Label htmlFor="lead-notes">Internal notes</Label>
                  <Textarea
                    id="lead-notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Context for your team — never shown to the lead."
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
                    <a href={`mailto:${selected.email}?subject=Re: your Sterova enquiry`}>
                      <Mail className="mr-1.5 h-4 w-4" /> Reply by email
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
            <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name}&rsquo;s enquiry will be permanently removed. This cannot be
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
