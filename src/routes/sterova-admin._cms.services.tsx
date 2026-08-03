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
  adminFetchServices,
  adminCreateService,
  adminUpdateService,
  adminDeleteService,
} from "@/lib/api";
import { slugify } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { ServiceRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/services")({
  head: () => privateSeo("Services · CMS"),
  component: () => <AdminServicesPage />,
});

interface FormState {
  title: string;
  slug: string;
  overview: string;
  benefits: string;
  process: string;

  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  overview: "",
  benefits: "",
  process: "",

  display_order: 0,
  is_active: true,
};

function toForm(service: ServiceRow): FormState {
  return {
    title: service.title,
    slug: service.slug,
    overview: service.overview,
    benefits: service.benefits.join(", "),
    process: service.process.join(", "),

    display_order: service.display_order,
    is_active: service.is_active,
  };
}

function AdminServicesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
  const [editing, setEditing] = useState<ServiceRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugLocked, setSlugLocked] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<ServiceRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "services"],
    queryFn: adminFetchServices,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "services"] });
    void queryClient.invalidateQueries({ queryKey: ["services"] });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!slugLocked && !editing) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, slugLocked, editing]);

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, display_order: data?.length ?? 0 });
    setSlugLocked(false);
    setDialogOpen(true);
  };

  const openEdit = (service: ServiceRow) => {
    setEditing(service);
    setForm(toForm(service));
    setSlugLocked(true);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        overview: form.overview.trim(),
        benefits: form.benefits
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        process: form.process
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
      };
      return editing ? adminUpdateService(editing.id, payload) : adminCreateService(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Service updated" : "Service created" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save service", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteService,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Service deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete service",
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
      list = list.filter((p) => p.title.toLowerCase().includes(term));
    }
    return list;
  }, [data, search, filter]);

  const canSave = form.title.trim().length >= 2 && form.slug.trim().length >= 2;

  return (
    <>
      <AdminPageHeading
        eyebrow="Content"
        title="Services"
        description="Manage the enterprise services offered."
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New service
          </Button>
        }
      />

      <AdminCard>
        <AdminToolbar>
          <AdminSearch value={search} onChange={setSearch} placeholder="Search services…" />
          <AdminFilterTabs
            value={filter}
            onChange={setFilter}
            label="Filter services"
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
            title="No services found"
            description="Create your first service offering."
            action={
              <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                New service
              </Button>
            }
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Service</th>
                <th>Status</th>
                <th>Order</th>
                <th className="text-right">Actions</th>
              </>
            }
          >
            {filtered.map((service) => (
              <tr key={service.id} className="group hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5">
                <td className="font-medium">{service.title}</td>
                <td>
                  <StatusBadge status={service.is_active ? "active" : "hidden"} />
                </td>
                <td className="text-muted-foreground">{service.display_order}</td>
                <td className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(service)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingDelete(service)}
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
            <DialogTitle>{editing ? "Edit service" : "New service"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
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
              <Label>Overview</Label>
              <Textarea value={form.overview} onChange={(e) => set("overview", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Benefits (comma separated)</Label>
              <Input value={form.benefits} onChange={(e) => set("benefits", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Process (comma separated)</Label>
              <Input value={form.process} onChange={(e) => set("process", e.target.value)} />
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
                <Label>Visible</Label>
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
            <AlertDialogTitle>Delete service?</AlertDialogTitle>
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
