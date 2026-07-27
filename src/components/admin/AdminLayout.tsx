import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Star,
  Tags,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { ADMIN_ROUTES } from "@/data/admin-constants";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: ADMIN_ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ADMIN_ROUTES.posts, label: "Blog Posts", icon: FileText },
  { href: ADMIN_ROUTES.categories, label: "Categories", icon: Tags },
  { href: ADMIN_ROUTES.projects, label: "Projects", icon: FolderKanban },
  { href: ADMIN_ROUTES.reviews, label: "Reviews", icon: Star },
  { href: ADMIN_ROUTES.messages, label: "Messages", icon: Mail },
];

export default function AdminLayout({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="CMS sections">
      {NAV_ITEMS.map((item) => {
        // Sub-routes like /posts/new should keep "Blog Posts" highlighted.
        const isActive =
          location === item.href ||
          (item.href !== ADMIN_ROUTES.dashboard &&
            location.startsWith(`${item.href}/`));
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <Helmet>
        <title>{`${title} · Sterova CMS`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex bg-secondary/20">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r bg-background">
          <div className="h-16 flex items-center px-5 border-b">
            <span className="font-display font-bold tracking-tight">
              Sterova
              <span className="text-muted-foreground font-normal text-sm ml-1.5">
                CMS
              </span>
            </span>
          </div>
          <div className="flex-1 p-3 overflow-y-auto">{nav}</div>
          <div className="p-3 border-t flex flex-col gap-2">
            <p className="px-3 text-xs text-muted-foreground truncate">
              {user?.email}
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start gap-2.5 text-muted-foreground"
              onClick={() => void signOut()}
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <button
              type="button"
              className="absolute inset-0 bg-foreground/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative w-64 bg-background flex flex-col border-r">
              <div className="h-16 flex items-center justify-between px-5 border-b">
                <span className="font-display font-bold">Sterova CMS</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 p-3 overflow-y-auto">{nav}</div>
              <div className="p-3 border-t">
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
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 shrink-0 border-b bg-background flex items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              className="lg:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="font-display font-semibold tracking-tight truncate">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-muted-foreground truncate">
                  {description}
                </p>
              )}
            </div>
            {actions && (
              <div className="flex items-center gap-2 shrink-0">{actions}</div>
            )}
          </header>

          <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">{children}</main>
        </div>
      </div>
    </>
  );
}
