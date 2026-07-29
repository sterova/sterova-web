import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, Briefcase, Loader2, Mail, MailOpen, Reply, Save, Trash2 } from "lucide-react";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeading,
  AdminSearch,
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
  adminDeleteMessage,
  adminFetchMessages,
  adminSetMessageStatus,
  adminUpdateMessage,
} from "@/lib/api";
import { cn, formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import type { ContactMessageRow, ContactStatus } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/messages")({
  head: () => privateSeo("Messages · CMS"),
  component: () => <AdminMessagesPage />,
});

type Filter = "all" | "new" | "read" | "replied" | "archived";
type Kind = "all" | "contact" | "service";

/** Service enquiries are tagged `source`; legacy rows fall back to the subject. */
function isServiceMessage(m: ContactMessageRow): boolean {
  return m.source === "service" || /^service enquiry/i.test(m.subject ?? "");
}

function serviceLabel(m: ContactMessageRow): string | null {
  if (m.service_title) return m.service_title;
  const match = (m.subject ?? "").match(/^service enquiry\s*[—-]\s*(.+)$/i);
  return match ? match[1] : null;
}

function ServiceTag({ message }: { message: ContactMessageRow }) {
  if (!isServiceMessage(message)) return null;
  const label = serviceLabel(message);
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
      <Briefcase className="h-3 w-3" aria-hidden="true" />
      {label ?? "Service enquiry"}
    </span>
  );
}

/** Compact key/value chips so an enquiry reads at a glance. */
function MetaChips({ message }: { message: ContactMessageRow }) {
  const items = [
    message.company && { label: "Company", value: message.company },
    message.phone && { label: "Phone", value: message.phone },
  ].filter(Boolean) as { label: string; value: string }[];

  if (items.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item.label}
          className="rounded-md border border-border/70 bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
        >
          <span className="font-medium text-foreground">{item.label}:</span> {item.value}
        </span>
      ))}
    </div>
  );
}

/** True once the viewport is at Tailwind's `lg` breakpoint or wider. */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => setIsDesktop(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  return isDesktop;
}

