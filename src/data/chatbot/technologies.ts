import type { InfoCard } from "./types";

/** Technology stack, grouped the way the chatbot presents it. */
export const TECH_GROUPS: InfoCard[] = [
  {
    title: "Frontend",
    icon: "Layout",
    body: "Interfaces that are fast, responsive and accessible.",
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "TailwindCSS",
      "Framer Motion",
    ],
  },
  {
    title: "Backend",
    icon: "Server",
    body: "APIs and services built for reliability.",
    items: ["Node.js", "Express", "Python", "FastAPI", "REST APIs", "GraphQL", "WebSockets"],
  },
  {
    title: "Mobile",
    icon: "Smartphone",
    body: "One codebase, native feel on both platforms.",
    items: ["Flutter", "React Native", "Android", "iOS"],
  },
  {
    title: "Databases",
    icon: "Database",
    body: "Structured, indexed and backed up.",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Supabase"],
  },
  {
    title: "Cloud & DevOps",
    icon: "Cloud",
    body: "Automated deployments and observable infrastructure.",
    items: ["AWS", "Vercel", "Docker", "GitHub Actions", "CI/CD", "Monitoring & logging"],
  },
  {
    title: "Design",
    icon: "Palette",
    body: "From research to a production-ready design system.",
    items: ["Figma", "Adobe XD", "Design systems", "Prototyping", "Accessibility (WCAG)"],
  },
];

export const TECH_INTRO =
  "We choose technology for longevity, not novelty — proven tools with strong ecosystems, hiring pools and long-term support.";
