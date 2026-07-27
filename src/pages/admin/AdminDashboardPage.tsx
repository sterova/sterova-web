import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowRight,
  Eye,
  FileText,
  FolderKanban,
  Mail,
  Star,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  AdminCard,
  AdminError,
  AdminLoading,
  StatTile,
  StatusBadge,
} from "@/components/admin/AdminUI";
import {
  adminFetchMessages,
  adminFetchPosts,
  adminFetchProjects,
  adminFetchReviews,
} from "@/lib/api";
import { ADMIN_ROUTES } from "@/data/admin-constants";
import { formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: adminFetchPosts });
  const reviews = useQuery({ queryKey: ["admin", "reviews"], queryFn: adminFetchReviews });
  const projects = useQuery({ queryKey: ["admin", "projects"], queryFn: adminFetchProjects });
  const messages = useQuery({ queryKey: ["admin", "messages"], queryFn: adminFetchMessages });

  const isLoading =
    posts.isLoading || reviews.isLoading || projects.isLoading || messages.isLoading;
  const error =
    posts.error || reviews.error || projects.error || messages.error;

  const publishedCount = posts.data?.filter((p) => p.published).length ?? 0;
  const draftCount = (posts.data?.length ?? 0) - publishedCount;
  const pendingReviews = reviews.data?.filter((r) => r.status === "pending").length ?? 0;
  const newMessages = messages.data?.filter((m) => m.status === "new").length ?? 0;
  const totalViews = posts.data?.reduce((sum, p) => sum + p.views, 0) ?? 0;

  const recentMessages = messages.data?.slice(0, 5) ?? [];
  const recentPosts = posts.data?.slice(0, 5) ?? [];

  return (
    <AdminLayout
      title="Dashboard"
      description="Overview of your content and inbox"
    >
      {error ? (
        <AdminError message={(error as Error).message} />
      ) : isLoading ? (
        <AdminLoading />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatTile
              label="Blog posts"
              value={posts.data?.length ?? 0}
              icon={FileText}
              hint={`${publishedCount} published · ${draftCount} draft`}
              accent
            />
            <StatTile
              label="Total views"
              value={totalViews.toLocaleString()}
              icon={Eye}
              hint="Across all published posts"
            />
            <StatTile
              label="Pending reviews"
              value={pendingReviews}
              icon={Star}
              hint={
                pendingReviews > 0 ? "Awaiting moderation" : "Nothing to review"
              }
              accent={pendingReviews > 0}
            />
            <StatTile
              label="New messages"
              value={newMessages}
              icon={Mail}
              hint={newMessages > 0 ? "Unread enquiries" : "Inbox clear"}
              accent={newMessages > 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent messages */}
            <AdminCard>
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="font-semibold text-sm">Recent messages</h2>
                <Link
                  href={ADMIN_ROUTES.messages}
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:gap-1.5 transition-all"
                >
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {recentMessages.length === 0 ? (
                <p className="px-5 py-10 text-sm text-muted-foreground text-center">
                  No messages yet.
                </p>
              ) : (
                <ul className="divide-y">
                  {recentMessages.map((m) => (
                    <li key={m.id} className="px-5 py-3.5 flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium truncate">{m.name}</p>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {m.subject || m.message}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {formatDate(m.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            {/* Recent posts */}
            <AdminCard>
              <div className="flex items-center justify-between px-5 py-4 border-b">
                <h2 className="font-semibold text-sm">Recently edited posts</h2>
                <Link
                  href={ADMIN_ROUTES.posts}
                  className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:gap-1.5 transition-all"
                >
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {recentPosts.length === 0 ? (
                <p className="px-5 py-10 text-sm text-muted-foreground text-center">
                  No posts yet.
                </p>
              ) : (
                <ul className="divide-y">
                  {recentPosts.map((p) => (
                    <li key={p.id}>
                      <Link
                        href={ADMIN_ROUTES.postEdit(p.id)}
                        className="px-5 py-3.5 flex items-start gap-3 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-medium truncate">
                              {p.title}
                            </p>
                            <StatusBadge
                              status={p.published ? "published" : "draft"}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {p.blog_categories?.name ?? "Uncategorised"} ·{" "}
                            {p.views.toLocaleString()} views
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: ADMIN_ROUTES.postNew, label: "Write a new post", icon: FileText },
              { href: ADMIN_ROUTES.projects, label: "Manage projects", icon: FolderKanban },
              { href: ADMIN_ROUTES.reviews, label: "Moderate reviews", icon: Star },
            ].map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-xl border bg-background p-4 shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium flex-1">{label}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
