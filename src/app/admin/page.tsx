import type { Metadata } from "next";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyAdminRequest } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package, Briefcase, Star, HelpCircle, BookOpen, Mail, Users, Settings,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard" };

async function getCounts() {
  const supabase = createServiceClient();
  const [
    { count: services },
    { count: portfolio },
    { count: testimonials },
    { count: faqs },
    { count: reviews },
    { count: blog },
    { count: messages },
  ] = await Promise.allSettled([
    supabase.from("services").select("*", { count: "exact", head: true }),
    supabase.from("portfolio_items").select("*", { count: "exact", head: true }),
    supabase.from("testimonials").select("*", { count: "exact", head: true }),
    supabase.from("faqs").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("approved", true),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("published", true),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]).then((r) =>
    r.map((res) => (res.status === "fulfilled" ? res.value : { count: null }))
  );

  return { services, portfolio, testimonials, faqs, reviews, blog, messages };
}

export default async function AdminDashboardPage() {
  const session = await verifyAdminRequest();
  if (!session) redirect("/admin/login");

  const counts = await getCounts();

  const cards = [
    { label: "Services", count: counts.services, href: "/admin/services", icon: Package, color: "text-violet-500 bg-violet-500/10" },
    { label: "Portfolio Projects", count: counts.portfolio, href: "/admin/portfolio", icon: Briefcase, color: "text-blue-500 bg-blue-500/10" },
    { label: "Testimonials", count: counts.testimonials, href: "/admin/testimonials", icon: Users, color: "text-pink-500 bg-pink-500/10" },
    { label: "FAQs", count: counts.faqs, href: "/admin/faqs", icon: HelpCircle, color: "text-yellow-500 bg-yellow-500/10" },
    { label: "Approved Reviews", count: counts.reviews, href: "/admin/reviews", icon: Star, color: "text-amber-500 bg-amber-500/10" },
    { label: "Published Posts", count: counts.blog, href: "/admin/blog", icon: BookOpen, color: "text-green-500 bg-green-500/10" },
    { label: "New Messages", count: counts.messages, href: "/admin/contact", icon: Mail, color: "text-red-500 bg-red-500/10" },
    { label: "Site Settings", count: null, href: "/admin/settings", icon: Settings, color: "text-slate-500 bg-slate-500/10" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {session.email}. Here&apos;s an overview of your site.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border bg-background p-5 hover:border-primary/40 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
              {card.count !== null && card.count !== undefined && (
                <span className="text-2xl font-bold font-display">{card.count}</span>
              )}
            </div>
            <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {card.label}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border bg-background p-6">
        <h2 className="text-base font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Add Service", href: "/admin/services" },
            { label: "Add Portfolio Project", href: "/admin/portfolio" },
            { label: "Add FAQ", href: "/admin/faqs" },
            { label: "Write Blog Post", href: "/admin/blog" },
            { label: "Edit Site Settings", href: "/admin/settings" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="text-sm px-4 py-2 rounded-xl border hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all"
            >
              + {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
