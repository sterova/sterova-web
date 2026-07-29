import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
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
import { adminCreateStat, adminDeleteStat, adminFetchStats, adminUpdateStat } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { friendlyError } from "@/lib/cms-errors";
import type { SiteStatRow } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/results")({
  head: () => privateSeo("Results · CMS"),
  component: () => <AdminResultsPage />,
});

interface FormState {
  title: string;
  value: string;
  description: string;
  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  value: "",
  description: "",
  display_order: 0,
  is_active: true,
};

type FilterValue = "all" | "active" | "hidden";

const PAGE_SIZE = 10;

function AdminResultsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SiteStatRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [pendingDelete, setPendingDelete] = useState<SiteStatRow | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "site-stats"],
    queryFn: adminFetchStats,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "site-stats"] });
    void queryClient.invalidateQueries({ queryKey: ["site-stats"] });
  };

  const fail = (title: string) => (err: unknown) =>
    toast({
      title,
      description: friendlyError(err),
      variant: "destructive",
    });

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, display_order: data?.length ?? 0 });
    setDialogOpen(true);
  };

  const openEdit = (stat: SiteStatRow) => {
    setEditing(stat);
    setForm({
      title: stat.title,
      value: stat.value,
      description: stat.description ?? "",
      display_order: stat.display_order,
      is_active: stat.is_active,
    });
    setDialogOpen(true);
  };

  const duplicate = useMemo(() => {
    const term = form.title.trim().toLowerCase();
    if (!term) return false;
    return (data ?? []).some((s) => s.id !== editing?.id && s.title.trim().toLowerCase() === term);
  }, [data, form.title, editing]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        value: form.value.trim(),
        description: form.description.trim() || null,
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
      };
      return editing ? adminUpdateStat(editing.id, payload) : adminCreateStat(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Metric updated" : "Metric created" });
    },
    onError: fail("Could not save metric"),
  });

  // Optimistic enable/disable — the switch flips instantly and rolls back on error.
  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminUpdateStat(id, { is_active }),
    onMutate: async ({ id, is_active }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "site-stats"] });
      const previous = queryClient.getQueryData<SiteStatRow[]>(["admin", "site-stats"]);
      queryClient.setQueryData<SiteStatRow[]>(["admin", "site-stats"], (old) =>
        (old ?? []).map((s) => (s.id === id ? { ...s, is_active } : s)),
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin", "site-stats"], context.previous);
      }
      fail("Could not update metric")(err);
    },
    onSettled: invalidate,
  });

  const reorder = useMutation({
    mutationFn: ({ id, display_order }: { id: string; display_order: number }) =>
      adminUpdateStat(id, { display_order }),
    onSuccess: invalidate,
    onError: fail("Could not reorder metric"),
  });

  const remove = useMutation({
    mutationFn: adminDeleteStat,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Metric deleted" });
    },
    onError: fail("Could not delete metric"),
  });

  const activeCount = data?.filter((s) => s.is_active).length ?? 0;
  const hiddenCount = (data?.length ?? 0) - activeCount;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = [...(data ?? [])].sort((a, b) => a.display_order - b.display_order);
    if (filter === "active") list = list.filter((s) => s.is_active);
    if (filter === "hidden") list = list.filter((s) => !s.is_active);
    if (!term) return list;
    return list.filter(
      (s) =>
        s.title.toLowerCase().includes(term) ||
        s.value.toLowerCase().includes(term) ||
        (s.description ?? "").toLowerCase().includes(term),
    );
  }, [data, search, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const move = (stat: SiteStatRow, direction: -1 | 1) => {
    const sorted = [...(data ?? [])].sort((a, b) => a.display_order - b.display_order);
    const index = sorted.findIndex((s) => s.id === stat.id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    reorder.mutate({ id: stat.id, display_order: swapWith.display_order });
    reorder.mutate({ id: swapWith.id, display_order: stat.display_order });
  };

  const canSave = form.title.trim().length >= 2 && form.value.trim().length >= 1 && !duplicate;

  return (
    <>
      <AdminPageHeading
        eyebrow="Homepage & About"
        title="Results"
        description={`${data?.length ?? 0} metrics · ${activeCount} visible on the site`}
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New metric
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
              placeholder="Search metrics…"
            />
            <AdminFilterTabs<FilterValue>
              value={filter}
              onChange={(v) => {
                setFilter(v);
                setPage(1);
              }}
              label="Filter metrics"
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
              title={(data?.length ?? 0) === 0 ? "No metrics yet" : "No matching metrics"}
              description={
                (data?.length ?? 0) === 0
                  ? "Add your first metric — the Results section stays hidden until one is active."
                  : "Try a different search term or filter."
              }
              action={
                (data?.length ?? 0) === 0 ? (
                  <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    New metric
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <AdminTable
                head={
                  <>
                    <th scope="col">Metric</th>
                    <th scope="col">Value</th>
                    <th scope="col">Status</th>
                    <th scope="col">Order</th>
                    <th scope="col" className="text-right">
                      Actions
                    </th>
                  </>
                }
              >
                {paged.map((stat) => (
                  <AdminRow key={stat.id}>
                    <td>
                      <p className="font-medium text-foreground">{stat.title}</p>
                      {stat.description ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {stat.description}
                        </p>
                      ) : null}
                    </td>
                    <td className="font-display text-base font-semibold tabular-nums">
                      {stat.value}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={stat.is_active}
                          aria-label={`Toggle ${stat.title}`}
                          onCheckedChange={(checked) =>
                            toggleActive.mutate({
                              id: stat.id,
                              is_active: checked,
                            })
                          }
                        />
                        <StatusBadge status={stat.is_active ? "active" : "hidden"} />
                      </div>
                    </td>
                    <td className="tabular-nums text-muted-foreground">{stat.display_order}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Move ${stat.title} up`}
                          onClick={() => move(stat, -1)}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Move ${stat.title} down`}
                          onClick={() => move(stat, 1)}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${stat.title}`}
                          onClick={() => openEdit(stat)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Delete ${stat.title}`}
                          onClick={() => setPendingDelete(stat)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </AdminRow>
                ))}
              </AdminTable>

              {pageCount > 1 ? (
                <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
                  <span>
                    Page {currentPage} of {pageCount} · {filtered.length} metrics
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit metric" : "New metric"}</DialogTitle>
            <DialogDescription>
              Shown in the “Results that speak for themselves” section on the home and about pages.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="stat-title">Metric title</Label>
              <Input
                id="stat-title"
                value={form.title}
                maxLength={120}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Projects shipped"
              />
              {duplicate ? (
                <p className="text-xs text-destructive">A metric with this title already exists.</p>
              ) : null}
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="stat-value">Metric value</Label>
              <Input
                id="stat-value"
                value={form.value}
                maxLength={24}
                onChange={(e) => set("value", e.target.value)}
                placeholder="50+   ·   92%   ·   $1.2M"
              />
              <p className="text-xs text-muted-foreground">
                Numbers animate automatically; prefixes and suffixes are kept.
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="stat-description">Description (optional)</Label>
              <Textarea
                id="stat-description"
                value={form.description}
                maxLength={400}
                rows={3}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="grid gap-1.5">
                <Label htmlFor="stat-order">Display order</Label>
                <Input
                  id="stat-order"
                  type="number"
                  className="w-28"
                  value={form.display_order}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="stat-active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => set("is_active", checked)}
                />
                <Label htmlFor="stat-active">Active</Label>
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
            <AlertDialogTitle>Delete this metric?</AlertDialogTitle>
            <AlertDialogDescription>
              “{pendingDelete?.title}” will be removed permanently. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingDelete && remove.mutate(pendingDelete.id)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
