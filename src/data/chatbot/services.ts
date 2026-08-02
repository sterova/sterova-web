import type { ServiceDetail } from "./types";

/**
 * The four Sterova service lines. Every field here is surfaced verbatim by the
 * service conversation flow: details → benefits → technologies → FAQs → CTAs.
 */
export const CHAT_SERVICES: ServiceDetail[] = [
  {
    id: "custom-software",
    title: "Custom Software Development",
    emoji: "🧩",
    icon: "Code2",
    route: "/services",
    short: "Tailor-made software built around your exact business requirements.",
    long: "We architect and build custom software from the ground up — shaped around your workflows rather than forcing your team into someone else's product. Discovery and technical scoping come first, then iterative delivery with automated testing, CI/CD and documentation, so the system stays maintainable long after launch.",
    features: [
      "Requirements analysis and technical scoping",
      "System architecture and database design",
      "Full-stack development with modern frameworks",
      "API design and third-party integrations",
      "Automated testing and quality assurance",
      "CI/CD pipelines and cloud deployment",
      "Role-based access control and audit trails",
      "Ongoing maintenance, monitoring and support",
    ],
    benefits: [
      "Software that matches your process exactly — no workflow compromises",
      "Lower long-term cost than per-seat licences as your team grows",
      "You own the source code and the data",
      "Scales with your business instead of capping it",
      "Secure by design: least-privilege access, encrypted data, audited changes",
      "Integrates with the tools you already run",
    ],
    idealClients: [
      "Businesses outgrowing spreadsheets and manual processes",
      "Companies stuck with rigid off-the-shelf software",
      "Enterprises needing internal tools, portals or automation",
      "Startups building a defensible product",
    ],
    stack: ["TypeScript", "Node.js", "Express", "Python", "FastAPI", "PostgreSQL", "React"],
    timeline:
      "Small internal tools typically run 4–6 weeks. Mid-size platforms run 2–4 months. Large multi-module systems are delivered in phases, with a working release every 2 weeks.",
    faqs: [
      {
        id: "cs-1",
        category: "Custom Software",
        question: "Do you build custom software from scratch?",
        answer:
          "Yes. We handle the full lifecycle — discovery, architecture, design, development, testing, deployment and support.",
      },
      {
        id: "cs-2",
        category: "Custom Software",
        question: "Can you modernize our existing legacy system?",
        answer:
          "Yes. We audit the current system, plan an incremental migration path, and modernize module by module so your operations never stop.",
      },
      {
        id: "cs-3",
        category: "Custom Software",
        question: "Will we own the source code?",
        answer:
          "Yes. On final delivery the full source code, repositories and infrastructure configuration are transferred to you.",
      },
    ],
  },
  {
    id: "web-development",
    title: "Web Application Development",
    emoji: "🌐",
    icon: "Globe",
    route: "/services",
    short: "Fast, accessible, SEO-ready web apps that convert and scale.",
    long: "From marketing sites to full SaaS platforms, we build web applications that load fast, rank well and stay easy to operate. Server-side rendering, Core Web Vitals budgets and accessibility are part of the build, not an afterthought.",
    offerings: [
      "Corporate websites",
      "Business websites",
      "Landing pages",
      "Admin dashboards",
      "CRM platforms",
      "ERP systems",
      "E-Commerce stores",
      "Booking systems",
      "Portfolio websites",
      "Custom web applications",
    ],
    features: [
      "Server-side and static rendering for speed and SEO",
      "Responsive layouts from mobile to widescreen",
      "Authentication, authorization and user management",
      "Admin dashboards with role-based permissions",
      "Payment gateway and third-party API integration",
      "Real-time features, notifications and live updates",
      "Analytics, conversion tracking and reporting",
      "Content management so your team can edit without a developer",
    ],
    benefits: [
      "Pages that load quickly on real-world mobile connections",
      "Search-engine ready markup, metadata and structured data",
      "Accessible to keyboard and screen-reader users",
      "One codebase serving every screen size",
      "Editable content — no developer needed for routine updates",
      "Built to scale from your first users to your busiest day",
    ],
    idealClients: [
      "Businesses replacing an outdated or slow website",
      "SaaS founders launching a first product",
      "Retailers moving into e-commerce",
      "Service businesses needing bookings and customer portals",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "TailwindCSS",
      "Node.js",
      "PostgreSQL",
      "Supabase",
    ],
    timeline:
      "Landing pages: 1–2 weeks. Corporate sites: 3–5 weeks. Dashboards, CRM/ERP and e-commerce platforms: 6–14 weeks depending on module count.",
    faqs: [
      {
        id: "web-1",
        category: "Web Development",
        question: "Do you create responsive websites?",
        answer:
          "Every site we build is mobile-first and tested across phones, tablets, laptops and large displays.",
      },
      {
        id: "web-2",
        category: "Web Development",
        question: "Can you redesign our existing website?",
        answer:
          "Yes. We audit the current site, keep what performs, and rebuild the rest with a modern design system while preserving your SEO rankings.",
      },
      {
        id: "web-3",
        category: "Web Development",
        question: "Can you connect payment gateways?",
        answer:
          "Yes — card payments, UPI, wallets and subscription billing, with secure server-side verification.",
      },
    ],
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    emoji: "📱",
    icon: "Smartphone",
    route: "/services",
    short: "Native-quality Android and iOS apps, built to ship and to last.",
    long: "We build mobile apps that feel native on both platforms while keeping a single, maintainable codebase. Offline support, push notifications, secure storage and store submission are all handled end to end.",
    offerings: [
      "Android apps",
      "iOS apps",
      "Cross-platform apps",
      "Business apps",
      "E-Commerce apps",
      "Healthcare apps",
      "Education apps",
      "Logistics apps",
      "Food delivery apps",
      "Fully custom apps",
    ],
    features: [
      "Cross-platform delivery for Android and iOS",
      "Native-feeling navigation, gestures and animation",
      "Offline-first data with background sync",
      "Push notifications and deep linking",
      "Secure authentication and encrypted local storage",
      "Payments, maps, camera and device integrations",
      "App Store and Play Store submission support",
      "Crash reporting and release monitoring",
    ],
    benefits: [
      "One codebase, both platforms — faster launches, lower cost",
      "A direct channel to your customers on their home screen",
      "Works in low-connectivity conditions",
      "Analytics on real user behaviour from day one",
      "Straightforward update path after launch",
    ],
    idealClients: [
      "Retailers and restaurants wanting an ordering app",
      "Healthcare providers digitising appointments and records",
      "Logistics operators tracking fleets and deliveries",
      "Education providers delivering courses on mobile",
    ],
    stack: ["Flutter", "React Native", "TypeScript", "Node.js", "Firebase", "Supabase"],
    timeline:
      "MVP apps: 6–8 weeks. Feature-complete business apps: 3–5 months. Store review adds roughly 1–2 weeks.",
    faqs: [
      {
        id: "mob-1",
        category: "Mobile Apps",
        question: "Do you develop for both Android and iOS?",
        answer:
          "Yes. We usually build cross-platform so both stores ship from one codebase, and go fully native when a project genuinely needs it.",
      },
      {
        id: "mob-2",
        category: "Mobile Apps",
        question: "Do you handle App Store and Play Store submission?",
        answer:
          "Yes — store listings, assets, compliance checks and the submission itself are part of delivery.",
      },
      {
        id: "mob-3",
        category: "Mobile Apps",
        question: "Can the app work offline?",
        answer:
          "Yes. We use offline-first storage with background sync so the app stays usable without a connection.",
      },
    ],
  },
  {
    id: "ui-ux",
    title: "UI/UX Design",
    emoji: "🎨",
    icon: "Palette",
    route: "/services",
    short: "Research-led interface design that people actually enjoy using.",
    long: "Design at Sterova starts with the user, not the pixels. We research, map flows, wireframe, then build a high-fidelity design system with accessible components and interactive prototypes you can click through before a line of production code is written.",
    offerings: [
      "User research",
      "Wireframes",
      "High-fidelity design",
      "Design systems",
      "Responsive design",
      "Interactive prototypes",
      "Accessibility",
      "Usability testing",
    ],
    features: [
      "Stakeholder interviews and user research",
      "Information architecture and user-flow mapping",
      "Low-fidelity wireframes for fast iteration",
      "High-fidelity visual design in Figma",
      "Reusable design systems and component libraries",
      "Interactive, clickable prototypes",
      "WCAG-aligned accessibility review",
      "Usability testing and iteration rounds",
    ],
    benefits: [
      "Fewer support requests because the product explains itself",
      "Higher conversion from clearer flows",
      "A design system that keeps future screens consistent",
      "Usable by people with visual, motor and cognitive differences",
      "Costly mistakes caught in prototypes, not in production",
    ],
    idealClients: [
      "Teams with a product that works but frustrates users",
      "Founders validating an idea before development",
      "Companies standardising design across several products",
    ],
    stack: ["Figma", "Adobe XD", "React", "TailwindCSS", "Design tokens"],
    timeline:
      "Research and wireframes: 1–2 weeks. Full high-fidelity design with a component system: 3–6 weeks depending on screen count.",
    faqs: [
      {
        id: "ux-1",
        category: "UI/UX Design",
        question: "Do you provide UI/UX design separately from development?",
        answer:
          "Yes. Design is available as a standalone engagement, and you receive the full Figma files and design system.",
      },
      {
        id: "ux-2",
        category: "UI/UX Design",
        question: "Do you run usability testing?",
        answer:
          "Yes. We test prototypes with representative users and iterate on the findings before development starts.",
      },
      {
        id: "ux-3",
        category: "UI/UX Design",
        question: "Is accessibility included?",
        answer:
          "Accessibility is part of every design: colour contrast, focus states, keyboard paths and screen-reader semantics.",
      },
    ],
  },
];

export function getChatService(id: string): ServiceDetail | undefined {
  return CHAT_SERVICES.find((s) => s.id === id);
}
