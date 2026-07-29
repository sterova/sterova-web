import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
import PhotoUploadField from "@/components/admin/PhotoUploadField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  adminCreateTeamMember,
  adminDeleteTeamMember,
  adminFetchTeamMembers,
  adminUpdateTeamMember,
  removeStorageObjectByUrl,
} from "@/lib/api";
import { STORAGE_BUCKETS } from "@/data/admin-constants";
import { SOCIAL_PLATFORMS } from "@/data/social-links";
import { friendlyError } from "@/lib/cms-errors";
import { useToast } from "@/hooks/use-toast";
import type { TeamMemberLinks, TeamMemberRow } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/team")({
  head: () => privateSeo("Team · CMS"),
  component: () => <AdminTeamPage />,
});

interface CustomLink {
  label: string;
  url: string;
}

interface FormState {
  full_name: string;
  position: string;
  bio: string;
  photo_url: string | null;
  links: Record<string, string>;
  custom: CustomLink[];
  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  full_name: "",
  position: "",
  bio: "",
  photo_url: null,
  links: {},
  custom: [],
  display_order: 0,
  is_active: true,
};

type FilterValue = "all" | "active" | "hidden";
const PAGE_SIZE = 10;

function toForm(member: TeamMemberRow): FormState {
  const links: Record<string, string> = {};
  for (const platform of SOCIAL_PLATFORMS) {
    const raw = member.links?.[platform.key];
    if (typeof raw === "string") links[platform.key] = raw;
  }
  const custom = Array.isArray(member.links?.custom)
    ? (member.links.custom as CustomLink[]).filter(
        (entry) => entry && typeof entry.url === "string",
      )
    : [];
  return {
    full_name: member.full_name,
    position: member.position,
    bio: member.bio ?? "",
    photo_url: member.photo_url,
    links,
    custom,
    display_order: member.display_order,
    is_active: member.is_active,
  };
}

function AdminTeamPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMemberRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<TeamMemberRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "team-members"],
    queryFn: adminFetchTeamMembers,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "team-members"] });
    void queryClient.invalidateQueries({ queryKey: ["team-members"] });
  };

  const fail = (title: string) => (err: unknown) =>
    toast({ title, description: friendlyError(err), variant: "destructive" });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setLink = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, links: { ...prev.links, [key]: value } }));

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, display_order: data?.length ?? 0 });
    setDialogOpen(true);
  };

  const openEdit = (member: TeamMemberRow) => {
    setEditing(member);
    setForm(toForm(member));
    setDialogOpen(true);
  };

  const duplicate = useMemo(() => {
    const term = form.full_name.trim().toLowerCase();
    if (!term) return false;
    return (data ?? []).some(
      (m) => m.id !== editing?.id && m.full_name.trim().toLowerCase() === term,
    );
  }, [data, form.full_name, editing]);

  const save = useMutation({
    mutationFn: async () => {
      const links: TeamMemberLinks = {};
      for (const [key, value] of Object.entries(form.links)) {
        if (value.trim()) links[key] = value.trim();
      }
      const custom = form.custom
        .filter((entry) => entry.url.trim())
        .map((entry) => ({
          label: entry.label.trim() || "Link",
          url: entry.url.trim(),
        }));
      if (custom.length) links.custom = custom;

      const payload = {
        full_name: form.full_name.trim(),
        position: form.position.trim(),
        bio: form.bio.trim() || null,
        photo_url: form.photo_url,
        links,
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
      };

      const saved = editing
        ? await adminUpdateTeamMember(editing.id, payload)
        : await adminCreateTeamMember(payload);

      // Clean up the replaced photo only after the row has been saved.
      if (editing?.photo_url && editing.photo_url !== form.photo_url) {
        await removeStorageObjectByUrl(STORAGE_BUCKETS.team, editing.photo_url);
      }
      return saved;
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Team member updated" : "Team member added" });
    },
    onError: fail("Could not save team member"),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminUpdateTeamMember(id, { is_active }),
    onMutate: async ({ id, is_active }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "team-members"] });
      const previous = queryClient.getQueryData<TeamMemberRow[]>(["admin", "team-members"]);
      queryClient.setQueryData<TeamMemberRow[]>(["admin", "team-members"], (old) =>
        (old ?? []).map((m) => (m.id === id ? { ...m, is_active } : m)),
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin", "team-members"], context.previous);
      }
      fail("Could not update team member")(err);
    },
    onSettled: invalidate,
  });

  const reorder = useMutation({
    mutationFn: ({ id, display_order }: { id: string; display_order: number }) =>
      adminUpdateTeamMember(id, { display_order }),
    onSuccess: invalidate,
    onError: fail("Could not reorder team member"),
  });

  const remove = useMutation({
    mutationFn: async (member: TeamMemberRow) => {
      await adminDeleteTeamMember(member.id);
      await removeStorageObjectByUrl(STORAGE_BUCKETS.team, member.photo_url);
    },
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Team member removed" });
    },
    onError: fail("Could not delete team member"),
  });

  const activeCount = data?.filter((m) => m.is_active).length ?? 0;
  const hiddenCount = (data?.length ?? 0) - activeCount;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = [...(data ?? [])].sort((a, b) => a.display_order - b.display_order);
    if (filter === "active") list = list.filter((m) => m.is_active);
    if (filter === "hidden") list = list.filter((m) => !m.is_active);
    if (!term) return list;
    return list.filter(
      (m) =>
        m.full_name.toLowerCase().includes(term) ||
        m.position.toLowerCase().includes(term) ||
        (m.bio ?? "").toLowerCase().includes(term),
    );
  }, [data, search, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const move = (member: TeamMemberRow, direction: -1 | 1) => {
    const sorted = [...(data ?? [])].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((m) => m.id === member.id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    reorder.mutate({ id: member.id, display_order: swapWith.display_order });
    reorder.mutate({ id: swapWith.id, display_order: member.display_order });
  };

  const canSave =
    form.full_name.trim().length >= 2 &&
    form.position.trim().length >= 2 &&
    !duplicate &&
    !uploadBusy;

  return (
    <>
      <AdminPageHeading
        eyebrow="About page"
        title="Team"
        description={`${data?.length ?? 0} people · ${activeCount} visible on the site`}
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New member
          </Button>
        }
      />

      {error ? (
        <AdminError message={friendlyError(error)} />
      ) : (
        <AdminCard>
          <AdminToolbar>
            <AdminSearch
              value={search}
              onChange={(v) => {
                setSearch(v);
                setPage(1);
              }}
              placeholder="Search name, role or bio…"
            />
            <AdminFilterTabs<FilterValue>
              value={filter}
              onChange={(v) => {
                setFilter(v);
                setPage(1);
              }}
              label="Filter team"
              options={[
                { value: "all", label: "All", count: data?.length ?? 0 },
                { value: "active", label: "Active", count: activeCount },
                { value: "hidden", label: "Hidden", count: hiddenCount },
              ]}
            />
          </AdminToolbar>

          {isLoading ? (
            <AdminTableSkeleton rows={5} cols={4} />
          ) : paged.length === 0 ? (
            <AdminEmpty
              title={(data?.length ?? 0) === 0 ? "No team members yet" : "No matching team members"}
              description={
                (data?.length ?? 0) === 0
                  ? "The team section stays hidden on the about page until someone is active."
                  : "Try a different search term or filter."
              }
              action={
                (data?.length ?? 0) === 0 ? (
                  <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    New member
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <AdminTable
                head={
                  <>
                    <th scope="col">Member</th>
                    <th scope="col">Links</th>
                    <th scope="col">Status</th>
                    <th scope="col">Order</th>
                    <th scope="col" className="text-right">
                      Actions
                    </th>
                  </>
                }
              >
                {paged.map((member) => {
                  const linkCount = Object.values(member.links ?? {}).filter((v) =>
                    typeof v === "string" ? v.trim() : Array.isArray(v),
                  ).length;
                  return (
                    <AdminRow key={member.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                            {member.photo_url ? (
                              <img
                                src={member.photo_url}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">{member.full_name}</p>
                            <p className="text-xs text-muted-foreground">{member.position}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-xs text-muted-foreground tabular-nums">{linkCount}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={member.is_active}
                            aria-label={`Toggle ${member.full_name}`}
                            onCheckedChange={(checked) =>
                              toggleActive.mutate({
                                id: member.id,
                                is_active: checked,
                              })
                            }
                          />
                          <StatusBadge status={member.is_active ? "active" : "hidden"} />
                        </div>
                      </td>
                      <td className="tabular-nums text-muted-foreground">{member.display_order}</td>
                      <td>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Move ${member.full_name} up`}
                            onClick={() => move(member, -1)}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Move ${member.full_name} down`}
                            onClick={() => move(member, 1)}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Edit ${member.full_name}`}
                            onClick={() => openEdit(member)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${member.full_name}`}
                            onClick={() => setPendingDelete(member)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </AdminRow>
                  );
                })}
              </AdminTable>

              {pageCount > 1 ? (
                <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
                  <span>
                    Page {currentPage} of {pageCount} · {filtered.length} people
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={currentPage === pageCount}
                      onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </AdminCard>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit team member" : "New team member"}</DialogTitle>
            <DialogDescription>
              Shown in “The people behind the work” on the about page.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="member-name">Full name</Label>
                <Input
                  id="member-name"
                  value={form.full_name}
                  maxLength={120}
                  onChange={(e) => set("full_name", e.target.value)}
                />
                {duplicate ? (
                  <p className="text-xs text-destructive">Someone with this name already exists.</p>
                ) : null}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="member-position">Position</Label>
                <Input
                  id="member-position"
                  value={form.position}
                  maxLength={120}
                  onChange={(e) => set("position", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="member-bio">Short biography</Label>
              <Textarea
                id="member-bio"
                rows={3}
                maxLength={800}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">{form.bio.length}/800</p>
            </div>

            <PhotoUploadField
              label="Profile photo"
              bucket={STORAGE_BUCKETS.team}
              value={form.photo_url}
              onChange={(url) => set("photo_url", url)}
              onBusyChange={setUploadBusy}
              hint="Square images work best. JPEG, PNG, WebP, AVIF or GIF up to 5MB."
            />

            <div className="rounded-xl border border-border/70 p-4">
              <p className="text-sm font-medium text-foreground">Social &amp; professional links</p>
              <p className="mb-3 text-xs text-muted-foreground">
                All optional — only filled-in links show an icon on the site.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {SOCIAL_PLATFORMS.map((platform) => {
                  const Icon = platform.icon;
                  return (
                    <div key={platform.key} className="grid gap-1.5">
                      <Label
                        htmlFor={`link-${platform.key}`}
                        className="flex items-center gap-1.5 text-xs"
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        {platform.label}
                      </Label>
                      <Input
                        id={`link-${platform.key}`}
                        className="h-9 text-xs"
                        placeholder={platform.placeholder}
                        value={form.links[platform.key] ?? ""}
                        onChange={(e) => setLink(platform.key, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-foreground">Custom links</p>
                {form.custom.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      className="h-9 w-40 text-xs"
                      placeholder="Label"
                      value={entry.label}
                      aria-label={`Custom link ${index + 1} label`}
                      onChange={(e) =>
                        set(
                          "custom",
                          form.custom.map((c, i) =>
                            i === index ? { ...c, label: e.target.value } : c,
                          ),
                        )
                      }
                    />
                    <Input
                      className="h-9 flex-1 text-xs"
                      placeholder="https://…"
                      value={entry.url}
                      aria-label={`Custom link ${index + 1} URL`}
                      onChange={(e) =>
                        set(
                          "custom",
                          form.custom.map((c, i) =>
                            i === index ? { ...c, url: e.target.value } : c,
                          ),
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove custom link ${index + 1}`}
                      onClick={() =>
                        set(
                          "custom",
                          form.custom.filter((_, i) => i !== index),
                        )
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => set("custom", [...form.custom, { label: "", url: "" }])}
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add custom link
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="grid gap-1.5">
                <Label htmlFor="member-order">Display order</Label>
                <Input
                  id="member-order"
                  type="number"
                  className="w-28"
                  value={form.display_order}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="member-active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => set("is_active", checked)}
                />
                <Label htmlFor="member-active">Active</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="gradient"
              disabled={!canSave || save.isPending}
              onClick={() => save.mutate()}
            >
              {save.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-1.5" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this team member?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.full_name}” and their profile photo will be deleted permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingDelete && remove.mutate(pendingDelete)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
