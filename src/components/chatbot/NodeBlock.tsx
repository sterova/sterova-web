import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { ChatIcon } from "@/components/chatbot/ChatIcon";
import { useChatbot } from "@/components/chatbot/ChatbotProvider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { ChatNode, InfoCard, MenuOption, ServiceDetail } from "@/data/chatbot/types";
import { SITE } from "@/data/constants";
import { fetchActiveProjects, fetchPublishedPosts } from "@/lib/api";
import { resolveNode } from "@/lib/chatbot/engine";
import { cn, getWhatsAppUrl } from "@/lib/utils";

/** Renders the non-text content block belonging to a conversation node. */
export function NodeBlock({ nodeId }: { nodeId: string }) {
  const node = resolveNode(nodeId);

  return (
    <div className="w-full space-y-2">
      {node.heading ? (
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {node.heading}
        </p>
      ) : null}
      <NodeBody node={node} />
    </div>
  );
}

function NodeBody({ node }: { node: ChatNode }) {
  switch (node.kind) {
    case "menu":
      return <MenuGrid options={node.options} columns={node.columns ?? 2} />;
    case "cards":
      return <CardList cards={node.cards} />;
    case "accordion":
      return <FaqAccordion items={node.items} />;
    case "service":
      return <ServiceBlock service={node.service} />;
    case "dynamic":
      return <DynamicBlock source={node.source} />;
    default:
      return null;
  }
}

/* ── Menu ──────────────────────────────────────────────────────────────── */

function MenuGrid({ options, columns }: { options: MenuOption[]; columns: 1 | 2 }) {
  const { goToNode } = useChatbot();
  return (
    <div className={cn("grid gap-1", columns === 2 ? "sm:grid-cols-2" : "grid-cols-1")}>
      {options.map((option) => (
        <button
          key={option.node}
          type="button"
          onClick={() => goToNode(option.node, option.label)}
          className="group flex items-start gap-2 rounded-[6px] border border-border/70 bg-card/60 p-2 text-left transition-colors hover:border-primary/50 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {option.emoji ? (
            <span aria-hidden className="text-[13px] leading-none mt-[1px]">
              {option.emoji}
            </span>
          ) : (
            <ChatIcon name={option.icon} className="mt-0.5 size-3 text-primary" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block text-[12px] font-medium text-foreground leading-tight">{option.label}</span>
            {option.description ? (
              <span className="mt-0.5 block text-[10px] leading-snug text-muted-foreground">
                {option.description}
              </span>
            ) : null}
          </span>
          <ArrowUpRight className="ml-auto size-3 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
        </button>
      ))}
    </div>
  );
}

/* ── Cards ─────────────────────────────────────────────────────────────── */

