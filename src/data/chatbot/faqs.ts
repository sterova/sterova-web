import type { QAItem } from "./types";

/**
 * The scripted FAQ knowledge base. Categories map 1:1 to the FAQ menu in the
 * chatbot; every answer is fixed text — the bot never generates an answer.
 */

export interface FAQCategory {
  id: string;
  label: string;
  emoji: string;
  items: QAItem[];
}

export const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "general",
    label: "General",
    emoji: "💬",
    items: [
      {
        id: "g-1",
        category: "General",
        question: "What does Sterova do?",
        answer:
          "Sterova designs and builds websites, web applications, mobile apps and custom software — from first concept through to launch and ongoing support.",
      },
      {
        id: "g-2",
        category: "General",
        question: "Do you work with small businesses and startups?",
        answer:
          "Yes. We work with early-stage founders building an MVP as well as established companies replacing large legacy systems.",
      },
      {
        id: "g-3",
        category: "General",
        question: "Do you work with clients outside your region?",
        answer:
          "Yes. We work remotely with clients internationally and schedule calls around your timezone.",
      },
      {
        id: "g-4",
        category: "General",
        question: "Can you sign an NDA?",
        answer: "Yes. We are happy to sign an NDA before discussing project details.",
      },
    ],
  },
  {
    id: "services",
    label: "Services",
    emoji: "🚀",
    items: [
      {
        id: "s-1",
        category: "Services",
        question: "What services do you offer?",
        answer:
          "Four core services: Custom Software Development, Web Application Development, Mobile App Development, and UI/UX Design.",
      },
      {
        id: "s-2",
        category: "Services",
        question: "Can you take over a half-finished project?",
        answer:
          "Yes. We start with a code and architecture audit, tell you honestly what is salvageable, then continue from there.",
      },
      {
        id: "s-3",
        category: "Services",
        question: "Do you provide design without development?",
        answer:
          "Yes. UI/UX design is available as a standalone engagement, delivered with full Figma files and a design system.",
      },
      {
        id: "s-4",
        category: "Services",
        question: "Do you offer maintenance after launch?",
        answer:
          "Yes. We offer ongoing maintenance covering monitoring, security updates, bug fixes and new feature work.",
      },
    ],
  },
  {
    id: "process",
    label: "Process",
    emoji: "⚙️",
    items: [
      {
        id: "p-1",
        category: "Process",
        question: "How does a project start?",
        answer:
          "With a discovery conversation. We understand your goals and constraints, then produce a written scope with milestones before any work begins.",
      },
      {
        id: "p-2",
        category: "Process",
        question: "How often will I see progress?",
        answer:
          "We work in two-week sprints and give you a working demo at the end of every sprint, plus access to a staging environment.",
      },
      {
        id: "p-3",
        category: "Process",
        question: "How much of my time will this need?",
        answer:
          "Expect a weekly check-in of 30–45 minutes plus timely feedback on demos. Fast feedback is the single biggest factor in hitting the timeline.",
      },
      {
        id: "p-4",
        category: "Process",
        question: "What if requirements change mid-project?",
        answer:
          "Changes are normal. We assess the impact on scope and timeline, agree it with you in writing, then adjust the plan.",
      },
    ],
  },
  {
    id: "timelines",
    label: "Timelines",
    emoji: "⏱️",
    items: [
      {
        id: "t-1",
        category: "Timelines",
        question: "How long does a website take?",
        answer:
          "A landing page typically takes 1–2 weeks and a full corporate website 3–5 weeks, including content and SEO setup.",
      },
      {
        id: "t-2",
        category: "Timelines",
        question: "How long does a mobile app take?",
        answer:
          "An MVP usually takes 6–8 weeks, with 1–2 additional weeks for App Store and Play Store review.",
      },
      {
        id: "t-3",
        category: "Timelines",
        question: "Can you work to a fixed deadline?",
        answer:
          "Yes. If the deadline is fixed we plan the scope around it and prioritise so the essential release ships on time.",
      },
    ],
  },
  {
    id: "technical",
    label: "Technical",
    emoji: "🛠️",
    items: [
      {
        id: "tc-1",
        category: "Technical",
        question: "Which technologies do you use?",
        answer:
          "Mainly React, Next.js and TypeScript on the frontend; Node.js and Python on the backend; Flutter and React Native for mobile; PostgreSQL, MongoDB and Supabase for data; AWS and Vercel for hosting.",
      },
      {
        id: "tc-2",
        category: "Technical",
        question: "Will the site be SEO friendly?",
        answer:
          "Yes. Semantic markup, metadata, structured data, sitemaps and Core Web Vitals performance budgets are part of every build.",
      },
      {
        id: "tc-3",
        category: "Technical",
        question: "Can you integrate with our existing systems?",
        answer:
          "Yes. We integrate with CRMs, ERPs, payment gateways, messaging platforms and any system that exposes an API.",
      },
      {
        id: "tc-4",
        category: "Technical",
        question: "Where will the application be hosted?",
        answer:
          "Usually on AWS or Vercel, in a region appropriate for your users and data-residency requirements. You own the accounts.",
      },
    ],
  },
  {
    id: "support",
    label: "Support & Security",
    emoji: "🛡️",
    items: [
      {
        id: "su-1",
        category: "Support & Security",
        question: "Do you provide training and handover?",
        answer:
          "Yes. We deliver documentation, a walkthrough session for your team, and full access to code and infrastructure.",
      },
      {
        id: "su-2",
        category: "Support & Security",
        question: "How do you handle security?",
        answer:
          "Least-privilege access, encrypted data in transit and at rest, dependency scanning, secure authentication and reviewed deployments.",
      },
      {
        id: "su-3",
        category: "Support & Security",
        question: "Who owns the intellectual property?",
        answer:
          "You do. On final delivery all source code, designs and assets are transferred to you.",
      },
      {
        id: "su-4",
        category: "Support & Security",
        question: "What happens if something breaks after launch?",
        answer:
          "Report it through your support channel. Critical issues are triaged immediately; everything else is scheduled into the next maintenance cycle.",
      },
    ],
  },
];

export const ALL_FAQS: QAItem[] = FAQ_CATEGORIES.flatMap((c) => c.items);
