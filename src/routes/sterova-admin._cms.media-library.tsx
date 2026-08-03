import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Save, Image as ImageIcon } from "lucide-react";
import {
  AdminPageHeading,
  AdminCard,
  AdminTable,
  AdminTableSkeleton,
  AdminEmpty,
  AdminToolbar,
  AdminSearch,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  adminFetchMediaAssets,
  adminCreateMediaAsset,
  adminUpdateMediaAsset,
  adminDeleteMediaAsset,
} from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type { MediaAssetRow } from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/media-library")({
  head: () => privateSeo("Media Library · CMS"),
  component: () => <AdminMediaLibraryPage />,
});

interface FormState {
  file_name: string;
  file_type: string;
  url: string;
  alt_text: string;
}

const EMPTY_FORM: FormState = {
  file_name: "",
  file_type: "image/jpeg",
  url: "",
  alt_text: "",
};

function toForm(asset: MediaAssetRow): FormState {
  return {
    file_name: asset.file_name,
    file_type: asset.file_type,
    url: asset.url,
    alt_text: asset.alt_text ?? "",
  };
}

function AdminMediaLibraryPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<MediaAssetRow | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [pendingDelete, setPendingDelete] = useState<MediaAssetRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "media-assets"],
    queryFn: adminFetchMediaAssets,
  });

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "media-assets"] });
  };

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (asset: MediaAssetRow) => {
    setEditing(asset);
    setForm(toForm(asset));
    setDialogOpen(true);
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        file_name: form.file_name.trim(),
        file_type: form.file_type.trim() || "image/jpeg",
        url: form.url.trim(),
        alt_text: form.alt_text.trim() || null,
      };
      return editing ? adminUpdateMediaAsset(editing.id, payload) : adminCreateMediaAsset(payload);
    },
    onSuccess: () => {
      setDialogOpen(false);
      invalidate();
      toast({ title: editing ? "Asset updated" : "Asset created" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not save asset", description: err.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: adminDeleteMediaAsset,
    onSuccess: () => {
      setPendingDelete(null);
      invalidate();
      toast({ title: "Asset deleted" });
    },
    onError: (err: Error) =>
      toast({ title: "Could not delete asset", description: err.message, variant: "destructive" }),
  });

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter(
        (p) => p.file_name.toLowerCase().includes(term) || p.alt_text?.toLowerCase().includes(term),
      );
    }
    return list;
  }, [data, search]);

  const canSave = form.file_name.trim().length > 0 && form.url.trim().length > 0;

  return (
    <>
      <AdminPageHeading
        eyebrow="Content"
        title="Media Library"
        description="Manage images, documents, and videos."
        actions={
          <Button type="button" variant="gradient" size="sm" onClick={openNew}>
            <Plus className="h-4 w-4 mr-1.5" />
            Add asset
          </Button>
        }
      />

      <AdminCard>
        <AdminToolbar>
          <AdminSearch
            value={search}
            onChange={setSearch}
            placeholder="Search media by name or alt text…"
          />
        </AdminToolbar>

        {isLoading ? (
          <AdminTableSkeleton rows={5} cols={3} />
        ) : filtered.length === 0 ? (
          <AdminEmpty
            title="No media assets found"
            description="Upload your first image or document."
            action={
              <Button type="button" variant="gradient" size="sm" onClick={openNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                Add asset
              </Button>
            }
          />
        ) : (
          <AdminTable
            head={
              <>
                <th>Preview</th>
                <th>File Details</th>
                <th className="text-right">Actions</th>
              </>
            }
          >
            {filtered.map((asset) => (
              <tr key={asset.id} className="group hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5">
                <td className="w-20">
                  {asset.file_type.startsWith("image/") ? (
                    <img
                      src={asset.url}
                      alt={asset.alt_text || asset.file_name}
                      className="h-10 w-10 rounded-md object-cover border border-border"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md border border-border flex items-center justify-center bg-muted">
                      <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium truncate max-w-sm" title={asset.file_name}>
                      {asset.file_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {asset.file_type} • {new Date(asset.uploaded_at).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(asset)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => setPendingDelete(asset)}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Asset" : "Add Asset"}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label>File Name</Label>
              <Input
                value={form.file_name}
                placeholder="e.g. hero-banner.jpg"
                onChange={(e) => set("file_name", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>File Type</Label>
              <Input
                value={form.file_type}
                placeholder="e.g. image/jpeg, image/png, application/pdf"
                onChange={(e) => set("file_type", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Asset URL</Label>
              <Input
                value={form.url}
                placeholder="https://..."
                onChange={(e) => set("url", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For now, provide a direct URL to the hosted image/file.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Alt Text (SEO/Accessibility)</Label>
              <Input
                value={form.alt_text}
                placeholder="A descriptive text for the image"
                onChange={(e) => set("alt_text", e.target.value)}
              />
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
            <AlertDialogTitle>Delete Asset?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Make sure it is not being used on the site.
            </AlertDialogDescription>
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
