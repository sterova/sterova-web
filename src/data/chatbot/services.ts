import type { ServiceDetail } from "./types";

/**
 * The Sterova service lines. Every field here is surfaced verbatim by the
 * service conversation flow: details → benefits → technologies → FAQs → CTAs.
 */
export const CHAT_SERVICES: ServiceDetail[] = [
  {
    id: "web-development",
    title: "Web Application Development",
    emoji: "🌐",
    icon: "Globe",
    route: "/services",
    short: "Fast, accessible, SEO-optimized web apps that convert and scale.",
    long: "From marketing sites to full-featured SaaS platforms, we build web applications that are performant, accessible, and designed to grow. Server-side rendering, Core Web Vitals budgets and accessibility are part of the build, not an afterthought.",
    offerings: [
      "Corporate websites",
      "Business websites",
      "Landing pages",
      "Admin dashboards",
      "CRM platforms",
      "ERP systems",
      "E-Commerce stores",
    ],
    features: [
      "Server-side and static rendering for speed and SEO",
      "Responsive layouts from mobile to widescreen",
      "Authentication, authorization and user management",
      "Admin dashboards with role-based permissions",
      "Payment gateway and third-party API integration",
      "Real-time features, notifications and live updates",
      "Analytics, conversion tracking and reporting",
    ],
    benefits: [
      "Pages that load quickly on real-world mobile connections",
      "Search-engine ready markup, metadata and structured data",
      "Accessible to keyboard and screen-reader users",
      "One codebase serving every screen size",
      "Built to scale from your first users to your busiest day",
    ],
    idealClients: [
      "Businesses replacing an outdated or slow website",
      "Retailers moving into e-commerce",
      "Service businesses needing bookings and customer portals",
    ],
    stack: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Node.js",
      "PostgreSQL",
      "Supabase",
      "Vite",
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
    ],
  },
  {
    id: "mobile-apps",
    title: "Mobile App Development",
    emoji: "📱",
    icon: "Smartphone",
    route: "/services",
    short: "Native-quality iOS and Android apps from a single codebase.",
    long: "We build cross-platform mobile applications using React Native and Flutter — delivering native performance with efficient development cycles. Offline support, push notifications, secure storage and store submission are all handled end to end.",
    offerings: [
      "Android apps",
      "iOS apps",
      "Cross-platform apps",
      "Business apps",
      "E-Commerce apps",
      "Healthcare apps",
      "Logistics apps",
    ],
    features: [
      "Cross-platform iOS and Android development",
      "Native performance and smooth animations",
      "Offline-first architecture with background sync",
      "Push notifications and background services",
      "Secure authentication and encrypted local storage",
      "App Store and Play Store publishing",
      "OTA update support",
    ],
    benefits: [
      "One codebase, both platforms — faster launches, lower cost",
      "A direct channel to your customers on their home screen",
      "Works in low-connectivity conditions",
      "Analytics on real user behaviour from day one",
    ],
    idealClients: [
      "Retailers and restaurants wanting an ordering app",
      "Healthcare providers digitising appointments and records",
      "Logistics operators tracking fleets and deliveries",
    ],
    stack: ["Flutter", "React Native", "TypeScript", "Node.js", "Firebase", "Expo"],
    timeline:
      "MVP apps: 6–8 weeks. Feature-complete business apps: 3–5 months. Store review adds roughly 1–2 weeks.",
    faqs: [
      {
        id: "mob-1",
        category: "Mobile Apps",
        question: "Do you develop for both Android and iOS?",
        answer:
          "Yes. We use cross-platform frameworks like Flutter and React Native to build for both platforms simultaneously.",
      },
      {
        id: "mob-2",
        category: "Mobile Apps",
        question: "Will you upload the app to the app stores?",
        answer:
          "Yes. We handle the entire submission process for both the Apple App Store and Google Play Store.",
      },
    ],
  },
  {
    id: "saas",
    title: "SaaS Product Development",
    emoji: "🏢",
    icon: "Layers",
    route: "/services",
    short: "End-to-end product engineering for scalable SaaS platforms.",
    long: "We partner with founders and product teams to design, build, and launch SaaS products — from MVP to enterprise scale. We handle the multi-tenant architecture, subscription billing, and complex access controls so you can focus on the business.",
    offerings: [
      "SaaS MVPs",
      "B2B SaaS platforms",
      "B2C SaaS products",
      "Multi-tenant architectures",
      "Internal products",
    ],
    features: [
      "Product architecture and technical strategy",
      "Multi-tenant data isolation",
      "Subscription billing integrations (Stripe, etc.)",
      "Role-based access control",
      "Admin dashboard and analytics",
      "Feature flagging and gradual rollouts",
    ],
    benefits: [
      "Accelerated time-to-market for founders",
      "Built to scale automatically with users",
      "Secure data separation for enterprise clients",
      "Revenue-ready with integrated billing systems",
    ],
    idealClients: [
      "SaaS founders launching a new product",
      "Companies scaling their existing software",
      "Enterprises building B2B internal products",
    ],
    stack: ["Next.js", "Supabase", "PostgreSQL", "Stripe", "Vercel", "TypeScript", "React"],
    timeline:
      "MVPs are typically delivered in 6-10 weeks. Full-scale platforms require 3-6 months depending on the domain complexity.",
    faqs: [
      {
        id: "saas-1",
        category: "SaaS",
        question: "Do you help with Stripe integration?",
        answer:
          "Yes, we integrate subscription billing, usage-based billing, and complex invoicing flows out of the box.",
      },
    ],
  },
  {
    id: "design",
    title: "UI/UX Design",
    emoji: "🎨",
    icon: "Palette",
    route: "/services",
    short: "User-centered design that balances beauty with usability.",
    long: "Our design process is research-driven and conversion-focused — creating interfaces that are intuitive, accessible, and on-brand. We don't just create pretty pictures; we design systems that can be actually implemented by engineering teams.",
    offerings: [
      "Wireframing and Prototyping",
      "User Research",
      "UI Design",
      "Design Systems",
      "Interaction Design",
      "Usability Testing",
    ],
    features: [
      "User research and persona development",
      "Information architecture and wireframing",
      "High-fidelity UI design in Figma",
      "Design system creation",
      "Usability testing and iteration",
      "Handoff-ready developer specifications",
    ],
    benefits: [
      "Increases user engagement and retention",
      "Reduces development time with clear specs",
      "Ensures accessibility compliance",
      "Creates a consistent brand experience",
    ],
    idealClients: [
      "Product teams needing a UI overhaul",
      "Startups needing a professional design system from day 1",
      "Companies with complex workflows that confuse users",
    ],
    stack: ["Figma", "Tailwind CSS", "shadcn/ui", "Framer Motion", "Adobe Creative Suite"],
    timeline:
      "A complete UI/UX overhaul of a medium product takes 4-6 weeks. A new app design from scratch takes 3-5 weeks.",
    faqs: [
      {
        id: "design-1",
        category: "UI/UX Design",
        question: "Do you provide Figma files?",
        answer:
          "Yes, you own all design files and intellectual property once the project is completed.",
      },
    ],
  },
  {
    id: "custom-software",
    title: "Custom Software Development",
    emoji: "🧩",
    icon: "Code2",
    route: "/services",
    short: "Tailor-made software built around your exact business requirements.",
    long: "We architect and build custom software from the ground up — shaped around your workflows rather than forcing your team into someone else's product. Discovery and technical scoping come first, then iterative delivery with automated testing.",
    offerings: [
      "Internal tools",
      "Business automation",
      "Portals and Dashboards",
      "Legacy system modernization",
    ],
    features: [
      "Requirements analysis and technical scoping",
      "System architecture and database design",
      "Full-stack development with modern frameworks",
      "Automated testing and quality assurance",
      "CI/CD pipelines and cloud deployment",
      "Role-based access control and audit trails",
    ],
    benefits: [
      "Software that matches your process exactly",
      "Lower long-term cost than per-seat licences",
      "You own the source code and the data",
      "Integrates with the tools you already run",
    ],
    idealClients: [
      "Businesses outgrowing spreadsheets and manual processes",
      "Companies stuck with rigid off-the-shelf software",
      "Enterprises needing internal tools, portals or automation",
    ],
    stack: ["TypeScript", "Node.js", "Express", "Python", "FastAPI", "PostgreSQL", "React"],
    timeline:
      "Small internal tools typically run 4–6 weeks. Mid-size platforms run 2–4 months. Large multi-module systems are delivered in phases.",
    faqs: [
      {
        id: "cs-1",
        category: "Custom Software",
        question: "Do you build custom software from scratch?",
        answer:
          "Yes. We handle the full lifecycle — discovery, architecture, design, development, testing, deployment and support.",
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
    id: "api-integration",
    title: "API & Integration",
    emoji: "🔌",
    icon: "Plug",
    route: "/services",
    short: "Connect your systems and automate your workflows.",
    long: "We build secure, scalable APIs and integrate disparate third-party systems to automate data flow across your business. No more manual data entry or disconnected silos.",
    offerings: [
      "REST & GraphQL API Development",
      "Third-party software integration",
      "Payment gateway integration",
      "Legacy system bridges",
      "Automated workflow engineering",
    ],
    features: [
      "Custom REST and GraphQL API design",
      "Payment gateway and ERP integration",
      "Legacy system modernization",
      "Secure OAuth and JWT authentication",
      "Rate limiting and caching",
      "Webhook architecture for real-time sync",
    ],
    benefits: [
      "Eliminates manual data entry across systems",
      "Opens new revenue streams by exposing your data",
      "Modernizes older software without a full rewrite",
      "Speeds up operational efficiency",
    ],
    idealClients: [
      "Businesses running multiple disconnected software tools",
      "Platforms looking to offer an API to their clients",
      "Companies looking to integrate complex ERPs or CRMs",
    ],
    stack: ["Node.js", "Express", "GraphQL", "REST", "Redis", "AWS API Gateway", "Python"],
    timeline:
      "Simple integrations take 1-2 weeks. Complex custom APIs or legacy system bridges take 4-8 weeks.",
    faqs: [
      {
        id: "api-1",
        category: "API",
        question: "Can you connect our legacy system to modern tools?",
        answer:
          "Yes, we frequently build middle-layer APIs that allow older on-premise systems to communicate safely with modern cloud software.",
      },
    ],
  },
];
