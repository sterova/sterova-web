import { motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import SectionHeader from "@/components/shared/SectionHeader";
import { fetchActiveTeamMembers } from "@/lib/api";
import { resolveSocialLinks } from "@/data/social-links";

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default function TeamSection() {
  const reduce = useReducedMotion();
  const { data } = useQuery({
    queryKey: ["team-members"],
    queryFn: fetchActiveTeamMembers,
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const members = data ?? [];
  // Hide the whole section when nobody is active (or the read failed).
  if (members.length === 0) return null;

  return (
    <section className="section-y bg-surface">
      <div className="container-custom">
        <SectionHeader
          badge="Our team"
          title="The people behind the work"
          description="A small, senior team that cares deeply about craft, communication, and outcomes."
          centered
          className="mb-16"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => {
            const links = resolveSocialLinks(member.links);
            return (
              <motion.div
                key={member.id}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group card-premium relative flex flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card-hover)]"
              >
                <div
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary/15 to-primary/5">
                  {member.photo_url ? (
                    <img
                      src={member.photo_url}
                      alt={`${member.full_name}, ${member.position}`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="gradient-brand grid h-20 w-20 place-items-center rounded-full text-xl font-semibold text-primary-foreground shadow-lg">
                        {initialsOf(member.full_name)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                    {member.full_name}
                  </h3>
                  <p className="text-sm font-medium text-primary">{member.position}</p>
                  {member.bio ? (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {member.bio}
                    </p>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {links.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                      {links.map((link) => {
                        const Icon = link.icon;
                        return (
                          <li key={link.key}>
                            <a
                              href={link.href}
                              {...(link.external
                                ? { target: "_blank", rel: "noopener noreferrer" }
                                : {})}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              aria-label={`${member.full_name} — ${link.label}`}
                              title={link.label}
                            >
                              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
