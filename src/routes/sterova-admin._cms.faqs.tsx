import { useMemo, useState } from "react";
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
import { adminFetchFAQs, adminCreateFAQ, adminUpdateFAQ, adminDeleteFAQ } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { FAQRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/faqs")({
  head: () => privateSeo("FAQs · CMS"),
  component: () => <AdminFAQsPage />,
});

interface FormState {
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
}

const EMPTY_FORM: FormState = {
  question: "",
  answer: "",
  category: "general",
  display_order: 0,
  is_active: true,
};

function toForm(faq: FAQRow): FormState {
  return {
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    display_order: faq.display_order,
    is_active: faq.is_active,
  };
}

function AdminFAQsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "hidden">("all");
  const [editing, setEditing] = useState<FAQRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [pendingDelete, setPendingDelete] = useState<FAQRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: adminFetchFAQs,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] });
    void queryClient.invalidateQueries({ queryKey: ["faqs"] });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openNew = () => {
    setEditing(null);
    setForm({ ...EMPTY_FORM, display_order: data?.length ?? 0 });
    setDialogOpen(true);
  };

  const openEdit = (faq: FAQRow) => {
    setEditing(faq);
    setForm(toForm(faq));
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        category: form.category.trim() || "general",
        display_order: Number(form.display_order) || 0,
        is_active: form.is_active,
      };
      return editing ? adminUpdateFAQ(editing.id, payload) : adminCreateFAQ(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "FAQ updated" : "FAQ created" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save FAQ", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteFAQ,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "FAQ deleted" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not delete FAQ", description: err.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (filter === "active") list = list.filter((p) => p.is_active);
    if (filter === "hidden") list = list.filter((p) => !p.is_active);
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (p) => p.question.toLowerCase().includes(term) || p.answer.toLowerCase().includes(term),
      );
    }
    return list;
  }, [data, search, filter]);

  const canSave = form.question.trim().length >= 2 && form.answer.trim().length >= 2;

  return (
    <>
      <AdminPageHeading
        eyebrow="Growth"
        title="FAQs"
        description="Manage frequently asked questions."
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            New FAQ
          </Button>
        }
      />

      <AdminCard>
        <AdminToolbar>
          <AdminSearch value={search} onChange={setSearch} placeholder="Search FAQs…" />
          <AdminFilterTabs
            value={filter}
            onChange={setFilter}
            label="Filter FAQs"
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
            title="No FAQs found"
            description="Create your first frequently asked question."
            action={
              <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                New FAQ
              </Button>
            }
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Question</th>
                <th>Category</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </>
            }
          >
            {filtered.map((faq) => (
              <tr key={faq.id} className="group hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5">
                <td className="font-medium max-w-md truncate" title={faq.question}>
                  {faq.question}
                </td>
                <td className="text-muted-foreground capitalize">{faq.category}</td>
                <td>
                  <StatusBadge status={faq.is_active ? "active" : "hidden"} />
                </td>
                <td className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(faq)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingDelete(faq)}
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
            <DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label>Question</Label>
              <Input value={form.question} onChange={(e) => set("question", e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Answer</Label>
              <Textarea
                rows={4}
                value={form.answer}
                onChange={(e) => set("answer", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => set("category", e.target.value)} />
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
            <AlertDialogTitle>Delete FAQ?</AlertDialogTitle>
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
