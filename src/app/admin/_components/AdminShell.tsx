"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Package, Briefcase, MessageSquare, HelpCircle,
  Star, Settings, Mail, BookOpen, LogOut, Menu, X, Users,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Services", href: "/admin/services", icon: Package },
  { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  { label: "Testimonials", href: "/admin/testimonials", icon: Users },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Blog", href: "/admin/blog", icon: BookOpen },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Messages", href: "/admin/contact", icon: Mail },
  { label: "Audit Log", href: "/admin/audit", icon: MessageSquare },
];

function NavItem({
  item,
  pathname,
}: {
  item: (typeof NAV)[0];
  pathname: string;
}) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <item.icon className="h-4 w-4 shrink-0" />
      {item.label}
    </Link>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't render the shell on login/setup pages
  const isPublic = pathname === "/admin/login" || pathname === "/admin/setup";
  if (isPublic) return <>{children}</>;

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const sidebar = (
    <aside className="flex flex-col h-full bg-background border-r border-border/50 w-64 shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border/50">
        <Link href="/" className="font-display font-extrabold text-lg gradient-text">
          Sterova
        </Link>
        <span className="ml-2 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-medium">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/50 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          target="_blank"
        >
          <Package className="h-4 w-4 shrink-0" />
          View Site
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed left-0 top-0 bottom-0 z-50 lg:hidden transition-transform duration-200",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="lg:hidden h-14 flex items-center gap-3 px-4 border-b border-border/50 bg-background">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="font-semibold text-sm">Admin Panel</span>
        </div>

        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
