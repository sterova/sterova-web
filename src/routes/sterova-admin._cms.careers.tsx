import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Briefcase, Loader2, Plus, Trash2 } from "lucide-react";
import {
  AdminCard,
  AdminCardHeader,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  adminCreateJobOpening,
  adminDeleteApplication,
  adminDeleteJobOpening,
  adminFetchApplications,
  adminFetchJobOpenings,
  adminSetApplicationStatus,
  adminUpdateJobOpening,
  recordAudit,
} from "@/lib/cms-api";
import { exportToCsv } from "@/lib/export";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { privateSeo } from "@/lib/seo";
import type {
  ApplicationStatus,
  EmploymentType,
  JobApplicationRow,
  JobOpeningRow,
} from "@/types/database";

export const Route = createFileRoute("/sterova-admin/_cms/careers")({
  head: () => privateSeo("Careers · CMS"),
  component: () => <CareersPage />,
});

const EMPLOYMENT_TYPES: EmploymentType[] = ["full_time", "part_time", "contract", "internship"];
const APPLICATION_STATUSES: ApplicationStatus[] = [
  "new",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
];

type Draft = {
  title: string;
  slug: string;
  department: string;
  location: string;
  employment_type: EmploymentType;
  experience: string;
  description: string;
  requirements: string;
  is_open: boolean;
  display_order: number;
};

