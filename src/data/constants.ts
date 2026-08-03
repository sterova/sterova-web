// ─────────────────────────────────────────────
// Site metadata
// ─────────────────────────────────────────────
export const SITE = {
  name: "Sterova",
  alternateName: "Sterova Tech",
  tagline: "Custom Software & Web App Development Agency",
  description:
    "Sterova is a premier software engineering agency specializing in custom web platforms, native mobile apps, and SaaS product development. Built to scale.",
  url: "https://sterova.tech",
  email: "hello@sterova.tech",
  phone: "+91 97864 75035",
  /** Physical office address to boost local relevance and trust signals. */
  address: "Dindigul, Tamil Nadu, India",
  whatsapp: "+919786475035",
  whatsappDisplay: "+91 97864 75035",
  social: {
    twitter: "https://x.com/sterova",
    linkedin: "https://www.linkedin.com/company/sterova",
    github: "https://github.com/sterova",
    instagram: "",
  },
  ogImage: "/og-image.png",
};

/** Verified profiles for the Organization entity (schema.org `sameAs`). */
export const SAME_AS = [
  SITE.social.linkedin,
  SITE.social.github,
  SITE.social.twitter,
  SITE.social.instagram,
].filter(Boolean);

/** Single source of truth for the published postal address. */
export const POSTAL_ADDRESS = {
  addressLocality: "Dindigul",
  addressRegion: "Tamil Nadu",
  postalCode: "624001",
  addressCountry: "IN",
};

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      {
        label: "Web Development",
        href: "/services/web-development",
        description: "Fast, scalable web apps & platforms",
        icon_name: "Globe",
      },
      {
        label: "Mobile Apps",
        href: "/services/mobile-development",
        description: "iOS & Android from a single codebase",
        icon_name: "Smartphone",
      },
      {
        label: "UI/UX Design",
        href: "/services/ui-ux-design",
        description: "Research-driven, conversion-focused design",
        icon_name: "Palette",
      },
      {
        label: "API Development",
        href: "/services/api-development",
        description: "Clean integrations & event-driven APIs",
        icon_name: "Plug",
      },
      {
        label: "Custom Software",
        href: "/services/custom-software",
        description: "Tailor-made software for your exact needs",
        icon_name: "Code2",
      },
      {
        label: "SaaS Products",
        href: "/services/saas-development",
        description: "End-to-end SaaS product engineering",
        icon_name: "Layers",
      },
    ],
  },
  {
    label: "Work",
    href: "/portfolio",
  },
  { label: "Solutions", href: "/industries" },
  { label: "About", href: "/about" },
  {
    label: "Resources",
    href: "/resources",
    children: [
      {
        label: "Blog",
        href: "/blog",
        description: "Engineering and design notes",
        icon_name: "BookOpen",
        feature_key: "blog",
      },
      {
        label: "Technologies",
        href: "/technologies",
        description: "Our core tech stack",
        icon_name: "Monitor",
        feature_key: "technologies",
      },
    ],
  },
];

// ─────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────
export const HERO = {
  badge: "Digital products for growing businesses",
  headline: ["Engineering", "Technology"],
  headlineHighlight: ["That Drives", "Growth"],
  subheadline:
    "Sterova designs and builds websites, online stores, and custom software that turn interest into action—and take friction out of the work behind the scenes.",
  cta: {
    primary: { label: "Start a conversation", href: "/start-project" },
    secondary: { label: "See what we build", href: "/portfolio" },
  },
  // Commitments we can stand behind — no unverifiable metrics or invented
  // social proof. Swap in real numbers only once they can be substantiated.
  assurances: [
    "A clear plan before work begins",
    "Direct access to the people doing the work",
    "You own your code, accounts, and assets",
    "Practical support after launch",
  ],
  ecosystem: [
    { icon_name: "Code2", label: "Custom Software" },
    { icon_name: "Globe", label: "Web Platforms" },
    { icon_name: "Smartphone", label: "Mobile Apps" },
    { icon_name: "Layers", label: "SaaS Products" },
    { icon_name: "Palette", label: "UI/UX Design" },
    { icon_name: "Plug", label: "API Integration" },
  ],
};

