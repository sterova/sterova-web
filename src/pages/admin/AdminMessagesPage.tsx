import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Archive,
  Loader2,
  Mail,
  MailOpen,
  Reply,
  Save,
  Search,
  Trash2,
} from "lucide-react";
import { AdminHeader, useMobileMenu } from "@/components/admin/AdminLayout";
import {
  AdminCard,
  AdminEmpty,
  AdminError,
  AdminLoading,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

type Filter = "all" | "new" | "read" | "replied" | "archived";

export default function AdminMessagesPage() {
  const setMobileMenuOpen = useMobileMenu();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [pendingDelete, setPendingDelete] =
    useState<ContactMessageRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: adminFetchMessages,
  });

  const invalidate = () =>
    void queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });

  const counts = useMemo(
    () => ({
      all: data?.length ?? 0,
      new: data?.filter((m) => m.status === "new").length ?? 0,
      read: data?.filter((m) => m.status === "read").length ?? 0,
      replied: data?.filter((m) => m.status === "replied").length ?? 0,
      archived: data?.filter((m) => m.status === "archived").length ?? 0,
    }),
    [data],
  );

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((m) => {
      if (filter !== "all" && m.status !== filter) return false;
      if (!term) return true;
      return (
        m.name.toLowerCase().includes(term) ||
        m.email.toLowerCase().includes(term) ||
        (m.subject ?? "").toLowerCase().includes(term) ||
        m.message.toLowerCase().includes(term)
      );
    });
  }, [data, search, filter]);

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

  return (
    <>
      <AdminHeader
        title="Messages"
        description={`${counts.new} unread · ${counts.all} total`}
        onMenuClick={setMobileMenuOpen}
      />
      
      <div className="flex-1 p-4 sm:p-6 overflow-x-hidden flex flex-col">
        {error ? (
          <AdminError message={(error as Error).message} />
        ) : isLoading ? (
          <AdminLoading />
        ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, email or message…"
                className="pl-9"
                aria-label="Search messages"
              />
            </div>
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filter messages"
            >
              {(
                ["all", "new", "read", "replied", "archived"] as Filter[]
              ).map((f) => (
                <Button
                  key={f}
                  type="button"
                  variant={filter === f ? "default" : "outline"}
                  size="sm"
                  className="capitalize"
                  onClick={() => setFilter(f)}
                >
                  {f} ({counts[f]})
                </Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <AdminCard>
              <AdminEmpty
                title={
                  counts.all === 0 ? "Inbox is empty" : "Nothing matches here"
                }
                description={
                  counts.all === 0
                    ? "Enquiries sent through the contact form will appear here."
                    : "Try another search term or filter."
                }
              />
            </AdminCard>
          ) : (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)] items-start">
              {/* List */}
              <AdminCard className="max-h-[70vh] overflow-y-auto">
                <ul className="divide-y">
                  {filtered.map((m) => (
                    <li key={m.id}>
                      <button
                        type="button"
                        onClick={() => openMessage(m)}
                        aria-current={selectedId === m.id ? "true" : undefined}
                        className={cn(
                          "w-full text-left px-4 py-3.5 transition-colors hover:bg-secondary/50",
                          selectedId === m.id && "bg-primary/5",
                        )}
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "text-sm truncate",
                              m.status === "new"
                                ? "font-semibold"
                                : "font-medium",
                            )}
                          >
                            {m.name}
                          </span>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {m.subject || m.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {formatDate(m.created_at)}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </AdminCard>

              {/* Detail */}
              {selected ? (
                <AdminCard>
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-semibold">
                            {selected.subject || "No subject"}
                          </h2>
                          <StatusBadge status={selected.status} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selected.name} ·{" "}
                          <a
                            href={`mailto:${selected.email}`}
                            className="text-primary hover:underline"
                          >
                            {selected.email}
                          </a>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Received {formatDate(selected.created_at)}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed whitespace-pre-wrap border-t pt-4">
                      {selected.message}
                    </p>

                    {/* Internal note */}
                    <div className="flex flex-col gap-2 border-t pt-4">
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
                        disabled={
                          saveNote.isPending ||
                          note === (selected.admin_note ?? "")
                        }
                        onClick={() =>
                          saveNote.mutate({
                            id: selected.id,
                            admin_note: note,
                          })
                        }
                      >
                        {saveNote.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                            Saving…
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-1.5" />
                            Save note
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-wrap border-t pt-4">
                      <Button asChild size="sm" variant="gradient">
                        <a
                          href={`mailto:${selected.email}?subject=${encodeURIComponent(
                            selected.subject
                              ? `Re: ${selected.subject}`
                              : "Re: your enquiry",
                          )}`}
                        >
                          <Reply className="h-4 w-4 mr-1.5" />
                          Reply by email
                        </a>
                      </Button>
                      {selected.status !== "replied" && (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={setStatus.isPending}
                          onClick={() =>
                            setStatus.mutate({
                              id: selected.id,
                              status: "replied",
                            })
                          }
                        >
                          <MailOpen className="h-4 w-4 mr-1.5" />
                          Mark replied
                        </Button>
                      )}
                      {selected.status !== "archived" ? (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={setStatus.isPending}
                          onClick={() =>
                            setStatus.mutate({
                              id: selected.id,
                              status: "archived",
                            })
                          }
                        >
                          <Archive className="h-4 w-4 mr-1.5" />
                          Archive
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={setStatus.isPending}
                          onClick={() =>
                            setStatus.mutate({
                              id: selected.id,
                              status: "read",
                            })
                          }
                        >
                          <Mail className="h-4 w-4 mr-1.5" />
                          Unarchive
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Delete message from ${selected.name}`}
                        className="ml-auto text-muted-foreground hover:text-destructive"
                        onClick={() => setPendingDelete(selected)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </AdminCard>
              ) : (
                <AdminCard className="hidden lg:block">
                  <AdminEmpty
                    title="Select a message"
                    description="Choose an enquiry from the list to read it and take action."
                  />
                </AdminCard>
              )}
            </div>
          )}
        </div>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
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
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  Deleting…
                </>
              ) : (
                "Delete message"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
}