const EMPTY: Draft = {
  title: "",
  slug: "",
  department: "",
  location: "Remote",
  employment_type: "full_time",
  experience: "",
  description: "",
  requirements: "",
  is_open: true,
  display_order: 0,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function CareersPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<JobOpeningRow | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ApplicationStatus | "all">("all");

  const openings = useQuery({
    queryKey: ["admin", "job-openings"],
    queryFn: adminFetchJobOpenings,
    retry: false,
  });
  const applications = useQuery({
    queryKey: ["admin", "job-applications"],
    queryFn: adminFetchApplications,
    retry: false,
  });

  const filteredApplications = useMemo(() => {
    const list = applications.data ?? [];
    const term = search.trim().toLowerCase();
    return list.filter((row) => {
      if (filter !== "all" && row.status !== filter) return false;
      if (!term) return true;
      return [row.name, row.email, row.job_title, row.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [applications.data, filter, search]);

  const invalidateOpenings = () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "job-openings"] });
    void queryClient.invalidateQueries({ queryKey: ["job-openings"] });
  };

  const saveOpening = useMutation({
    mutationFn: async () => {
      const payload = {
        title: draft.title,
        slug: draft.slug || slugify(draft.title),
        department: draft.department || null,
        location: draft.location || null,
        employment_type: draft.employment_type,
        experience: draft.experience || null,
        description: draft.description,
        requirements: draft.requirements
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean),
        is_open: draft.is_open,
        display_order: draft.display_order,
      };
      if (editing) {
        await adminUpdateJobOpening(editing.id, payload);
        await recordAudit({
          action: "update",
          entity: "job_openings",
          entity_id: editing.id,
          summary: draft.title,
        });
      } else {
        await adminCreateJobOpening(payload);
        await recordAudit({ action: "create", entity: "job_openings", summary: draft.title });
      }
    },
    onSuccess: () => {
      invalidateOpenings();
      setOpen(false);
      toast({ title: editing ? "Role updated" : "Role published" });
    },
    onError: (err: Error) =>
      toast({ title: "Save failed", description: err.message, variant: "destructive" }),
  });

  const toggleOpening = useMutation({
    mutationFn: (input: { id: string; is_open: boolean }) =>
      adminUpdateJobOpening(input.id, { is_open: input.is_open }),
    onSuccess: invalidateOpenings,
  });

  const removeOpening = useMutation({
    mutationFn: (row: JobOpeningRow) => adminDeleteJobOpening(row.id),
    onSuccess: () => {
      invalidateOpenings();
      toast({ title: "Role removed" });
    },
    onError: (err: Error) =>
      toast({ title: "Delete failed", description: err.message, variant: "destructive" }),
  });

  const setStatus = useMutation({
    mutationFn: (input: { row: JobApplicationRow; status: ApplicationStatus }) =>
      adminSetApplicationStatus(input.row.id, input.status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "job-applications"] });
    },
    onError: (err: Error) =>
      toast({ title: "Update failed", description: err.message, variant: "destructive" }),
  });

  const removeApplication = useMutation({
    mutationFn: (row: JobApplicationRow) => adminDeleteApplication(row.id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["admin", "job-applications"] });
      toast({ title: "Application deleted" });
    },
  });

  const startCreate = () => {
    setEditing(null);
    setDraft({ ...EMPTY, display_order: (openings.data?.length ?? 0) + 1 });
    setOpen(true);
  };

  const startEdit = (row: JobOpeningRow) => {
    setEditing(row);
    setDraft({
      title: row.title,
      slug: row.slug,
      department: row.department ?? "",
      location: row.location ?? "",
      employment_type: row.employment_type,
      experience: row.experience ?? "",
      description: row.description,
      requirements: (row.requirements ?? []).join("\n"),
      is_open: row.is_open,
      display_order: row.display_order,
    });
    setOpen(true);
  };

  return (
    <>
      <AdminPageHeading
        eyebrow="Hiring"
        title="Careers"
        description="Publish open roles and move applicants through the hiring pipeline."
        actions={
          <Button size="sm" onClick={startCreate}>
            <Plus className="h-4 w-4" />
            New role
          </Button>
        }
      />

      <div className="space-y-6">
        {openings.error ? (
          <AdminError message={(openings.error as Error).message} />
        ) : (
          <AdminCard>
            <AdminCardHeader title="Open roles" description="Shown on the public careers page" />
            {openings.isLoading ? (
              <AdminTableSkeleton cols={4} />
            ) : (openings.data?.length ?? 0) === 0 ? (
              <AdminEmpty
                title="No roles published"
                description="Create a role to start collecting applications."
              />
            ) : (
              <AdminTable
                head={
                  <>
                    <th>Role</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th className="text-right">Actions</th>
                  </>
                }
              >
                {openings.data?.map((row) => (
                  <AdminRow key={row.id}>
                    <td>
                      <button
                        type="button"
                        onClick={() => startEdit(row)}
                        className="text-left font-medium hover:underline"
                      >
                        {row.title}
                      </button>
                      <p className="text-xs text-muted-foreground">
                        {row.department || "—"} · /{row.slug}
                      </p>
                    </td>
                    <td className="text-sm capitalize">{row.employment_type.replace("_", " ")}</td>
                    <td className="text-sm text-muted-foreground">{row.location || "—"}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <Switch
                          checked={row.is_open}
                          aria-label={`Toggle open for ${row.title}`}
                          onCheckedChange={(checked) =>
                            toggleOpening.mutate({ id: row.id, is_open: checked })
                          }
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete ${row.title}`}
                          onClick={() => removeOpening.mutate(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </AdminRow>
                ))}
              </AdminTable>
            )}
          </AdminCard>
        )}

        {applications.error ? (
          <AdminError message={(applications.error as Error).message} />
        ) : (
          <AdminCard>
            <AdminCardHeader
              title="Applications"
              description="Every submission from the careers page"
            />
            <AdminToolbar>
              <AdminSearch value={search} onChange={setSearch} placeholder="Search applicants…" />
              <AdminFilterTabs
                value={filter}
                onChange={setFilter}
                options={[
                  { value: "all", label: "All", count: applications.data?.length },
                  ...APPLICATION_STATUSES.map((status) => ({
                    value: status,
                    label: status[0].toUpperCase() + status.slice(1),
                    count: applications.data?.filter((r) => r.status === status).length,
                  })),
                ]}
              />
              <Button
                size="sm"
                variant="outline"
                className="ml-auto"
                disabled={!filteredApplications.length}
                onClick={() =>
                  exportToCsv("job-applications", filteredApplications, [
                    { header: "Name", value: (r) => r.name },
                    { header: "Email", value: (r) => r.email },
                    { header: "Phone", value: (r) => r.phone ?? "" },
                    { header: "Role", value: (r) => r.job_title ?? "" },
                    { header: "Status", value: (r) => r.status },
                    { header: "Portfolio", value: (r) => r.portfolio_url ?? "" },
                    { header: "Resume", value: (r) => r.resume_url ?? "" },
                    { header: "Applied", value: (r) => r.created_at },
                  ])
                }
              >
                Export CSV
              </Button>
            </AdminToolbar>

            {applications.isLoading ? (
              <AdminTableSkeleton cols={5} />
            ) : filteredApplications.length === 0 ? (
              <AdminEmpty
                icon={Briefcase}
                title="No applications"
                description="Applications submitted from the careers page land here."
              />
            ) : (
              <AdminTable
                head={
                  <>
                    <th>Applicant</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Applied</th>
                    <th className="text-right">Actions</th>
                  </>
                }
              >
                {filteredApplications.map((row) => (
                  <AdminRow key={row.id}>
                    <td>
                      <p className="font-medium">{row.name}</p>
                      <a
                        href={`mailto:${row.email}`}
                        className="text-xs text-muted-foreground hover:underline"
                      >
                        {row.email}
                      </a>
                    </td>
                    <td className="text-sm text-muted-foreground">{row.job_title || "—"}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="text-xs text-muted-foreground">{formatDate(row.created_at)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-2">
                        <select
                          aria-label={`Status for ${row.name}`}
                          value={row.status}
                          onChange={(e) =>
                            setStatus.mutate({
                              row,
                              status: e.target.value as ApplicationStatus,
                            })
                          }
                          className="h-8 rounded-md border border-border bg-card px-2 text-xs"
                        >
                          {APPLICATION_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <Button
                          size="icon"
                          variant="ghost"
                          aria-label={`Delete application from ${row.name}`}
                          onClick={() => removeApplication.mutate(row)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </AdminRow>
                ))}
              </AdminTable>
            )}
          </AdminCard>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit role" : "New role"}</DialogTitle>
            <DialogDescription>Only open roles appear on the public site.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="j-title">Title</Label>
              <Input
                id="j-title"
                value={draft.title}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    title: e.target.value,
                    slug: editing ? draft.slug : slugify(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="j-slug">Slug</Label>
              <Input
                id="j-slug"
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: slugify(e.target.value) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="j-department">Department</Label>
              <Input
                id="j-department"
                value={draft.department}
                onChange={(e) => setDraft({ ...draft, department: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="j-location">Location</Label>
              <Input
                id="j-location"
                value={draft.location}
                onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="j-type">Employment type</Label>
              <select
                id="j-type"
                value={draft.employment_type}
                onChange={(e) =>
                  setDraft({ ...draft, employment_type: e.target.value as EmploymentType })
                }
                className="h-9 w-full rounded-md border border-border bg-card px-2 text-sm"
              >
                {EMPLOYMENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="j-experience">Experience</Label>
              <Input
                id="j-experience"
                placeholder="2–4 years"
                value={draft.experience}
                onChange={(e) => setDraft({ ...draft, experience: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="j-description">Description</Label>
              <Textarea
                id="j-description"
                rows={4}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="j-requirements">Requirements (one per line)</Label>
              <Textarea
                id="j-requirements"
                rows={4}
                value={draft.requirements}
                onChange={(e) => setDraft({ ...draft, requirements: e.target.value })}
              />
            </div>
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <Switch
                checked={draft.is_open}
                onCheckedChange={(checked) => setDraft({ ...draft, is_open: checked })}
              />
              Accepting applications
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={saveOpening.isPending || !draft.title.trim()}
              onClick={() => saveOpening.mutate()}
            >
              {saveOpening.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Save changes" : "Publish role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