// ─────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────
export const SERVICES = [
  {
    id: "custom-software",
    slug: "custom-software",
    icon_name: "Code2",
    title: "Custom Software Development",
    short_description: "Tailor-made software built around your exact business requirements.",
    description:
      "We architect and build custom software solutions from the ground up — designed to fit your workflows, scale with your growth, and outlast off-the-shelf alternatives.",
    features: [
      "Requirements analysis and technical scoping",
      "Full-stack development with modern frameworks",
      "API design and third-party integrations",
      "Automated testing and QA",
      "CI/CD setup and deployment pipelines",
      "Ongoing maintenance and support",
    ],
    technologies: ["TypeScript", "Node.js", "PostgreSQL", "React", "Next.js"],
    display_order: 0,
    is_active: true,
  },
  {
    id: "web-development",
    slug: "web-development",
    icon_name: "Globe",
    title: "Web Application Development",
    short_description: "Fast, accessible, SEO-optimized web apps that convert and scale.",
    description:
      "From marketing sites to full-featured SaaS platforms, we build web applications that are performant, accessible, and designed to grow.",
    features: [
      "Server-side and static rendering",
      "Responsive design for all screen sizes",
      "SEO and Core Web Vitals optimization",
      "Authentication, authorization, and user management",
      "Real-time features and interactive UX",
      "Analytics and conversion tracking setup",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase", "Vite"],
    display_order: 1,
    is_active: true,
  },
  {
    id: "mobile-development",
    slug: "mobile-development",
    icon_name: "Smartphone",
    title: "Mobile App Development",
    short_description: "Native-quality iOS and Android apps from a single codebase.",
    description:
      "We build cross-platform mobile applications using React Native and Flutter — delivering native performance with efficient development cycles.",
    features: [
      "Cross-platform iOS and Android development",
      "Native performance and smooth animations",
      "Offline-first architecture",
      "Push notifications and background services",
      "App Store and Play Store publishing",
      "OTA update support",
    ],
    technologies: ["React Native", "Flutter", "TypeScript", "Expo"],
    display_order: 2,
    is_active: true,
  },
  {
    id: "saas-development",
    slug: "saas-development",
    icon_name: "Layers",
    title: "SaaS Product Development",
    short_description: "End-to-end product engineering for scalable SaaS platforms.",
    description:
      "We partner with founders and product teams to design, build, and launch SaaS products — from MVP to enterprise scale.",
    features: [
      "Product architecture and technical strategy",
      "Multi-tenant data isolation",
      "Subscription billing integrations",
      "Role-based access control",
      "Admin dashboard and analytics",
      "Feature flagging and gradual rollouts",
    ],
    technologies: ["Next.js", "Supabase", "PostgreSQL", "Stripe", "Vercel"],
    display_order: 3,
    is_active: true,
  },
  {
    id: "ui-ux-design",
    slug: "ui-ux-design",
    icon_name: "Palette",
    title: "UI/UX Design",
    short_description: "User-centered design that balances beauty with usability.",
    description:
      "Our design process is research-driven and conversion-focused — creating interfaces that are intuitive, accessible, and on-brand.",
    features: [
      "User research and persona development",
      "Information architecture and wireframing",
      "High-fidelity UI design in Figma",
      "Design system creation",
      "Usability testing and iteration",
      "Handoff-ready developer specifications",
    ],
    technologies: ["Figma", "Tailwind CSS", "shadcn/ui", "Framer Motion"],
    display_order: 4,
    is_active: true,
  },
  {
    id: "api-development",
    slug: "api-development",
    icon_name: "Plug",
    title: "API Development & Integration",
    short_description: "Clean integrations that connect your systems and keep data flowing.",
    description:
      "From REST APIs to event-driven architectures, we build integrations that connect your stack and keep everything talking to each other.",
    features: [
      "RESTful and GraphQL API design",
      "Third-party API integrations",
      "Webhook systems",
      "API documentation with OpenAPI",
      "Rate limiting and caching",
      "SDK and client library development",
    ],
    technologies: ["Node.js", "Express", "TypeScript", "PostgreSQL", "Redis"],
    display_order: 5,
    is_active: true,
  },
  {
    id: "maintenance-support",
    slug: "maintenance-support",
    icon_name: "LifeBuoy",
    title: "Maintenance & Support",
    short_description:
      "Dependable ongoing care for the website or software your business relies on.",
    description:
      "We keep digital products healthy after launch with practical fixes, security updates, performance checks, and a steady path for improvements.",
    features: [
      "Bug fixes and priority issue support",
      "Security and dependency updates",
      "Performance monitoring and optimisation",
      "Regular maintenance reporting",
      "Feature enhancements and backlog planning",
      "Documentation and knowledge transfer",
    ],
    technologies: ["GitHub", "Sentry", "Vercel", "Cloudflare", "Supabase"],
    display_order: 6,
    is_active: true,
  },
];

// ─────────────────────────────────────────────
// Process steps
// ─────────────────────────────────────────────
export const PROCESS_STEPS = [
  {
    number: "01",
    title: "Discovery & Scoping",
    description:
      "We start by understanding your goals, constraints, and users. We map requirements, identify risks, and define a clear technical scope before writing a single line of code.",
    deliverables: [
      "Requirements document",
      "Technical scope",
      "Project timeline",
      "Fixed-price or milestone quote",
    ],
  },
  {
    number: "02",
    title: "Architecture & Design",
    description:
      "Our engineers design the system architecture while our designers create user flows, wireframes, and high-fidelity UI. You review and approve before development begins.",
    deliverables: [
      "System architecture diagram",
      "Database schema",
      "UI/UX wireframes",
      "Design system",
    ],
  },
  {
    number: "03",
    title: "Development Sprints",
    description:
      "We work in focused two-week sprints with regular demos and progress updates. You have full visibility into what we're building at every stage.",
    deliverables: [
      "Working software each sprint",
      "Sprint demo sessions",
      "Code repository access",
      "Progress reports",
    ],
  },
  {
    number: "04",
    title: "QA & Testing",
    description:
      "Every feature is tested thoroughly — unit tests, integration tests, end-to-end tests, and manual QA. Nothing ships without meeting our quality bar.",
    deliverables: [
      "Test suite",
      "Bug reports and fixes",
      "Performance benchmarks",
      "Accessibility audit",
    ],
  },
  {
    number: "05",
    title: "Launch & Deployment",
    description:
      "We handle the full production deployment — infrastructure setup, environment configuration, monitoring, and a smooth go-live with zero-downtime deployment.",
    deliverables: [
      "Production deployment",
      "CI/CD pipeline",
      "Monitoring setup",
      "Launch checklist",
    ],
  },
  {
    number: "06",
    title: "Post-Launch Support",
    description:
      "We stay with you after launch. Bug fixes, performance monitoring, and feature iterations keep your product improving beyond day one.",
    deliverables: [
      "30-day support window",
      "Bug fix SLA",
      "Performance monitoring",
      "Knowledge transfer",
    ],
  },
];

// ─────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────
// WARNING: Placeholder data only. These people, companies, and quotes are
// fictional and are NOT rendered anywhere on the site. Do not publish them —
// attributing invented quotes to named companies is a credibility and legal
// risk. Replace with real, written-permission testimonials before use.

// ─────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────
export const FAQS = [
  {
    id: "disambiguation",
    question: "Are you Sterova the AI 3D generator?",
    answer:
      "No, we are Sterova, a custom software engineering and SaaS development agency. If you are looking for the AI text-to-3D tool, that is a separate product located at sterova.com.",
    is_active: true,
    display_order: 0,
  },
  {
    id: "1",
    question: "How long does a typical project take?",
    answer:
      "It depends on scope. A focused MVP typically takes 6–10 weeks. A full-featured SaaS platform can take 3–6 months. We always start with a scoping call to give you an accurate timeline based on your specific requirements.",
    is_active: true,
    display_order: 0,
  },
  {
    id: "2",
    question: "Do you work with early-stage startups?",
    answer:
      "Absolutely. We work with founders from idea stage through to post-Series A. We understand early-stage constraints and can help you prioritize ruthlessly to hit your first milestone with the right technical foundation.",
    is_active: true,
    display_order: 1,
  },
  {
    id: "3",
    question: "Can you work with our existing codebase?",
    answer:
      "Yes. We frequently take over existing projects, perform code audits, refactor legacy systems, and add new features. We'll do an honest technical assessment before committing to anything.",
    is_active: true,
    display_order: 2,
  },
  {
    id: "4",
    question: "What is your tech stack?",
    answer:
      "Our primary stack is React, TypeScript, Tailwind CSS, Supabase, and PostgreSQL for web. For mobile we use React Native and Flutter. For backend services, Node.js and Python. We adapt to your requirements — we're not stack-locked.",
    is_active: true,
    display_order: 3,
  },
  {
    id: "5",
    question: "How do you handle project communication?",
    answer:
      "You get a dedicated project manager, weekly demo calls, a shared Slack channel, and full access to our project management board. No black boxes — you always know what we're working on.",
    is_active: true,
    display_order: 4,
  },
  {
    id: "6",
    question: "Do you sign NDAs?",
    answer:
      "Yes. We sign NDAs as standard before any detailed technical discussions. Your ideas and data stay confidential.",
    is_active: true,
    display_order: 5,
  },
  {
    id: "8",
    question: "What happens after launch?",
    answer:
      "Every project includes a 30-day support window. Beyond that, we offer maintenance retainers for bug fixes, performance monitoring, dependency updates, and feature additions. We don't disappear after delivery.",
    is_active: true,
    display_order: 7,
  },
  {
    id: "9",
    question: "Do you have experience with my industry?",
    answer:
      "We've built products for FinTech, Healthcare, EdTech, E-commerce, Logistics, Real Estate, and more. We learn your domain deeply before starting. Check our portfolio for examples.",
    is_active: true,
    display_order: 8,
  },
  {
    id: "10",
    question: "How do I get started?",
    answer:
      "Fill out the contact form or send us a WhatsApp message describing your project. We'll schedule a free 30-minute scoping call within 24 hours.",
    is_active: true,
    display_order: 9,
  },
];

// ─────────────────────────────────────────────
// Industries
// ─────────────────────────────────────────────
export const INDUSTRIES = [
  {
    name: "FinTech",
    icon_name: "Landmark",
    description: "Payment platforms, banking tools, and financial dashboards",
  },
  {
    name: "Healthcare",
    icon_name: "HeartPulse",
    description: "Patient portals, clinic systems, and health data platforms",
  },
  {
    name: "EdTech",
    icon_name: "GraduationCap",
    description: "Learning management systems and course platforms",
  },
  {
    name: "E-commerce",
    icon_name: "ShoppingCart",
    description: "Online stores, marketplaces, and inventory systems",
  },
  {
    name: "Logistics",
    icon_name: "Truck",
    description: "Fleet tracking, route planning, and supply chain tools",
  },
  {
    name: "Real Estate",
    icon_name: "Building2",
    description: "Property listings, CRM tools, and tenant management",
  },
  {
    name: "Manufacturing",
    icon_name: "Factory",
    description: "Production tracking, quality control, and ERP integrations",
  },
  {
    name: "Hospitality",
    icon_name: "UtensilsCrossed",
    description: "Booking engines, POS systems, and guest management",
  },
  {
    name: "Non-Profit & Government",
    icon_name: "Users",
    description: "Grant tracking, case management, and public service portals",
  },
];

// ─────────────────────────────────────────────
// Footer links
// ─────────────────────────────────────────────
export const FOOTER_LINKS = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers", feature_key: "careers" },
      { label: "Our Process", href: "/process", feature_key: "process" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "Mobile Apps", href: "/services/mobile-development" },
      { label: "UI/UX Design", href: "/services/ui-ux-design" },
      { label: "API Development", href: "/services/api-development" },
      { label: "Custom Software", href: "/services/custom-software" },
      { label: "SaaS Products", href: "/services/saas-development" },
      { label: "Maintenance & Support", href: "/services/maintenance-support" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Solutions", href: "/industries" },
    ],
  },
  {
    heading: "Resources",
    links: [
      { label: "Blog", href: "/blog", feature_key: "blog" },
      { label: "Technologies", href: "/technologies", feature_key: "technologies" },
    ],
  },
];

