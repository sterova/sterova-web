import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ChevronsLeft,
  ChevronsRight,
  ExternalLink,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Link2,
  LogOut,
  Mail,
  Menu,
  ShieldCheck,
  Star,
  Tags,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useAuth } from "@/lib/auth-context";
import { ADMIN_ROUTES } from "@/data/admin-constants";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: ADMIN_ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Content",
    items: [
      { href: ADMIN_ROUTES.posts, label: "Blog posts", icon: FileText },
      { href: ADMIN_ROUTES.categories, label: "Categories", icon: Tags },
      { href: ADMIN_ROUTES.projects, label: "Projects", icon: FolderKanban },
      { href: ADMIN_ROUTES.results, label: "Results", icon: TrendingUp },
      { href: ADMIN_ROUTES.team, label: "Team", icon: Users },
      { href: ADMIN_ROUTES.brandLinks, label: "Brand Links", icon: Link2 },
    ],
  },
  {
    label: "Community",
    items: [
      { href: ADMIN_ROUTES.reviews, label: "Reviews", icon: Star },
      { href: ADMIN_ROUTES.messages, label: "Messages", icon: Mail },
    ],
  },
  {
    label: "Security",
    items: [{ href: ADMIN_ROUTES.sessions, label: "Sessions", icon: ShieldCheck }],
  },
];

const COLLAPSE_KEY = "sterova-cms-sidebar";

function isActivePath(pathname: string, href: string) {
  if (href === ADMIN_ROUTES.dashboard) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarNav({
  pathname,
  collapsed,
  onNavigate,
}: {
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-6" aria-label="CMS sections">
      {NAV_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-1">
          {!collapsed && (
            <p className="px-3 pb-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
              {group.label}
            </p>
          )}
          {group.items.map((item) => {
            const active = isActivePath(pathname, item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onNavigate}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
                  collapsed && "justify-center px-0",
                  active
                    ? "bg-primary/10 text-primary shadow-[inset_0_1px_0_rgb(255_255_255/0.08)]"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                />
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="gradient-brand font-display flex h-8 w-8 items-center justify-center rounded-xl text-sm font-bold text-primary-foreground">
        S
      </span>
      {!collapsed && (
        <span className="font-display text-sm font-bold tracking-tight">
          Sterova
          <span className="ml-1.5 text-xs font-medium text-muted-foreground">CMS</span>
        </span>
      )}
    </span>
  );
}

/**
 * Premium CMS chrome: a persistent, collapsible sidebar plus a sticky topbar
 * with breadcrumb context, theme control, and account actions.
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const current =
    NAV_GROUPS.flatMap((g) => g.items).find((i) => isActivePath(pathname, i.href))?.label ??
    "Dashboard";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/70 bg-sidebar/95 backdrop-blur-xl transition-[width] duration-200 lg:flex",
          collapsed ? "w-[4.5rem]" : "w-64",
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-border/70 px-4",
            collapsed && "justify-center px-0",
          )}
        >
          <Brand collapsed={collapsed} />
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <SidebarNav pathname={pathname} collapsed={collapsed} />
        </div>
        <div className="flex flex-col gap-2 border-t border-border/70 p-3">
          {!collapsed && (
            <>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                View live site
              </a>
              <div className="rounded-xl border border-border/70 bg-card p-3">
                <p className="truncate text-xs font-medium">{user?.email}</p>
                <p className="mt-0.5 text-[0.7rem] text-muted-foreground">Administrator</p>
              </div>
            </>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className={cn(
              "gap-2.5 text-muted-foreground",
              collapsed ? "justify-center" : "justify-start",
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronsLeft className="h-4 w-4" />
                Collapse
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex w-72 flex-col border-r border-border/70 bg-sidebar">
            <div className="flex h-16 items-center justify-between border-b border-border/70 px-4">
              <Brand />
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              <SidebarNav
                pathname={pathname}
                collapsed={false}
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
            <div className="border-t border-border/70 p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2.5 text-muted-foreground"
                onClick={() => void signOut()}
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/70 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
          <button
            type="button"
            className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
            <ol className="flex items-center gap-2 text-sm">
              <li className="hidden text-muted-foreground sm:block">Sterova CMS</li>
              <li className="hidden text-muted-foreground/50 sm:block" aria-hidden="true">
                /
              </li>
              <li className="truncate font-medium">{current}</li>
            </ol>
          </nav>
          <div className="flex shrink-0 items-center gap-1.5">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => void signOut()}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 bg-surface">
          <div className="mx-auto flex w-full max-w-[110rem] flex-col gap-6 p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
