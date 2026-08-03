export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServicePageContent {
  slug: string;
  title: string;
  eyebrow: string;
  seoTitle: string;
  seoDescription: string;
  overview: string;
  audience: string[];
  benefits: string[];
  technologies: string[];
  process: { title: string; description: string }[];
  pricing: string;
  faqs: ServiceFaq[];
  relatedSlugs: string[];
  projectTerms: string[];
}

export const SERVICE_PAGES: ServicePageContent[] = [
  {
    slug: "custom-software",
    title: "Custom Software Development",
    eyebrow: "Custom software",
    seoTitle: "Custom Software Development",
    seoDescription:
      "Custom software development for growing businesses—designed around your workflow, users, and next stage of growth.",
    overview:
      "When off-the-shelf tools force you to work around their limits, we build software around the way your business actually works. From internal tools to customer-facing platforms, we turn complex workflows into dependable, easy-to-use products.",
    audience: [
      "Businesses managing key work in spreadsheets, inboxes, or disconnected tools",
      "Founders with a validated process that needs a tailored digital product",
      "Teams that need a clearer way to manage customers, operations, or reporting",
    ],
    benefits: [
      "A system shaped around your workflow instead of someone else’s template",
      "Clear roles, data, and approvals for the people who use it every day",
      "A modular foundation that can grow feature by feature",
      "Reliable integrations with the tools your team already depends on",
      "A focused interface that reduces repetitive work and costly mistakes",
      "Ownership of the product and a straightforward path for future improvements",
    ],
    technologies: ["TypeScript", "React", "Node.js", "PostgreSQL", "Supabase", "Vercel"],
    process: [
      {
        title: "Map the workflow",
        description:
          "We learn where the friction is, who needs what, and what success should look like.",
      },
      {
        title: "Define the right first release",
        description:
          "We separate must-haves from future ideas and turn the scope into a practical build plan.",
      },
      {
        title: "Design and build in focused stages",
        description:
          "You see working progress early, with regular checkpoints for feedback and decisions.",
      },
      {
        title: "Launch, learn, and improve",
        description:
          "After a careful release, we help you prioritise the next improvements based on real use.",
      },
    ],
    pricing:
      "Custom software is priced around the agreed scope, integrations, and complexity. We begin with a discovery conversation, then provide a transparent fixed-price or milestone-based proposal before development starts.",
    faqs: [
      {
        question: "How do we know if custom software is the right choice?",
        answer:
          "It is usually the right choice when a repeated workflow is central to your business and existing tools create too much manual work, risk, or limitation.",
      },
      {
        question: "Can you improve an existing internal tool?",
        answer:
          "Yes. We can audit what you have, stabilise the essential parts, and plan improvements without forcing a risky all-at-once rebuild.",
      },
      {
        question: "Will we own the software?",
        answer:
          "Yes. Your proposal will make ownership, access, and handover clear from the start.",
      },
    ],
    relatedSlugs: ["api-development", "ui-ux-design", "maintenance-support"],
    projectTerms: ["dashboard", "platform", "portal", "saas", "software", "workflow"],
  },
  {
    slug: "web-development",
    title: "Web Development",
    eyebrow: "Web development",
    seoTitle: "Web Development for Growing Businesses",
    seoDescription:
      "Fast, accessible, SEO-ready websites and web applications built to help growing businesses earn trust and convert interest into action.",
    overview:
      "Your website is often the first serious conversation a customer has with your business. We design and build clear, fast, mobile-first websites and web applications that explain your value, earn trust, and make the next action obvious.",
    audience: [
      "Businesses that need a more credible, modern website",
      "Teams launching a new service, brand, or online presence",
      "Companies that want a site built for leads, SEO, performance, and future growth",
    ],
    benefits: [
      "A distinct website that reflects your business—not a recycled template",
      "Mobile-first pages that stay fast and easy to use on every screen",
      "Clear page structure designed around real customer questions",
      "Technical SEO foundations, analytics, and conversion tracking",
      "Content editing options that keep routine updates simple",
      "A maintainable codebase ready for new pages, campaigns, or features",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Supabase", "Cloudflare"],
    process: [
      {
        title: "Understand the audience",
        description:
          "We clarify your offer, ideal customer, content priorities, and the action each page should support.",
      },
      {
        title: "Plan the structure",
        description:
          "We shape the sitemap, page hierarchy, and content flow before visual design begins.",
      },
      {
        title: "Design and develop",
        description:
          "We build responsive pages with performance, accessibility, and search visibility considered from the start.",
      },
      {
        title: "Launch with confidence",
        description:
          "We test key journeys, set up essential tracking, and make sure your team knows how to maintain the site.",
      },
    ],
    pricing:
      "Web projects are scoped by the number of page types, content support, integrations, and required functionality. You receive a clear proposal with deliverables and milestones before we begin.",
    faqs: [
      {
        question: "Can you build a simple static website?",
        answer:
          "Absolutely. A focused brochure site is often the best first step for a growing business. It can be fast, polished, and built to expand when you are ready.",
      },
      {
        question: "Will the website be SEO-friendly?",
        answer:
          "Yes. We build semantic structure, responsive performance, metadata, and technical fundamentals into the project rather than treating SEO as an afterthought.",
      },
      {
        question: "Can we update the website after launch?",
        answer:
          "Yes. We can provide an editing workflow for regular content changes and remain available for larger updates or new features.",
      },
    ],
    relatedSlugs: ["ui-ux-design", "api-development", "maintenance-support"],
    projectTerms: ["website", "web", "ecommerce", "store", "portfolio", "landing"],
  },
  {
    slug: "mobile-development",
    title: "Mobile App Development",
    eyebrow: "Mobile development",
    seoTitle: "Mobile App Development for iOS and Android",
    seoDescription:
      "Practical iOS and Android app development for businesses that need a focused, reliable mobile experience for customers or teams.",
    overview:
      "We build mobile apps for the moments that happen away from a desk: serving customers, completing field work, managing bookings, or keeping a team connected. The goal is a fast, focused experience that feels natural on iOS and Android.",
    audience: [
      "Businesses whose customers or teams need access on the move",
      "Founders validating a mobile-first product idea",
      "Operations teams replacing paper, calls, or fragmented field workflows",
    ],
    benefits: [
      "One considered product experience across iOS and Android",
      "Offline-friendly flows for work that cannot wait on a signal",
      "Push notifications that keep the right people informed",
      "Secure sign-in and role-based access where needed",
      "A scalable codebase without building the same app twice",
      "Support through testing, store submission, and post-launch updates",
    ],
    technologies: [
      "React Native",
      "Expo",
      "TypeScript",
      "Supabase",
      "Firebase",
      "App Store Connect",
    ],
    process: [
      {
        title: "Validate the mobile moment",
        description:
          "We identify the highest-value tasks people need to complete quickly from their phone.",
      },
      {
        title: "Prototype the key flows",
        description:
          "We make navigation, touch targets, and important states clear before development begins.",
      },
      {
        title: "Build and test on real devices",
        description:
          "We develop in increments and test the experience where it will actually be used.",
      },
      {
        title: "Prepare for release",
        description:
          "We handle production readiness, store requirements, and a plan for future updates.",
      },
    ],
    pricing:
      "Mobile apps are scoped by the core journeys, backend needs, device features, and release requirements. We recommend a focused first version, then provide fixed milestones for the agreed scope.",
    faqs: [
      {
        question: "Do you build for both iPhone and Android?",
        answer:
          "Yes. We use cross-platform technology where it makes sense to deliver a strong experience across both platforms efficiently.",
      },
      {
        question: "Can the app work without an internet connection?",
        answer:
          "When the use case needs it, we design key tasks to work offline and sync safely when a connection returns.",
      },
      {
        question: "Can you publish the app for us?",
        answer:
          "Yes. We guide the app through App Store and Google Play requirements and support the release process.",
      },
    ],
    relatedSlugs: ["custom-software", "ui-ux-design", "api-development"],
    projectTerms: ["mobile", "app", "booking", "field", "delivery"],
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    eyebrow: "UI/UX design",
    seoTitle: "UI/UX Design for Websites and Digital Products",
    seoDescription:
      "User-focused UI/UX design for websites, ecommerce stores, and digital products that need to feel clear, credible, and easy to use.",
    overview:
      "Good design is not decoration. It makes a business easier to understand and a product easier to use. We turn your goals, content, and customer needs into clear journeys and polished interfaces that people can navigate with confidence.",
    audience: [
      "Businesses refreshing a dated or inconsistent digital presence",
      "Founders who need to validate a product before committing to development",
      "Teams whose website or software feels hard to use, unclear, or out of step with the brand",
    ],
    benefits: [
      "Clear user journeys that reduce hesitation and dead ends",
      "A visual system that makes your brand feel consistent and credible",
      "Responsive layouts designed for the screens your customers actually use",
      "Wireframes that let you test the structure before investing in build",
      "Accessible interaction and content patterns that serve more people",
      "Developer-ready designs that make implementation smoother and more predictable",
    ],
    technologies: ["Figma", "FigJam", "Tailwind CSS", "shadcn/ui", "Framer Motion", "Maze"],
    process: [
      {
        title: "Learn and align",
        description:
          "We clarify the audience, business goal, content, and constraints that should guide the work.",
      },
      {
        title: "Make the journey clear",
        description:
          "We map the information architecture and wireframe the pages or product flows that matter most.",
      },
      {
        title: "Create the interface",
        description:
          "We develop a visual direction and responsive screens with purposeful detail, not decoration for its own sake.",
      },
      {
        title: "Prepare for handoff",
        description:
          "You receive organised files, interaction notes, and a system developers can use with confidence.",
      },
    ],
    pricing:
      "Design engagements are priced by the number of journeys, screens, research depth, and handoff needs. We can begin with a focused design sprint or combine design and development in one delivery plan.",
    faqs: [
      {
        question: "Can you design only, without development?",
        answer:
          "Yes. We can deliver a complete design package for your internal team or another development partner to build.",
      },
      {
        question: "Will we see the design before it is built?",
        answer:
          "Yes. Review and approval are part of the process. You will see the key flows and visual direction before development begins.",
      },
      {
        question: "Can you work with our existing brand?",
        answer:
          "Yes. We can work within an established identity or help create a practical visual foundation where one does not yet exist.",
      },
    ],
    relatedSlugs: ["web-development", "mobile-development", "custom-software"],
    projectTerms: ["design", "ui", "ux", "brand", "website", "app"],
  },
  {
    slug: "api-development",
    title: "API Development & Integration",
    eyebrow: "API development",
    seoTitle: "API Development and Integration Services",
    seoDescription:
      "API development and integration services that connect your website, ecommerce store, software, and day-to-day business tools reliably.",
    overview:
      "Your tools should work together without constant copying, checking, or chasing information. We design dependable APIs and integrations that connect the systems behind your business, so data moves where it needs to and your team can focus on the work that matters.",
    audience: [
      "Teams moving data manually between systems, spreadsheets, or inboxes",
      "Businesses connecting ecommerce, payments, CRM, accounting, or operational tools",
      "Product teams that need a secure, documented API for a new platform",
    ],
    benefits: [
      "Less duplicate data entry and fewer avoidable operational errors",
      "Reliable connections between the tools your business already uses",
      "Clear API contracts that make future integrations easier",
      "Secure authentication, validation, and sensible access controls",
      "Monitoring and error handling so issues are visible before they become problems",
      "Documentation your team and future developers can actually use",
    ],
    technologies: ["Node.js", "TypeScript", "REST", "GraphQL", "PostgreSQL", "Redis"],
    process: [
      {
        title: "Audit the systems",
        description:
          "We map the data, source systems, events, and failure points involved in the workflow.",
      },
      {
        title: "Design the connection",
        description:
          "We agree how data should move, who can access it, and how errors should be handled.",
      },
      {
        title: "Build and test safely",
        description:
          "We implement the integration with validation, logging, and test cases for normal and edge scenarios.",
      },
      {
        title: "Document and monitor",
        description:
          "We provide clear handover notes and establish the right visibility for ongoing operation.",
      },
    ],
    pricing:
      "Integration work is priced by the systems involved, data complexity, authentication requirements, and expected edge cases. We investigate the workflow first, then scope the work into clear milestones.",
    faqs: [
      {
        question: "Can you connect the tools we already use?",
        answer:
          "In most cases, yes. We first check the available APIs, data access, and workflow requirements before recommending the most reliable approach.",
      },
      {
        question: "Do you only work with APIs?",
        answer:
          "No. We can also design webhooks, scheduled synchronisation, import/export flows, and the supporting admin tools around an integration.",
      },
      {
        question: "What happens if a connection fails?",
        answer:
          "We design for visibility and recovery with logging, alerts where appropriate, and clear handling for retriable errors.",
      },
    ],
    relatedSlugs: ["custom-software", "web-development", "maintenance-support"],
    projectTerms: ["api", "integration", "automation", "dashboard", "payment", "crm"],
  },
  {
    slug: "maintenance-support",
    title: "Maintenance & Support",
    eyebrow: "Maintenance & support",
    seoTitle: "Website and Software Maintenance & Support",
    seoDescription:
      "Ongoing website and software maintenance for businesses that need dependable updates, fixes, performance checks, and a responsive technical partner.",
    overview:
      "A successful launch is only the beginning. We help businesses keep their websites and software reliable, secure, and useful with practical ongoing support—whether we built the product or you need a new team to take care of an existing one.",
    audience: [
      "Businesses that need dependable help after a website or product launch",
      "Teams with an existing site or application that needs fixes, updates, or performance attention",
      "Founders who want a technical partner for steady improvements instead of emergency-only help",
    ],
    benefits: [
      "A clear point of contact for fixes, updates, and planned improvements",
      "Regular checks for performance, dependencies, and operational risk",
      "A practical backlog so the most valuable improvements happen first",
      "Faster response when something important needs attention",
      "Documentation and knowledge transfer that reduce long-term dependency",
      "Flexible support that can grow from a few hours to a regular delivery rhythm",
    ],
    technologies: ["GitHub", "Sentry", "Vercel", "Cloudflare", "Supabase", "PostHog"],
    process: [
      {
        title: "Review the current state",
        description:
          "We assess the product, codebase, hosting, and immediate risks before agreeing on a support plan.",
      },
      {
        title: "Prioritise the work",
        description:
          "We separate urgent fixes, preventative maintenance, and valuable improvements into a manageable backlog.",
      },
      {
        title: "Deliver in a steady rhythm",
        description:
          "We resolve tasks, share progress, and keep you informed without creating unnecessary process.",
      },
      {
        title: "Keep improving",
        description:
          "We use real issues and user feedback to make the product more reliable and more useful over time.",
      },
    ],
    pricing:
      "Support can be arranged as a monthly retainer, a pre-purchased block of hours, or a focused improvement sprint. The right model depends on the product’s condition, urgency, and how often you expect changes.",
    faqs: [
      {
        question: "Can you support software built by another team?",
        answer:
          "Yes. We begin with a technical review so we can understand the codebase, hosting, access, and the safest way to take over support.",
      },
      {
        question: "What is included in maintenance?",
        answer:
          "It can include bug fixes, dependency updates, monitoring, backups, performance checks, content support, and planned feature work—tailored to your product.",
      },
      {
        question: "Do we need a long-term contract?",
        answer:
          "Not always. We can start with an audit or a focused support block, then decide together whether an ongoing arrangement makes sense.",
      },
    ],
    relatedSlugs: ["web-development", "custom-software", "api-development"],
    projectTerms: ["maintenance", "support", "website", "software", "dashboard"],
  },
  {
    slug: "saas-development",
    title: "SaaS Product Development",
    eyebrow: "SaaS development",
    seoTitle: "SaaS Product Development for Founders",
    seoDescription:
      "SaaS product development for founders and teams who need a focused MVP, a scalable technical foundation, and a practical launch plan.",
    overview:
      "We help founders and product teams turn a real market opportunity into a SaaS product with a clear first version, thoughtful user experience, and a technical foundation that will not need to be thrown away as the business grows.",
    audience: [
      "Founders validating a software product idea",
      "Teams replacing a manual service with a scalable digital product",
      "Businesses adding a subscription product or customer portal",
    ],
    benefits: [
      "A focused MVP that tests the right assumptions without unnecessary features",
      "Multi-tenant architecture designed for sensible growth",
      "Secure accounts, permissions, billing, and admin controls",
      "A clear product roadmap shaped by what early customers need most",
      "Design and engineering working together from the first user flow",
      "A launch-ready foundation for iteration, feedback, and traction",
    ],
    technologies: ["React", "TypeScript", "Supabase", "PostgreSQL", "Stripe", "Vercel"],
    process: [
      {
        title: "Clarify the first customer",
        description:
          "We define the problem, user, and smallest product experience worth bringing to market.",
      },
      {
        title: "Plan the MVP",
        description:
          "We shape a practical release around the features that prove value and leave space for learning.",
      },
      {
        title: "Build the product foundation",
        description:
          "We deliver the core product, accounts, data, and operational tools in visible stages.",
      },
      {
        title: "Launch and iterate",
        description:
          "We help you release, gather feedback, and make the next product decisions with evidence.",
      },
    ],
    pricing:
      "SaaS work is usually delivered in phases: discovery and MVP definition first, then a milestone-based build. This keeps early investment focused while giving you clear decision points as the product takes shape.",
    faqs: [
      {
        question: "Can you help us define the MVP?",
        answer:
          "Yes. Defining the right first version is a core part of the work. We help you focus on the user problem and avoid spending on features that can wait.",
      },
      {
        question: "Can the SaaS scale later?",
        answer:
          "We make architecture choices with future growth in mind, while keeping the first release appropriately focused and cost-conscious.",
      },
      {
        question: "Do you help after launch?",
        answer:
          "Yes. We can continue as a product and engineering partner for support, improvements, and new capabilities.",
      },
    ],
    relatedSlugs: ["custom-software", "ui-ux-design", "api-development"],
    projectTerms: ["saas", "platform", "mvp", "dashboard", "product"],
  },
];

export function getServicePage(slug: string) {
  return SERVICE_PAGES.find((service) => service.slug === slug);
}
