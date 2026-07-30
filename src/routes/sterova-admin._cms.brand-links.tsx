import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ExternalLink, Loader2, Pencil, Plus, Save, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import {
  adminCreateBrandLink,
  adminDeleteBrandLink,
  adminFetchBrandLinks,
  adminUpdateBrandLink,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { friendlyError } from "@/lib/cms-errors";
import type { BrandLinkRow, BrandLinkCategory } from "@/types/database";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/brand-links")({
  head: () => privateSeo("Brand Links · CMS"),
  component: () => <AdminBrandLinksPage />,
});

interface FormState {
  category: BrandLinkCategory;
  key: string;
  label: string;
  value: string;
  href: string;
  description: string;
  icon_key: string;
  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  category: "social",
  key: "",
  label: "",
  value: "",
  href: "",
  description: "",
  icon_key: "",
  display_order: 0,
  is_active: true,
};

const CATEGORY_LABELS: Record<BrandLinkCategory, string> = {
  social: "Social",
  contact: "Contact",
};

type FilterValue = "all" | BrandLinkCategory;

const PAGE_SIZE = 20;

function SortableLinkRow({
  link,
  isReordering,
  onEdit,
  onDelete,
  onToggleActive,
}: {
  link: BrandLinkRow;
  isReordering?: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (checked: boolean) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: link.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { opacity: 0.5, zIndex: 50, position: "relative" as const } : {}),
  };

  return (
    <AdminRow ref={setNodeRef} style={style} className={isDragging ? "bg-muted shadow-xl" : ""}>
      <td className="w-10 px-2 py-3 text-center align-middle">
        {isReordering ? (
          <div className="flex w-full items-center justify-center text-muted-foreground/50">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <button
            type="button"
            className="flex w-full cursor-grab items-center justify-center text-muted-foreground hover:text-foreground active:cursor-grabbing focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            {...attributes}
            {...listeners}
            title="Drag to reorder"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        )}
      </td>
      <td>
        <p className="font-medium text-foreground">{link.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground font-mono">{link.key}</p>
      </td>
      <td>
        <StatusBadge status={link.category} />
      </td>
      <td>
        <div className="flex items-center gap-1.5 max-w-[200px]">
          <span className="truncate text-sm text-muted-foreground">
            {link.value || link.href || "—"}
          </span>
          {link.href && (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 text-muted-foreground hover:text-primary transition-colors"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Switch
            checked={link.is_active}
            aria-label={`Toggle ${link.label}`}
            onCheckedChange={onToggleActive}
          />
          <StatusBadge status={link.is_active ? "active" : "hidden"} />
        </div>
      </td>
      <td>
        <div className="flex items-center justify-end gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Edit ${link.label}`}
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Delete ${link.label}`}
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </td>
    </AdminRow>
  );
}

function AdminBrandLinksPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<BrandLinkRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [pendingDelete, setPendingDelete] = useState<BrandLinkRow | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "brand-links"],
    queryFn: adminFetchBrandLinks,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "brand-links"] });
    void queryClient.invalidateQueries({ queryKey: ["brand-links"] });
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

  const openEdit = (link: BrandLinkRow) => {
    setEditing(link);
    setForm({
      category: link.category,
      key: link.key,
      label: link.label,
      value: link.value,
      href: link.href ?? "",
      description: link.description ?? "",
      icon_key: link.icon_key ?? "",
      display_order: link.display_order,
      is_active: link.is_active,
    });
    setDialogOpen(true);
  };

  const duplicateKey = useMemo(() => {
    const term = form.key.trim().toLowerCase();
    if (!term) return false;
    return (data ?? []).some((l) => l.id !== editing?.id && l.key.trim().toLowerCase() === term);
  }, [data, form.key, editing]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        category: form.category,
        key: form.key.trim().toLowerCase().replace(/\s+/g, "-"),
        label: form.label.trim(),
        value: form.value.trim(),
        href: form.href.trim() || null,
        description: form.description.trim() || null,
        icon_key: form.icon_key.trim() || null,
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
      };
      return editing ? adminUpdateBrandLink(editing.id, payload) : adminCreateBrandLink(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Link updated" : "Link created" });
    },
    onError: fail("Could not save link"),
  });

  const toggleActive = useMutation({
    mutationFn: ({ id, is_active }: { id: string; is_active: boolean }) =>
      adminUpdateBrandLink(id, { is_active }),
    onMutate: async ({ id, is_active }) => {
      await queryClient.cancelQueries({ queryKey: ["admin", "brand-links"] });
      const previous = queryClient.getQueryData<BrandLinkRow[]>(["admin", "brand-links"]);
      queryClient.setQueryData<BrandLinkRow[]>(["admin", "brand-links"], (old) =>
        (old ?? []).map((l) => (l.id === id ? { ...l, is_active } : l)),
      );
      return { previous };
    },
    onError: (err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["admin", "brand-links"], context.previous);
      }
      fail("Could not update link")(err);
    },
    onSettled: invalidate,
  });

  const reorder = useMutation({
    mutationFn: ({ id, display_order }: { id: string; display_order: number }) =>
      adminUpdateBrandLink(id, { display_order }),
    onSuccess: invalidate,
    onError: fail("Could not reorder link"),
  });

  const remove = useMutation({
    mutationFn: adminDeleteBrandLink,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Link deleted" });
    },
    onError: fail("Could not delete link"),
  });

  const counts = useMemo(() => {
    const all = data ?? [];
    return {
      all: all.length,
      social: all.filter((l) => l.category === "social").length,
      contact: all.filter((l) => l.category === "contact").length,
    };
  }, [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = [...(data ?? [])].sort(
      (a, b) => a.category.localeCompare(b.category) || a.display_order - b.display_order,
    );
    if (filter !== "all") list = list.filter((l) => l.category === filter);
    if (!term) return list;
    return list.filter(
      (l) =>
        l.label.toLowerCase().includes(term) ||
        l.key.toLowerCase().includes(term) ||
        l.value.toLowerCase().includes(term) ||
        (l.href ?? "").toLowerCase().includes(term),
    );
  }, [data, search, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeItem = data?.find((l) => l.id === active.id);
    const overItemRaw = data?.find((l) => l.id === over.id);

    if (!activeItem || !overItemRaw) {
      return;
    }

    const category = activeItem.category;
    const categoryItems = [...(data ?? [])]
      .filter((l) => l.category === category)
      .sort((a, b) => a.display_order - b.display_order);

    const oldIndex = categoryItems.findIndex((l) => l.id === active.id);
    let newIndex = categoryItems.findIndex((l) => l.id === overItemRaw.id);

    // If dragged over a different category, snap it to the top/bottom of its own category
    if (activeItem.category !== overItemRaw.category) {
      if (overItemRaw.category.localeCompare(activeItem.category) < 0) {
        newIndex = 0; // Dragged UP over an earlier category
      } else {
        newIndex = categoryItems.length - 1; // Dragged DOWN over a later category
      }
    }

    if (oldIndex === -1 || newIndex === -1) return;

    const newCategoryItems = arrayMove(categoryItems, oldIndex, newIndex);

    const updates = new Map<string, number>();
    newCategoryItems.forEach((link, index) => {
      const targetOrder = index; // Force sequential indexing to fix any duplicates
      if (link.display_order !== targetOrder) {
        updates.set(link.id, targetOrder);
      }
    });

    if (updates.size === 0) return;

    setIsReordering(true);

    // Optimistically update the cache immediately
    queryClient.setQueryData<BrandLinkRow[]>(["admin", "brand-links"], (old) => {
      return (old ?? []).map((l) => {
        if (updates.has(l.id)) {
          return { ...l, display_order: updates.get(l.id)! };
        }
        return l;
      });
    });

    // Run mutations concurrently, then invalidate once
    try {
      const promises = Array.from(updates.entries()).map(([id, order]) =>
        adminUpdateBrandLink(id, { display_order: order })
      );
      await Promise.all(promises);
    } catch (err) {
      fail("Could not reorder links")(err);
    } finally {
      setIsReordering(false);
      invalidate();
    }
  };

  const canSave =
    form.key.trim().length >= 2 && form.label.trim().length >= 1 && !duplicateKey;

  const activeCount = data?.filter((l) => l.is_active).length ?? 0;

  return (
    <>
      <AdminPageHeading
        eyebrow="Site Settings"
        title="Brand Links"
        description={`${data?.length ?? 0} links · ${activeCount} active on the site`}
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New link
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
              placeholder="Search links…"
            />
            <AdminFilterTabs<FilterValue>
              value={filter}
              onChange={(v) => {
                setFilter(v);
                setPage(1);
              }}
              label="Filter links"
              options={[
                { value: "all", label: "All", count: counts.all },
                { value: "social", label: "Social", count: counts.social },
                { value: "contact", label: "Contact", count: counts.contact },
              ]}
            />
          </AdminToolbar>

          {isLoading ? (
            <AdminTableSkeleton rows={6} cols={5} />
          ) : paged.length === 0 ? (
            <AdminEmpty
              title={(data?.length ?? 0) === 0 ? "No links yet" : "No matching links"}
              description={
                (data?.length ?? 0) === 0
                  ? "Add your first brand link — social profiles, contact details, or internal navigation."
                  : "Try a different search term or filter."
              }
              action={
                (data?.length ?? 0) === 0 ? (
                  <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                    <Plus className="h-4 w-4 mr-1.5" />
                    New link
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <>
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <AdminTable
                  head={
                    <>
                      <th scope="col" className="w-10"></th>
                      <th scope="col">Link</th>
                      <th scope="col">Category</th>
                      <th scope="col">Value</th>
                      <th scope="col">Status</th>
                      <th scope="col" className="text-right">
                        Actions
                      </th>
                    </>
                  }
                >
                  <SortableContext items={paged.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                    {paged.map((link) => (
                      <SortableLinkRow
                        key={link.id}
                        link={link}
                        isReordering={isReordering}
                        onEdit={() => openEdit(link)}
                        onDelete={() => setPendingDelete(link)}
                        onToggleActive={(checked) =>
                          toggleActive.mutate({ id: link.id, is_active: checked })
                        }
                      />
                    ))}
                  </SortableContext>
                </AdminTable>
              </DndContext>

              {pageCount > 1 ? (
                <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
                  <span>
                    Page {currentPage} of {pageCount} · {filtered.length} links
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
            <DialogTitle>{editing ? "Edit link" : "New link"}</DialogTitle>
            <DialogDescription>
              Social links, contact details, and internal navigation — all editable from here.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="link-category">Category</Label>
                <select
                  id="link-category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value as BrandLinkCategory)}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {(Object.entries(CATEGORY_LABELS) as [BrandLinkCategory, string][]).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="link-key">Key (unique)</Label>
                <Input
                  id="link-key"
                  value={form.key}
                  maxLength={60}
                  onChange={(e) => set("key", e.target.value)}
                  placeholder="linkedin, email, portfolio…"
                />
                {duplicateKey ? (
                  <p className="text-xs text-destructive">A link with this key already exists.</p>
                ) : null}
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="link-label">Label</Label>
              <Input
                id="link-label"
                value={form.label}
                maxLength={120}
                onChange={(e) => set("label", e.target.value)}
                placeholder="LinkedIn, Email, Our work…"
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="link-value">Display value</Label>
              <Input
                id="link-value"
                value={form.value}
                maxLength={200}
                onChange={(e) => set("value", e.target.value)}
                placeholder="@sterova, hello@sterova.tech, /portfolio…"
              />
              <p className="text-xs text-muted-foreground">
                The text shown to visitors (handle, email address, phone number, path, etc.)
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="link-href">Link URL</Label>
              <Input
                id="link-href"
                value={form.href}
                maxLength={500}
                onChange={(e) => set("href", e.target.value)}
                placeholder="https://linkedin.com/company/sterova, mailto:…, tel:…"
              />
              <p className="text-xs text-muted-foreground">
                Full URL, mailto:, tel:, or internal path. Leave empty for non-linkable entries.
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="link-description">Description (optional)</Label>
              <Textarea
                id="link-description"
                value={form.description}
                maxLength={400}
                rows={2}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Shown below the label for professional links"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="link-icon">Icon key</Label>
                <Input
                  id="link-icon"
                  value={form.icon_key}
                  maxLength={60}
                  onChange={(e) => set("icon_key", e.target.value)}
                  placeholder="linkedin, mail…"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="link-order">Order</Label>
                <Input
                  id="link-order"
                  type="number"
                  value={form.display_order}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="link-active"
                  checked={form.is_active}
                  onCheckedChange={(checked) => set("is_active", checked)}
                />
                <Label htmlFor="link-active">Active</Label>
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
            <AlertDialogTitle>Delete this link?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{pendingDelete?.label}&rdquo; ({pendingDelete?.key}) will be removed
              permanently. This cannot be undone.
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
