import * as React from "react";
import { AlertCircle, Inbox, Loader2, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/* ── Surfaces ─────────────────────────────────────────────────────────── */

/** Elevated panel used for every CMS block: tables, widgets, forms. */
export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("card-premium", className)}>{children}</div>;
}

export function AdminCardHeader({
  title,
  description,
  action,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="font-display text-sm font-semibold tracking-tight">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** Page title block that sits at the top of each CMS screen. */
export function AdminPageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <p className="text-eyebrow font-semibold uppercase text-primary">{eyebrow}</p>}
        <h1 className="heading-3 mt-1.5 font-bold">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

/* ── States ───────────────────────────────────────────────────────────── */

export function AdminLoading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** Table-shaped skeleton so lists keep their layout while data loads. */
export function AdminTableSkeleton({ rows = 6, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="divide-y divide-border/70" aria-busy="true">
      <span className="sr-only">Loading records…</span>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center gap-4 px-5 py-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              className={cn(
                "h-3.5 animate-pulse rounded-full bg-muted",
                c === 0 ? "flex-1" : "w-20 shrink-0",
              )}
              style={{ animationDelay: `${(r * cols + c) * 40}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function AdminError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive-soft p-4 text-sm text-destructive"
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function AdminEmpty({
  title,
  description,
  action,
  icon: Icon = Inbox,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/60 text-muted-foreground">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h2 className="font-display font-semibold">{title}</h2>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/* ── Badges & metrics ─────────────────────────────────────────────────── */

/* Status colour comes from the shared theme tokens so light/dark stay in sync. */
const TONE_STYLES = {
  info: "bg-info-soft text-info-foreground ring-info-border",
  success: "bg-success-soft text-success-foreground ring-success-border",
  warning: "bg-warning-soft text-warning-foreground ring-warning-border",
  danger: "bg-destructive-soft text-destructive ring-destructive/25",
  neutral: "bg-muted text-muted-foreground ring-border",
} as const;

const STATUS_TONES: Record<string, keyof typeof TONE_STYLES> = {
  new: "info",
  read: "neutral",
  replied: "success",
  archived: "neutral",
  pending: "warning",
  approved: "success",
  rejected: "danger",
  published: "success",
  draft: "warning",
  active: "success",
  hidden: "neutral",
  featured: "warning",
  revoked: "danger",
  online: "success",
  idle: "neutral",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.7rem] font-medium capitalize ring-1 ring-inset",
        TONE_STYLES[STATUS_TONES[status] ?? "neutral"],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {status}
    </span>
  );
}

/** Dashboard metric tile with an optional trend bar. */
export function StatTile({
  label,
  value,
  icon: Icon,
  hint,
  accent = false,
  progress,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
  accent?: boolean;
  /** 0–100; renders a subtle proportion bar under the value. */
  progress?: number;
}) {
  return (
    <div
      className={cn(
        "card-premium group relative overflow-hidden p-5 transition-all hover:-translate-y-0.5",
        accent && "border-primary/40 shadow-glow",
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-10 -top-14 h-32 w-32 rounded-full blur-2xl transition-opacity",
          accent ? "bg-primary/15 opacity-100" : "bg-primary/10 opacity-0 group-hover:opacity-100",
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className="font-display mt-2 text-3xl font-bold tabular-nums leading-none">{value}</p>
          {hint && <p className="mt-2 truncate text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset",
            accent
              ? "bg-primary/10 text-primary ring-primary/20"
              : "bg-muted text-muted-foreground ring-border",
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {typeof progress === "number" && (
        <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="gradient-brand h-full rounded-full transition-[width] duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

/* ── Filters & tables ─────────────────────────────────────────────────── */

export function AdminToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2.5 border-b border-border/70 bg-muted/30 px-4 py-3">
      {children}
    </div>
  );
}

export function AdminSearch({
  value,
  onChange,
  placeholder = "Search…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative min-w-[12rem] flex-1 sm:max-w-xs", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        aria-label={placeholder}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-lg bg-card pl-9 pr-8 text-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/** Segmented filter control — replaces scattered one-off select boxes. */
export function AdminFilterTabs<T extends string>({
  value,
  onChange,
  options,
  label = "Filter",
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string; count?: number }[];
  label?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card p-1"
    >
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {opt.label}
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 text-[0.65rem] tabular-nums",
                  isActive ? "bg-primary/15" : "bg-muted",
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Horizontally scrollable table frame with sticky, quiet headers. */
export function AdminTable({
  head,
  children,
  className,
}: {
  head: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full min-w-[42rem] border-collapse text-sm">
        <thead className="sticky top-0 z-10 bg-muted/50 backdrop-blur">
          <tr className="[&>th]:whitespace-nowrap [&>th]:px-5 [&>th]:py-3 [&>th]:text-left [&>th]:text-[0.7rem] [&>th]:font-semibold [&>th]:uppercase [&>th]:tracking-[0.12em] [&>th]:text-muted-foreground">
            {head}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/70">{children}</tbody>
      </table>
    </div>
  );
}

export const AdminRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ children, className, ...props }, ref) => {
  return (
    <tr
      ref={ref}
      className={cn(
        "group transition-colors hover:bg-muted/40 [&>td]:px-5 [&>td]:py-3.5 [&>td]:align-middle",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
});
AdminRow.displayName = "AdminRow";
