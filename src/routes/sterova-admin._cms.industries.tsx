import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Save } from "lucide-react";
import {
  AdminPageHeading,
  AdminCard,
  AdminTable,
  AdminTableSkeleton,
  AdminEmpty,
  AdminToolbar,
  AdminSearch,
  AdminFilterTabs,
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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  adminFetchIndustries,
  adminCreateIndustry,
  adminUpdateIndustry,
  adminDeleteIndustry,
} from "@/lib/api";
import { slugify } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { IndustryRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/industries")({
  head: () => privateSeo("Industries · CMS"),
  component: () => <AdminIndustriesPage />,
});

interface FormState {
  name: string;
  slug: string;
  description: string;
  icon_key: string;
  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  name: "",
  slug: "",
  description: "",
  icon_key: "",
  display_order: 0,
  is_active: true,
};

function toForm(industry: IndustryRow): FormState {
  return {
    name: industry.name,
    slug: industry.slug,
    description: industry.description,
    icon_key: industry.icon_key ?? "",
    display_order: industry.display_order,
    is_active: industry.is_active,
  };
}

function AdminIndustriesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
  const [editing, setEditing] = useState<IndustryRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugLocked, setSlugLocked] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<IndustryRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "industries"],
    queryFn: adminFetchIndustries,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "industries"] });
    void queryClient.invalidateQueries({ queryKey: ["industries"] });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!slugLocked && !editing) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.name) }));
    }
  }, [form.name, slugLocked, editing]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, display_order: data?.length ?? 0 });
    setSlugLocked(false);
    setDialogOpen(true);
  };

  const openEdit = (industry: IndustryRow) => {
    setEditing(industry);
    setForm(toForm(industry));
    setSlugLocked(true);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        icon_key: form.icon_key.trim() || null,
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
      };
      return editing ? adminUpdateIndustry(editing.id, payload) : adminCreateIndustry(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Industry updated" : "Industry created" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save industry", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteIndustry,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Industry deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete industry",
        description: err.message,
        variant: "destructive",
      }),
  });

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (filter === "active") list = list.filter((p) => p.is_active);
    if (filter === "hidden") list = list.filter((p) => !p.is_active);
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(term));
    }
    return list;
  }, [data, search, filter]);

  const canSave =
    form.name.trim().length >= 2 &&
    form.slug.trim().length >= 2 &&
    form.description.trim().length >= 2;

  return (
    <>
      <AdminPageHeading
        eyebrow="Content"
        title="Industries"
        description="Manage industry verticals."
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New industry
          </Button>
        }
      />

      <AdminCard>
        <AdminToolbar>
          <AdminSearch value={search} onChange={setSearch} placeholder="Search industries…" />
          <AdminFilterTabs
            value={filter}
            onChange={setFilter}
            label="Filter industries"
            options={[
              { value: "all", label: "All" },
              { value: "active", label: "Active" },
              { value: "hidden", label: "Hidden" },
            ]}
          />
        </AdminToolbar>

        {isLoading ? (
          <AdminTableSkeleton rows={5} cols={4} />
        ) : filtered.length === 0 ? (
          <AdminEmpty
            title="No industries found"
            description="Create your first industry vertical."
            action={
              <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                New industry
              </Button>
            }
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Name</th>
                <th>Status</th>
                <th>Order</th>
                <th className="text-right">Actions</th>
              </>
            }
          >
            {filtered.map((industry) => (
              <tr key={industry.id} className="group hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5">
                <td className="font-medium">{industry.name}</td>
                <td>
                  <StatusBadge status={industry.is_active ? "active" : "hidden"} />
                </td>
                <td className="text-muted-foreground">{industry.display_order}</td>
                <td className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(industry)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingDelete(industry)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </AdminTable>
        )}
      </AdminCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit industry" : "New industry"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  set("slug", slugify(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Icon Key (Lucide)</Label>
              <Input
                value={form.icon_key}
                placeholder="e.g. Building2"
                onChange={(e) => set("icon_key", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div className="flex flex-col gap-2">
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.display_order}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                />
              </div>
              <div className="flex items-center gap-2.5 pb-2">
                <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
                <Label>Visible on site</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
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

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete industry?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