// ─────────────────────────────────────────────
// About
// ─────────────────────────────────────────────
export const ABOUT = {
  heroDescription:
    "Sterova helps growing businesses turn ambitious ideas into clear, useful digital products — from confident websites and online stores to focused software.",
  mission:
    "To make thoughtful, high-quality digital products accessible to the businesses doing meaningful work every day.",
  vision:
    "To be the digital partner clients recommend because the work is clear, dependable, and genuinely helps them grow.",
  values: [
    {
      title: "Listen before building",
      description:
        "The best answer starts with the right question. We learn how your business works before deciding what to make.",
    },
    {
      title: "Build with purpose",
      description:
        "Every page, feature, and workflow should earn its place by making something clearer, faster, or more useful.",
    },
    {
      title: "Communicate openly",
      description:
        "We share progress, explain decisions, and raise risks early. Good collaboration should never feel like a black box.",
    },
    {
      title: "Care about the details",
      description:
        "Craft lives in the things people notice and the things they do not: speed, clarity, reliability, and considerate design.",
    },
    {
      title: "Protect what matters",
      description:
        "We treat your data, your customers, and your reputation with the care they deserve from the start.",
    },
    {
      title: "Stay accountable",
      description:
        "We measure our work by whether it helps you move forward—and we stay close enough to make the next improvement count.",
    },
  ],
};