function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isDesktop = useIsDesktop();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [kind, setKind] = useState<Kind>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [pendingDelete, setPendingDelete] = useState<ContactMessageRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: adminFetchMessages,
  });

  const invalidate = () => void queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });

  const counts = useMemo(
    () => ({
      all: data?.length ?? 0,
      new: data?.filter((m) => m.status === "new").length ?? 0,
      read: data?.filter((m) => m.status === "read").length ?? 0,
      replied: data?.filter((m) => m.status === "replied").length ?? 0,
      archived: data?.filter((m) => m.status === "archived").length ?? 0,
      service: data?.filter(isServiceMessage).length ?? 0,
      contact: data?.filter((m) => !isServiceMessage(m)).length ?? 0,
    }),
    [data],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (kind === "service" && !isServiceMessage(m)) return false;
      if (kind === "contact" && isServiceMessage(m)) return false;
      if (!term) return true;
      return (
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        (m.subject ?? "").toLowerCase().includes(term) ||
        (serviceLabel(m) ?? "").toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term)
      );
    });
  }, [data, search, filter, kind]);

  const selected = useMemo(
    () => filtered.find((m) => m.id === selectedId) ?? null,
    [filtered, selectedId],
  );

  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ContactStatus }) =>
      adminSetMessageStatus(id, status),
    onSuccess: invalidate,
    onError: (err: Error) =>
      toast({
        title: "Could not update message",
        description: err.message,
        variant: "destructive",
      }),
  });

  const saveNote = useMutation({
    mutationFn: ({ id, admin_note }: { id: string; admin_note: string }) =>
      adminUpdateMessage(id, { admin_note: admin_note.trim() || null }),
    onSuccess: () => {
      invalidate();
      toast({ title: "Note saved" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not save note",
        description: err.message,
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteMessage,
    onSuccess: (_d, id) => {
      setPendingDelete(null);
      if (selectedId === id) setSelectedId(null);
      invalidate();
      toast({ title: "Message deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete message",
        description: err.message,
        variant: "destructive",
      }),
  });

  // Keep the note editor in sync with whichever message is open.
  useEffect(() => {
    setNote(selected?.admin_note ?? "");
  }, [selected?.id, selected?.admin_note]);

  // Opening a brand-new message marks it read so the unread count stays honest.
  const openMessage = (message: ContactMessageRow) => {
    setSelectedId(message.id);
    if (message.status === "new") {
      setStatus.mutate({ id: message.id, status: "read" });
    }
  };

  const detail = selected ? (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display font-semibold">{selected.subject || "No subject"}</h2>
            <StatusBadge status={selected.status} />
            <ServiceTag message={selected} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {selected.name} ·{" "}
            <a href={`mailto:${selected.email}`} className="text-primary hover:underline">
              {selected.email}
            </a>
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Received {formatDate(selected.created_at)}
          </p>
          <div className="mt-3">
            <MetaChips message={selected} />
          </div>
        </div>
      </div>

      <p className="whitespace-pre-wrap border-t border-border/70 pt-4 text-sm leading-relaxed">
        {selected.message}
      </p>

      <div className="flex flex-col gap-2 border-t border-border/70 pt-4">
        <Label htmlFor="admin-note">Internal note</Label>
        <Textarea
          id="admin-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          placeholder="Context for your team — never shown to the sender."
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="self-start"
          disabled={saveNote.isPending || note === (selected.admin_note ?? "")}
          onClick={() => saveNote.mutate({ id: selected.id, admin_note: note })}
        >
          {saveNote.isPending ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="mr-1.5 h-4 w-4" />
              Save note
            </>
          )}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
        <Button asChild size="sm" variant="gradient">
          <a
            href={`mailto:${selected.email}?subject=${encodeURIComponent(
              selected.subject ? `Re: ${selected.subject}` : "Re: your enquiry",
            )}`}
          >
            <Reply className="mr-1.5 h-4 w-4" />
            Reply by email
          </a>
        </Button>
        {selected.status !== "replied" && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={setStatus.isPending}
            onClick={() => setStatus.mutate({ id: selected.id, status: "replied" })}
          >
            <MailOpen className="mr-1.5 h-4 w-4" />
            Mark replied
          </Button>
        )}
        {selected.status !== "archived" ? (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={setStatus.isPending}
            onClick={() => setStatus.mutate({ id: selected.id, status: "archived" })}
          >
            <Archive className="mr-1.5 h-4 w-4" />
            Archive
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={setStatus.isPending}
            onClick={() => setStatus.mutate({ id: selected.id, status: "read" })}
          >
            <Mail className="mr-1.5 h-4 w-4" />
            Unarchive
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={`Delete message from ${selected.name}`}
          className="ml-auto text-muted-foreground hover:text-destructive"
          onClick={() => setPendingDelete(selected)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <AdminPageHeading
        eyebrow="Inbox"
        title="Messages"
        description={`${counts.new} unread · ${counts.contact} contact · ${counts.service} service enquiries.`}
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : (
        <AdminCard>
          <AdminToolbar>
            <AdminSearch
              value={search}
              onChange={setSearch}
              placeholder="Search name, email or message…"
            />
            <AdminFilterTabs
              label="Filter messages"
              value={filter}
              onChange={setFilter}
              options={[
                { value: "all", label: "All", count: counts.all },
                { value: "new", label: "New", count: counts.new },
                { value: "read", label: "Read", count: counts.read },
                { value: "replied", label: "Replied", count: counts.replied },
                { value: "archived", label: "Archived", count: counts.archived },
              ]}
            />
          </AdminToolbar>
          <AdminToolbar>
            <AdminFilterTabs
              label="Filter by message type"
              value={kind}
              onChange={setKind}
              options={[
                { value: "all", label: "All types", count: counts.all },
                { value: "contact", label: "Contact", count: counts.contact },
                { value: "service", label: "Service enquiries", count: counts.service },
              ]}
            />
          </AdminToolbar>

          {isLoading ? (
            <AdminTableSkeleton rows={6} cols={3} />
          ) : filtered.length === 0 ? (
            <AdminEmpty
              title={counts.all === 0 ? "Inbox is empty" : "Nothing matches here"}
              description={
                counts.all === 0
                  ? "Enquiries sent through the contact form will appear here."
                  : "Try another search term or filter."
              }
              icon={Mail}
            />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
              {/* List */}
              <ul className="max-h-[70vh] divide-y divide-border/70 overflow-y-auto border-b border-border/70 lg:border-b-0 lg:border-r">
                {filtered.map((m) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => openMessage(m)}
                      aria-current={selectedId === m.id ? "true" : undefined}
                      className={cn(
                        "w-full text-left px-4 py-3.5 transition-colors hover:bg-muted/40",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                        selectedId === m.id && "bg-primary/5",
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "truncate text-sm",
                            m.status === "new" ? "font-semibold" : "font-medium",
                          )}
                        >
                          {m.name}
                        </span>
                        <StatusBadge status={m.status} />
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <ServiceTag message={m} />
                      </div>

                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {m.subject || m.message}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {formatDate(m.created_at)}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>

              {/* Detail — split pane on large screens */}
              <div className="hidden lg:block">
                {detail ?? (
                  <AdminEmpty
                    title="Select a message"
                    description="Choose an enquiry from the list to read it and take action."
                  />
                )}
              </div>
            </div>
          )}
        </AdminCard>
      )}

      {/* Mobile: reading pane opens as a dialog */}
      <Dialog open={!isDesktop && !!selected} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{selected?.subject || "Message"}</DialogTitle>
            <DialogDescription>Message details</DialogDescription>
          </DialogHeader>
          {detail}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this message?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete
                ? `The enquiry from ${pendingDelete.name} will be permanently removed. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
              onClick={(e) => {
                e.preventDefault();
                if (pendingDelete) deleteMutation.mutate(pendingDelete.id);
              }}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete message"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
