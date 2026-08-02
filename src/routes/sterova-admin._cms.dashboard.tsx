import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowRight,
  Bot,
  Calculator,
  CalendarClock,
  Eye,
  FileText,
  FolderKanban,
  Mail,
  MessageSquare,
  Star,
} from "lucide-react";
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
import {
  adminFetchChatbotEvents,
  adminFetchChatbotLeads,
  adminFetchConsultations,
  summariseChatbotEvents,
} from "@/lib/chatbot/admin-api";
import { adminFetchEstimatorSubmissions } from "@/lib/estimator-api";
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

          <ChatPipelineSection />

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

/* ── Chatbot & estimator pipeline ─────────────────────────────────────── */

function ChatPipelineSection() {
  const leads = useQuery({
    queryKey: ["admin", "chatbot-leads"],
    queryFn: adminFetchChatbotLeads,
    retry: false,
  });
  const consultations = useQuery({
    queryKey: ["admin", "consultations"],
    queryFn: adminFetchConsultations,
    retry: false,
  });
  const estimates = useQuery({
    queryKey: ["admin", "estimator-submissions"],
    queryFn: adminFetchEstimatorSubmissions,
    retry: false,
  });
  const events = useQuery({
    queryKey: ["admin", "chatbot-events", 30],
    queryFn: () => adminFetchChatbotEvents(30),
    retry: false,
  });

  const isLoading =
    leads.isLoading || consultations.isLoading || estimates.isLoading || events.isLoading;
  const setupError = leads.error || consultations.error || estimates.error || events.error;

  if (setupError) {
    return (
      <AdminCard>
        <AdminCardHeader
          title="Chatbot pipeline"
          description="Leads, consultations and estimator requests captured by the assistant"
        />
        <p className="px-5 pb-5 text-sm text-muted-foreground">{(setupError as Error).message}</p>
      </AdminCard>
    );
  }

  const leadRows = leads.data ?? [];
  const consultationRows = consultations.data ?? [];
  const estimateRows = estimates.data ?? [];
  const analytics = summariseChatbotEvents(events.data ?? []);

  const newLeads = leadRows.filter((l) => l.status === "new").length;
  const pendingConsultations = consultationRows.filter((c) => c.status === "pending").length;
  const newEstimates = estimateRows.filter((e) => e.status === "new").length;

  const recentLeads = leadRows.slice(0, 5);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Chat leads"
          value={leadRows.length}
          icon={Bot}
          hint={newLeads > 0 ? `${newLeads} awaiting follow-up` : "All triaged"}
          accent={newLeads > 0}
          progress={leadRows.length ? (newLeads / leadRows.length) * 100 : 0}
        />
        <StatTile
          label="Consultations"
          value={consultationRows.length}
          icon={CalendarClock}
          hint={pendingConsultations > 0 ? `${pendingConsultations} to confirm` : "Nothing pending"}
          accent={pendingConsultations > 0}
          progress={
            consultationRows.length ? (pendingConsultations / consultationRows.length) * 100 : 0
          }
        />
        <StatTile
          label="Estimator requests"
          value={estimateRows.length}
          icon={Calculator}
          hint={newEstimates > 0 ? `${newEstimates} new` : "All reviewed"}
          accent={newEstimates > 0}
          progress={estimateRows.length ? (newEstimates / estimateRows.length) * 100 : 0}
        />
        <StatTile
          label="Chat sessions (30d)"
          value={analytics.sessions}
          icon={Activity}
          hint={`${analytics.conversionRate}% form conversion`}
          progress={analytics.conversionRate}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <AdminCard className="xl:col-span-2">
          <AdminCardHeader
            title="Latest chat leads"
            description="Captured by the scripted assistant"
            action={
              <Link
                to={ADMIN_ROUTES.chatLeads}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          {isLoading ? (
            <AdminTableSkeleton rows={5} cols={3} />
          ) : recentLeads.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-muted-foreground">
              No chat leads yet.
            </p>
          ) : (
            <ul className="divide-y divide-border/70">
              {recentLeads.map((lead) => (
                <li key={lead.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{lead.name || "Anonymous"}</p>
                      <StatusBadge status={lead.status} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {[lead.service, lead.timeline, lead.email].filter(Boolean).join(" · ") ||
                        "No details captured"}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatDate(lead.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard>
          <AdminCardHeader
            title="Assistant engagement"
            description="Last 30 days"
            action={
              <Link
                to={ADMIN_ROUTES.chatAnalytics}
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Analytics <ArrowRight className="h-3 w-3" />
              </Link>
            }
          />
          <dl className="grid grid-cols-2 gap-4 p-5">
            {[
              { label: "Chat opens", value: analytics.opens },
              { label: "Option clicks", value: analytics.optionClicks },
              { label: "Forms started", value: analytics.formsStarted },
              { label: "Forms submitted", value: analytics.formsSubmitted },
              { label: "Free-text asks", value: analytics.freeText },
              { label: "Fallback rate", value: `${analytics.fallbackRate}%` },
            ].map((item) => (
              <div key={item.label} className="min-w-0">
                <dt className="truncate text-xs text-muted-foreground">{item.label}</dt>
                <dd className="text-lg font-semibold tabular-nums">{item.value}</dd>
              </div>
            ))}
          </dl>
        </AdminCard>
      </div>
    </>
  );
}