// ─────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────
export const CONTACT = {
  heading: "Start a conversation",
  subheading:
    "Have a question or want to work with Sterova? Send us a message and our team will get back to you within 24 hours.",
  formFields: {
    name: "Full Name",
    email: "Email Address",
    subject: "Subject (optional)",
    message: "Your Message",
  },
  budgetOptions: [],
  serviceOptions: [
    "Custom Software Development",
    "Web Application Development",
    "Mobile App Development",
    "SaaS Product Development",
    "UI/UX Design",
    "API Development & Integration",
    "Other",
  ],
};

// ─────────────────────────────────────────────
// Social + professional links (shared by every contact surface)
// ─────────────────────────────────────────────
export const SOCIAL_LINKS = [
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "/company/sterova",
    href: "https://www.linkedin.com/company/sterova",
  },
  { key: "github", label: "GitHub", handle: "@sterova", href: "https://github.com/sterova" },
  { key: "x", label: "X (Twitter)", handle: "@sterova", href: "https://x.com/sterova" },
  {
    key: "instagram",
    label: "Instagram",
    handle: "@sterova",
    href: "https://instagram.com/sterova",
  },
  { key: "dribbble", label: "Dribbble", handle: "@sterova", href: "https://dribbble.com/sterova" },
  { key: "behance", label: "Behance", handle: "@sterova", href: "https://www.behance.net/sterova" },
] as const;

/** Internal “professional” destinations surfaced next to the enquiry forms. */
export const PROFESSIONAL_LINKS = [
  { label: "Our work", description: "Case studies and shipped products", href: "/portfolio" },
  { label: "Services", description: "Six engineering disciplines", href: "/services" },
  { label: "Engineering blog", description: "Notes from the delivery team", href: "/blog" },
  { label: "Careers", description: "Join the team", href: "/careers" },
] as const;

// ─────────────────────────────────────────────
// Careers
// ─────────────────────────────────────────────
export const OPEN_POSITIONS: {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
}[] = [];
// Add open positions here when available
