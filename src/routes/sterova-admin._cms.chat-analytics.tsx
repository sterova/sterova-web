import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, BarChart3, MessageSquare, MousePointerClick, Send, Users } from "lucide-react";
import {
  AdminCard,
  AdminCardHeader,
  AdminEmpty,
  AdminError,
  AdminFilterTabs,
  AdminPageHeading,
  AdminTableSkeleton,
  StatTile,
} from "@/components/admin/AdminUI";
import {
  adminFetchChatbotEvents,
  summariseChatbotEvents,
  type ChatbotAnalytics,
} from "@/lib/chatbot/admin-api";
import { privateSeo } from "@/lib/seo";

export const Route = createFileRoute("/sterova-admin/_cms/chat-analytics")({
  head: () => privateSeo("Chat Analytics · CMS"),
  component: () => <AdminChatAnalyticsPage />,
});

type Range = "7" | "30" | "90";

/** Simple horizontal ranking list — no chart library, no runtime weight. */
function RankList({
  rows,
  emptyLabel,
}: {
  rows: { label: string; count: number }[];
  emptyLabel: string;
}) {
  if (rows.length === 0) {
    return <p className="px-5 py-8 text-center text-sm text-muted-foreground">{emptyLabel}</p>;
  }
  const max = Math.max(...rows.map((row) => row.count));
  return (
    <ul className="flex flex-col divide-y divide-border/70">
      {rows.map((row) => (
        <li key={row.label} className="px-5 py-3">
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate" title={row.label}>
              {row.label}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{row.count}</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className="gradient-brand h-full rounded-full"
              style={{ width: `${Math.round((row.count / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function DailyBars({ daily }: { daily: ChatbotAnalytics["daily"] }) {
  if (daily.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-muted-foreground">No activity recorded.</p>
    );
  }
  const max = Math.max(...daily.map((day) => day.sessions), 1);
  return (
    <div className="flex h-40 items-end gap-1.5 px-5 py-4">
      {daily.map((day) => (
        <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            title={`${day.date}: ${day.sessions} sessions · ${day.events} events`}
            className="gradient-brand w-full rounded-t-md transition-all"
            style={{ height: `${Math.max(4, Math.round((day.sessions / max) * 100))}%` }}
          />
          <span className="text-[10px] text-muted-foreground">{day.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

function AdminChatAnalyticsPage() {
  const [range, setRange] = useState<Range>("30");

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin", "chatbot-events", range],
    queryFn: () => adminFetchChatbotEvents(Number(range)),
  });

  const stats = useMemo(() => summariseChatbotEvents(data ?? []), [data]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeading
        eyebrow="Chatbot"
        title="Chat analytics"
        description="Anonymous conversation metrics — no personal data is recorded here."
        actions={
          <AdminFilterTabs<Range>
            value={range}
            onChange={setRange}
            label="Date range"
            options={[
              { value: "7", label: "7 days" },
              { value: "30", label: "30 days" },
              { value: "90", label: "90 days" },
            ]}
          />
        }
      />

      {error ? (
        <AdminError message={(error as Error).message} />
      ) : isLoading ? (
        <AdminCard>
          <AdminTableSkeleton rows={6} cols={4} />
        </AdminCard>
      ) : (data ?? []).length === 0 ? (
        <AdminCard>
          <AdminEmpty
            icon={BarChart3}
            title="No chat activity yet"
            description="Once visitors start conversations, engagement and drop-off metrics appear here."
          />
        </AdminCard>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatTile label="Sessions" value={stats.sessions} icon={Users} accent />
            <StatTile
              label="Chats opened"
              value={stats.opens}
              icon={MessageSquare}
              hint={`${stats.nodeViews} steps viewed`}
            />
            <StatTile
              label="Form conversion"
              value={`${stats.conversionRate}%`}
              icon={Send}
              hint={`${stats.formsSubmitted} of ${stats.formsStarted} started`}
              progress={stats.conversionRate}
            />
            <StatTile
              label="Fallback rate"
              value={`${stats.fallbackRate}%`}
              icon={Activity}
              hint={`${stats.fallbacks} of ${stats.freeText} typed messages`}
              progress={stats.fallbackRate}
            />
          </div>

          <AdminCard>
            <AdminCardHeader
              title="Sessions per day"
              description={`Last ${stats.daily.length} active days`}
            />
            <DailyBars daily={stats.daily} />
          </AdminCard>

          <div className="grid gap-6 lg:grid-cols-2">
            <AdminCard>
              <AdminCardHeader
                title="Most viewed steps"
                description="Which conversation nodes visitors reach"
              />
              <RankList rows={stats.topNodes} emptyLabel="No step views recorded." />
            </AdminCard>

            <AdminCard>
              <AdminCardHeader
                title="Most clicked options"
                description="The quick replies people actually press"
              />
              <RankList rows={stats.topOptions} emptyLabel="No option clicks recorded." />
            </AdminCard>

            <AdminCard>
              <AdminCardHeader
                title="Drop-off points"
                description="Last step seen in sessions that never submitted a form"
              />
              <RankList rows={stats.dropOffNodes} emptyLabel="No drop-offs recorded." />
            </AdminCard>

            <AdminCard>
              <AdminCardHeader
                title="Typed questions"
                description="Free-text input — useful for new scripted answers"
              />
              <RankList rows={stats.topQuestions} emptyLabel="No typed questions recorded." />
            </AdminCard>
          </div>

          <AdminCard>
            <AdminCardHeader title="Engagement breakdown" />
            <div className="grid gap-px bg-border/70 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: "Option clicks", value: stats.optionClicks, icon: MousePointerClick },
                { label: "Forms started", value: stats.formsStarted, icon: Send },
                { label: "Forms abandoned", value: stats.formsAbandoned, icon: Activity },
                { label: "CTA clicks", value: stats.ctaClicks, icon: MousePointerClick },
              ].map((item) => (
                <div key={item.label} className="bg-card px-5 py-4">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="font-display mt-1.5 text-2xl font-bold tabular-nums">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </AdminCard>
        </>
      )}
    </div>
  );
}
