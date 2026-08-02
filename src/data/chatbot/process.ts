import type { InfoCard } from "./types";

export const PROCESS_INTRO =
  "Every Sterova project follows the same six-stage process. You always know which stage you are in, what is being delivered, and what happens next.";

export interface ProcessStage extends InfoCard {
  step: number;
  duration: string;
  deliverables: string[];
}

export const PROCESS_STAGES: ProcessStage[] = [
  {
    step: 1,
    title: "Discovery & Requirements",
    icon: "Search",
    duration: "3–7 days",
    body: "We learn your business, your users and the outcome you need. Nothing gets built until the problem is clear.",
    deliverables: [
      "Requirement document",
      "User and stakeholder map",
      "Success criteria",
      "Technical feasibility notes",
    ],
  },
  {
    step: 2,
    title: "Planning & Architecture",
    icon: "Map",
    duration: "3–7 days",
    body: "We define the scope, choose the stack, design the data model and lay out the delivery milestones.",
    deliverables: [
      "Project scope & milestones",
      "System architecture",
      "Database schema",
      "Integration plan",
    ],
  },
  {
    step: 3,
    title: "UI/UX Design",
    icon: "Palette",
    duration: "1–4 weeks",
    body: "Wireframes first, then a high-fidelity design system and a clickable prototype you approve before development.",
    deliverables: ["Wireframes", "High-fidelity designs", "Design system", "Interactive prototype"],
  },
  {
    step: 4,
    title: "Development",
    icon: "Code2",
    duration: "2 weeks – 4 months",
    body: "Built in two-week sprints with a working demo at the end of each one. You see progress continuously, not at the end.",
    deliverables: [
      "Sprint demos",
      "Staging environment",
      "Code repository access",
      "Technical documentation",
    ],
  },
  {
    step: 5,
    title: "Testing & Quality Assurance",
    icon: "ShieldCheck",
    duration: "1–3 weeks",
    body: "Functional, cross-device, performance, accessibility and security testing — plus a round of your own user acceptance testing.",
    deliverables: ["Test reports", "Performance audit", "Accessibility review", "UAT sign-off"],
  },
  {
    step: 6,
    title: "Launch & Support",
    icon: "Rocket",
    duration: "Ongoing",
    body: "We deploy, monitor and hand over everything. Then we stay available for fixes, improvements and new features.",
    deliverables: [
      "Production deployment",
      "Monitoring & backups",
      "Handover & training",
      "Support agreement",
    ],
  },
];

export const TIMELINE_GUIDE: InfoCard[] = [
  { title: "Landing page", icon: "FileText", body: "1–2 weeks from kickoff to launch." },
  {
    title: "Business / corporate website",
    icon: "Globe",
    body: "3–5 weeks including content and SEO setup.",
  },
  {
    title: "E-commerce store",
    icon: "ShoppingCart",
    body: "6–10 weeks depending on catalogue and payment complexity.",
  },
  {
    title: "Web application / dashboard",
    icon: "LayoutDashboard",
    body: "8–14 weeks, delivered module by module.",
  },
  {
    title: "Mobile app (MVP)",
    icon: "Smartphone",
    body: "6–8 weeks, plus 1–2 weeks for store review.",
  },
  {
    title: "Custom software platform",
    icon: "Boxes",
    body: "3–6 months, phased so you get value before the final release.",
  },
];

export const TIMELINE_NOTE =
  "These are typical ranges, not quotes. Your actual timeline depends on scope, integrations and how quickly feedback comes back. We confirm firm dates after discovery.";

export const ENGAGEMENT_NOTE =
  "We work in fixed-scope phases with clear milestones. You approve each stage before the next one starts.";