function CardList({ cards }: { cards: InfoCard[] }) {
  return (
    <div className="space-y-1.5">
      {cards.map((card) => (
        <div key={card.title} className="rounded-lg border border-border/70 bg-card/60 p-2.5">
          <div className="flex items-center gap-2">
            {card.icon ? <ChatIcon name={card.icon} className="size-4 text-primary" /> : null}
            <p className="text-[13px] font-semibold text-foreground">{card.title}</p>
          </div>
          {card.body ? (
            <p className="mt-0.5 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
              {card.body}
            </p>
          ) : null}
          {card.items?.length ? (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {card.items.map((item) => (
                <Badge
                  key={item}
                  variant="secondary"
                  className="rounded-full text-[11px] font-normal"
                >
                  {item}
                </Badge>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* ── FAQs ──────────────────────────────────────────────────────────────── */

function FaqAccordion({ items }: { items: { id: string; question: string; answer: string }[] }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-lg border border-border/70 bg-card/60 px-2.5"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id} className="border-border/60 last:border-b-0">
          <AccordionTrigger className="py-2.5 text-left text-sm font-medium hover:no-underline">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="whitespace-pre-line pb-2.5 text-xs leading-relaxed text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

/* ── Service detail ────────────────────────────────────────────────────── */

function ServiceBlock({ service }: { service: ServiceDetail }) {
  return (
    <div className="space-y-1.5">
      {service.offerings?.length ? (
        <Section title="What we build">
          <div className="flex flex-wrap gap-1">
            {service.offerings.map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="rounded-full text-[11px] font-normal"
              >
                {item}
              </Badge>
            ))}
          </div>
        </Section>
      ) : null}

      <Section title="What's included">
        <BulletList items={service.features} />
      </Section>

      <Section title="Why it helps">
        <BulletList items={service.benefits} />
      </Section>

      <Section title="Best suited to">
        <BulletList items={service.idealClients} />
      </Section>

      <Section title="Technologies">
        <div className="flex flex-wrap gap-1">
          {service.stack.map((tech) => (
            <Badge key={tech} variant="outline" className="rounded-full text-[11px] font-normal">
              {tech}
            </Badge>
          ))}
        </div>
      </Section>

      <Section title="Typical timeline">
        <p className="flex gap-2 text-xs leading-relaxed text-muted-foreground">
          <Clock className="mt-0.5 size-3.5 shrink-0 text-primary" />
          {service.timeline}
        </p>
      </Section>

      <Section title="Common questions">
        <FaqAccordion items={service.faqs} />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/70 bg-card/60 p-2.5">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </p>
      {children}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2 text-xs leading-relaxed text-foreground/90">
          <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── Dynamic (live site content) ───────────────────────────────────────── */

function DynamicBlock({ source }: { source: "portfolio" | "blog" | "contact" | "social" }) {
  if (source === "portfolio") return <PortfolioBlock />;
  if (source === "blog") return <BlogBlock />;
  return <ContactBlock />;
}

function LoadingRows() {
  return (
    <div className="space-y-1.5">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

function PortfolioBlock() {
  const { close } = useChatbot();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chatbot", "projects"],
    queryFn: fetchActiveProjects,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <LoadingRows />;
  if (isError || !data?.length) {
    return (
      <EmptyNotice
        text="Our latest work isn't loading right now — the full portfolio page has everything."
        to="/portfolio"
        label="Open portfolio"
      />
    );
  }

  return (
    <div className="space-y-1.5">
      {data.slice(0, 4).map((project) => (
        <Link
          key={project.id}
          to="/portfolio"
          onClick={close}
          className="flex gap-3 rounded-lg border border-border/70 bg-card/60 p-2.5 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          {project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              loading="lazy"
              width={64}
              height={64}
              className="size-11 shrink-0 rounded-md object-cover"
            />
          ) : null}
          <span className="min-w-0">
            <span className="block text-[13px] font-medium text-foreground">{project.title}</span>
            <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted-foreground">
              {project.description}
            </span>
            <span className="mt-1 block text-[11px] uppercase tracking-wide text-primary">
              {project.category}
            </span>
          </span>
        </Link>
      ))}
    </div>
  );
}

function BlogBlock() {
  const { close } = useChatbot();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["chatbot", "posts"],
    queryFn: fetchPublishedPosts,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <LoadingRows />;
  if (isError || !data?.length) {
    return (
      <EmptyNotice
        text="Articles aren't loading right now — you'll find them all on the blog."
        to="/blog"
        label="Open blog"
      />
    );
  }

  return (
    <div className="space-y-1.5">
      {data.slice(0, 4).map((post) => (
        <Link
          key={post.id}
          to="/blog/$slug"
          params={{ slug: post.slug }}
          onClick={close}
          className="block rounded-lg border border-border/70 bg-card/60 p-2.5 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <span className="block text-[13px] font-medium text-foreground">{post.title}</span>
          <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted-foreground">
            {post.excerpt}
          </span>
          <span className="mt-1 block text-[11px] text-muted-foreground">
            {post.read_time_minutes} min read
          </span>
        </Link>
      ))}
    </div>
  );
}

function ContactBlock() {
  const rows = [
    {
      icon: Mail,
      label: "Email",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: SITE.phone,
      href: `tel:${SITE.phone.replace(/\s/g, "")}`,
    },
    {
      icon: FaWhatsapp,
      label: "WhatsApp",
      value: "Chat with the team",
      href: getWhatsAppUrl(SITE.whatsapp, "Hi Sterova, I'd like to discuss a project."),
    },
  ];

  return (
    <div className="space-y-1.5">
      {rows.map((row) => (
        <a
          key={row.label}
          href={row.href}
          target={row.href.startsWith("http") ? "_blank" : undefined}
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/60 p-2.5 transition-colors hover:border-primary/50 hover:bg-accent"
        >
          <row.icon className="size-4 text-primary" />
          <span className="min-w-0">
            <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
              {row.label}
            </span>
            <span className="block truncate text-sm font-medium text-foreground">{row.value}</span>
          </span>
        </a>
      ))}
    </div>
  );
}

function EmptyNotice({ text, to, label }: { text: string; to: string; label: string }) {
  const { close } = useChatbot();
  return (
    <div className="rounded-lg border border-border/70 bg-card/60 p-2.5">
      <p className="text-xs leading-relaxed text-muted-foreground">{text}</p>
      <Link
        to={to}
        onClick={close}
        className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
      >
        {label}
        <ArrowUpRight className="size-3.5" />
      </Link>
    </div>
  );
}
