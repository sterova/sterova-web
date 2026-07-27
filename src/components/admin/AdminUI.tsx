import { AlertCircle, Inbox, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Centred spinner for panel-level loading states. */
export function AdminLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
    >
      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
      <span>{message}</span>
    </div>
  );
}

export function AdminEmpty({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
        <Inbox className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </div>
      <h2 className="font-semibold mb-1.5">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Card wrapper used for every admin panel so spacing stays consistent. */
export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-background shadow-sm overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  // Contact message statuses
  new: "bg-primary/10 text-primary border-primary/20",
  read: "bg-secondary text-secondary-foreground border-border",
  replied: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  archived: "bg-muted text-muted-foreground border-border",
  // Review statuses
  pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  // Post statuses
  published: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  draft: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  // Project statuses
  active: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  hidden: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        STATUS_STYLES[status] ?? "bg-secondary text-secondary-foreground border-border",
        className,
      )}
    >
      {status}
    </span>
  );
}

/** Small labelled metric tile for the dashboard. */
export function StatTile({
  label,
  value,
  icon: Icon,
  hint,
  accent = false,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className="font-display text-2xl font-bold mt-1.5 tabular-nums">
            {value}
          </p>
          {hint && (
            <p className="text-xs text-muted-foreground mt-1 truncate">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
            accent
              ? "bg-primary/10 text-primary"
              : "bg-secondary text-muted-foreground",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
