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
  adminFetchCaseStudies,
  adminCreateCaseStudy,
  adminUpdateCaseStudy,
  adminDeleteCaseStudy,
} from "@/lib/api";
import { slugify } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { CaseStudyRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/case-studies")({
  head: () => privateSeo("Case Studies · CMS"),
  component: () => <AdminCaseStudiesPage />,
});

interface FormState {
  title: string;
  slug: string;
  client_name: string;
  problem: string;
  research: string;
  design: string;
  development: string;
  deployment: string;
  results: string;
  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  title: "",
  slug: "",
  client_name: "",
  problem: "",
  research: "",
  design: "",
  development: "",
  deployment: "",
  results: "",
  display_order: 0,
  is_active: true,
};

function toForm(study: CaseStudyRow): FormState {
  return {
    title: study.title,
    slug: study.slug,
    client_name: study.client_name,
    problem: study.problem,
    research: study.research,
    design: study.design,
    development: study.development,
    deployment: study.deployment,
    results: study.results,
    display_order: study.display_order,
    is_active: study.is_active,
  };
}

function AdminCaseStudiesPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
  const [editing, setEditing] = useState<CaseStudyRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugLocked, setSlugLocked] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CaseStudyRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "case-studies"],
    queryFn: adminFetchCaseStudies,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "case-studies"] });
    void queryClient.invalidateQueries({ queryKey: ["case-studies"] });
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

  const openEdit = (study: CaseStudyRow) => {
    setEditing(study);
    setForm(toForm(study));
    setSlugLocked(true);
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        client_name: form.client_name.trim(),
        problem: form.problem.trim(),
        research: form.research.trim(),
        design: form.design.trim(),
        development: form.development.trim(),
        deployment: form.deployment.trim(),
        results: form.results.trim(),
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
      };
      return editing ? adminUpdateCaseStudy(editing.id, payload) : adminCreateCaseStudy(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Case study updated" : "Case study created" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not save case study",
        description: err.message,
        variant: "destructive",
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteCaseStudy,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Case study deleted" });
    },
    onError: (err: Error) =>
      toast({
        title: "Could not delete case study",
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
      list = list.filter(
        (p) => p.title.toLowerCase().includes(term) || p.client_name.toLowerCase().includes(term),
      );
    }
    return list;
  }, [data, search, filter]);

  const canSave =
    form.title.trim().length >= 2 &&
    form.slug.trim().length >= 2 &&
    form.client_name.trim().length >= 2;

  return (
    <>
      <AdminPageHeading
        eyebrow="Content"
        title="Case Studies"
        description="Manage detailed case studies for the enterprise platform."
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New case study
          </Button>
        }
      />

      <AdminCard>
        <AdminToolbar>
          <AdminSearch value={search} onChange={setSearch} placeholder="Search case studies…" />
          <AdminFilterTabs
            value={filter}
            onChange={setFilter}
            label="Filter case studies"
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
            title="No case studies found"
            description="Create your first case study."
            action={
              <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                New case study
              </Button>
            }
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Title</th>
                <th>Client</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </>
            }
          >
            {filtered.map((study) => (
              <tr key={study.id} className="group hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5">
                <td className="font-medium">{study.title}</td>
                <td className="text-muted-foreground">{study.client_name}</td>
                <td>
                  <StatusBadge status={study.is_active ? "active" : "hidden"} />
                </td>
                <td className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(study)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingDelete(study)}
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit case study" : "New case study"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 col-span-2 sm:col-span-1">
              <Label>Slug</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugLocked(true);
                  set("slug", slugify(e.target.value));
                }}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <Label>Client Name</Label>
              <Input
                value={form.client_name}
                onChange={(e) => set("client_name", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 col-span-2">
              <Label>Problem / Challenge</Label>
              <Textarea
                rows={3}
                value={form.problem}
                onChange={(e) => set("problem", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <Label>Research & Strategy</Label>
              <Textarea
                rows={3}
                value={form.research}
                onChange={(e) => set("research", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <Label>Design & UI/UX</Label>
              <Textarea
                rows={3}
                value={form.design}
                onChange={(e) => set("design", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <Label>Development</Label>
              <Textarea
                rows={3}
                value={form.development}
                onChange={(e) => set("development", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <Label>Deployment & Launch</Label>
              <Textarea
                rows={3}
                value={form.deployment}
                onChange={(e) => set("deployment", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 col-span-2">
              <Label>Results & Impact</Label>
              <Textarea
                rows={3}
                value={form.results}
                onChange={(e) => set("results", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2 col-span-1">
              <Label>Display Order</Label>
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) => set("display_order", Number(e.target.value))}
              />
            </div>
            <div className="flex items-center gap-2.5 pb-2 col-span-1 justify-end">
              <Switch checked={form.is_active} onCheckedChange={(v) => set("is_active", v)} />
              <Label>Visible on site</Label>
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
            <AlertDialogTitle>Delete case study?</AlertDialogTitle>
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
