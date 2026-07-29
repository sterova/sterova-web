import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Eye, FileText, FolderKanban, Mail, MessageSquare, Star } from "lucide-react";
import {
  AdminCard,
  AdminCardHeader,
  AdminError,
  AdminPageHeading,
  AdminTableSkeleton,
  StatTile,
  StatusBadge,
} from "@/components/admin/AdminUI";
import { Button } from "@/components/ui/button";
import {
  adminFetchMessages,
  adminFetchPosts,
  adminFetchProjects,
  adminFetchReviews,
} from "@/lib/api";
import { ADMIN_ROUTES } from "@/data/admin-constants";
import { formatDate } from "@/lib/utils";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/dashboard")({
  head: () => privateSeo("Dashboard · CMS"),
  component: () => <AdminDashboardPage />,
});

function AdminDashboardPage() {
  const posts = useQuery({ queryKey: ["admin", "posts"], queryFn: adminFetchPosts });
  const reviews = useQuery({ queryKey: ["admin", "reviews"], queryFn: adminFetchReviews });
  const projects = useQuery({ queryKey: ["admin", "projects"], queryFn: adminFetchProjects });
  const messages = useQuery({ queryKey: ["admin", "messages"], queryFn: adminFetchMessages });

  const isLoading =
    posts.isLoading || reviews.isLoading || projects.isLoading || messages.isLoading;
  const error = posts.error || reviews.error || projects.error || messages.error;

  const totalPosts = posts.data?.length ?? 0;
  const publishedCount = posts.data?.filter((p) => p.published).length ?? 0;
  const draftCount = totalPosts - publishedCount;
  const pendingReviews = reviews.data?.filter((r) => r.status === "pending").length ?? 0;
  const totalReviews = reviews.data?.length ?? 0;
  const newMessages = messages.data?.filter((m) => m.status === "new").length ?? 0;
  const totalMessages = messages.data?.length ?? 0;
  const activeProjects = projects.data?.filter((p) => p.is_active).length ?? 0;
  const totalViews = posts.data?.reduce((sum, p) => sum + p.views, 0) ?? 0;

  const recentMessages = messages.data?.slice(0, 5) ?? [];
  const recentPosts = posts.data?.slice(0, 5) ?? [];
  const topPosts = [...(posts.data ?? [])].sort((a, b) => b.views - a.views).slice(0, 5) ?? [];
  const maxViews = topPosts[0]?.views || 1;

  return (
    <>
      <AdminPageHeading
        eyebrow="Overview"
        title="Content dashboard"
        description="A live snapshot of publishing activity, audience reach, and everything waiting on you."
        actions={
          <>
            <Button asChild variant="outline" size="sm">
              <Link to={ADMIN_ROUTES.messages}>Open inbox</Link>
            </Button>
            <Button asChild size="sm">
              <Link to={ADMIN_ROUTES.postNew}>New post</Link>
            </Button>
          </>
        }
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile
              label="Blog posts"
              value={totalPosts}
              icon={FileText}
              hint={`${publishedCount} published · ${draftCount} draft`}
              accent
              progress={totalPosts ? (publishedCount / totalPosts) * 100 : 0}
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
              hint={pendingReviews > 0 ? "Awaiting moderation" : "Nothing to review"}
              accent={pendingReviews > 0}
              progress={totalReviews ? (pendingReviews / totalReviews) * 100 : 0}
            />
            <StatTile
              label="New messages"
              value={newMessages}
              icon={Mail}
              hint={newMessages > 0 ? "Unread enquiries" : "Inbox clear"}
              accent={newMessages > 0}
              progress={totalMessages ? (newMessages / totalMessages) * 100 : 0}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <AdminCard className="xl:col-span-2">
              <AdminCardHeader
                title="Recent enquiries"
                description="Latest contact form submissions"
                action={
                  <Link
                    to={ADMIN_ROUTES.messages}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                }
              />
              {isLoading ? (
                <AdminTableSkeleton rows={5} cols={3} />
              ) : recentMessages.length === 0 ? (
                <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No messages yet.
                </p>
              ) : (
                <ul className="divide-y divide-border/70">
                  {recentMessages.map((m) => (
                    <li key={m.id} className="flex items-start gap-3 px-5 py-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <MessageSquare className="h-4 w-4" aria-hidden="true" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-sm font-medium">{m.name}</p>
                          <StatusBadge status={m.status} />
                        </div>
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                          {m.subject || m.message}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(m.created_at)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard>
              <AdminCardHeader title="Top performing posts" description="By lifetime views" />
              {isLoading ? (
                <AdminTableSkeleton rows={5} cols={2} />
              ) : topPosts.length === 0 ? (
                <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No posts yet.
                </p>
              ) : (
                <ul className="flex flex-col gap-4 p-5">
                  {topPosts.map((p) => (
                    <li key={p.id} className="min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <Link
                          to={ADMIN_ROUTES.postEdit(p.id)}
                          className="truncate text-sm font-medium hover:text-primary"
                        >
                          {p.title}
                        </Link>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {p.views.toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="gradient-brand h-full rounded-full"
                          style={{ width: `${Math.max(4, (p.views / maxViews) * 100)}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AdminCard>
              <AdminCardHeader
                title="Recently edited posts"
                action={
                  <Link
                    to={ADMIN_ROUTES.posts}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                }
              />
              {isLoading ? (
                <AdminTableSkeleton rows={5} cols={3} />
              ) : recentPosts.length === 0 ? (
                <p className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No posts yet.
                </p>
              ) : (
                <ul className="divide-y divide-border/70">
                  {recentPosts.map((p) => (
                    <li key={p.id}>
                      <Link
                        to={ADMIN_ROUTES.postEdit(p.id)}
                        className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/40"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-medium">{p.title}</p>
                            <StatusBadge status={p.published ? "published" : "draft"} />
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {p.blog_categories?.name ?? "Uncategorised"} ·{" "}
                            {p.views.toLocaleString()} views
                          </p>
                        </div>
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </AdminCard>

            <AdminCard>
              <AdminCardHeader title="Quick actions" description="Jump straight into a workflow" />
              <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
                {[
                  {
                    to: ADMIN_ROUTES.postNew,
                    label: "Write a new post",
                    hint: "Draft & publish",
                    icon: FileText,
                  },
                  {
                    to: ADMIN_ROUTES.projects,
                    label: "Manage projects",
                    hint: `${activeProjects} active`,
                    icon: FolderKanban,
                  },
                  {
                    to: ADMIN_ROUTES.reviews,
                    label: "Moderate reviews",
                    hint: `${pendingReviews} pending`,
                    icon: Star,
                  },
                  {
                    to: ADMIN_ROUTES.categories,
                    label: "Organise categories",
                    hint: "Taxonomy",
                    icon: MessageSquare,
                  },
                ].map(({ to, label, hint, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/40"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{label}</p>
                      <p className="truncate text-xs text-muted-foreground">{hint}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </AdminCard>
          </div>
        </>
      )}
    </>
  );
}
