// ─────────────────────────────────────────────
// Site metadata
// ─────────────────────────────────────────────
export const SITE = {
  name: "Sterova",
  tagline: "Custom software, engineered to last.",
  description:
    "Sterova is a software engineering partner for startups and enterprises. We design, build, and maintain web platforms, mobile apps, and SaaS products that ship on time and scale with your business.",
  url: "https://sterova.tech",
  email: "hello@sterova.tech",
  phone: "TODO: Add phone number",
  address: "TODO: Add physical address",
  whatsapp: "+919786475035",
  whatsappDisplay: "+91 97864 75035",
  social: {
    twitter: "TODO: Add Twitter URL",
    linkedin: "TODO: Add LinkedIn URL",
    github: "TODO: Add GitHub URL",
    instagram: "TODO: Add Instagram URL",
  },
  ogImage: "/og-image.png",
};

// ─────────────────────────────────────────────
// Navigation
// ─────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Custom Software", href: "/services#custom-software" },
      { label: "Web Development", href: "/services#web-development" },
      { label: "Mobile Apps", href: "/services#mobile-apps" },
      { label: "SaaS Products", href: "/services#saas" },
      { label: "UI/UX Design", href: "/services#design" },
      { label: "API Integration", href: "/services#api-integration" },
      { label: "Software Maintenance", href: "/services#maintenance" },
    ],
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Process", href: "/process" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

// ─────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────
export const HERO = {
  badge: "Software Engineering Partner",
  headline: "Software your business can build on",
  headlineHighlight: "build on",
  subheadline:
    "We design and engineer web platforms, mobile apps, and SaaS products for startups and enterprise teams — delivered on time, built to scale, and supported long after launch.",
  cta: {
    primary: { label: "Start a Project", href: "/contact" },
    secondary: { label: "View Our Work", href: "/portfolio" },
  },
  // Commitments we can stand behind — no unverifiable metrics or invented
  // social proof. Swap in real numbers only once they can be substantiated.
  assurances: [
    "Fixed-scope quotes before we start",
    "Direct access to your engineers",
    "You own the code and infrastructure",
    "Support continues after launch",
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
    id: "mobile-apps",
    slug: "mobile-apps",
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
    id: "saas",
    slug: "saas",
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
    id: "design",
    slug: "design",
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
    id: "api-integration",
    slug: "api-integration",
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
    id: "maintenance",
    slug: "maintenance",
    icon_name: "Wrench",
    title: "Software Maintenance & Support",
    short_description: "Ongoing engineering support so your product keeps running smoothly.",
    description:
      "We offer retainer-based engineering support — bug fixes, performance tuning, dependency updates, and feature work on your schedule.",
    features: [
      "Bug tracking and resolution SLAs",
      "Dependency and security updates",
      "Performance monitoring and optimization",
      "Feature development on retainer",
      "Documentation and knowledge transfer",
      "Emergency on-call support",
    ],
    technologies: ["TypeScript", "Node.js", "React", "PostgreSQL"],
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
    deliverables: ["Requirements document", "Technical scope", "Project timeline", "Fixed-price or milestone quote"],
  },
  {
    number: "02",
    title: "Architecture & Design",
    description:
      "Our engineers design the system architecture while our designers create user flows, wireframes, and high-fidelity UI. You review and approve before development begins.",
    deliverables: ["System architecture diagram", "Database schema", "UI/UX wireframes", "Design system"],
  },
  {
    number: "03",
    title: "Development Sprints",
    description:
      "We work in focused two-week sprints with regular demos and progress updates. You have full visibility into what we're building at every stage.",
    deliverables: ["Working software each sprint", "Sprint demo sessions", "Code repository access", "Progress reports"],
  },
  {
    number: "04",
    title: "QA & Testing",
    description:
      "Every feature is tested thoroughly — unit tests, integration tests, end-to-end tests, and manual QA. Nothing ships without meeting our quality bar.",
    deliverables: ["Test suite", "Bug reports and fixes", "Performance benchmarks", "Accessibility audit"],
  },
  {
    number: "05",
    title: "Launch & Deployment",
    description:
      "We handle the full production deployment — infrastructure setup, environment configuration, monitoring, and a smooth go-live with zero-downtime deployment.",
    deliverables: ["Production deployment", "CI/CD pipeline", "Monitoring setup", "Launch checklist"],
  },
  {
    number: "06",
    title: "Post-Launch Support",
    description:
      "We stay with you after launch. Bug fixes, performance monitoring, and feature iterations keep your product improving beyond day one.",
    deliverables: ["30-day support window", "Bug fix SLA", "Performance monitoring", "Knowledge transfer"],
  },
];

// ─────────────────────────────────────────────
// Portfolio
// ─────────────────────────────────────────────
export const PORTFOLIO_ITEMS = [
  {
    id: "fintech-dashboard",
    title: "FinTech Analytics Dashboard",
    slug: "fintech-dashboard",
    category: "SaaS · FinTech",
    description:
      "A real-time financial analytics platform processing millions of transactions with sub-second query performance and role-based access for enterprise teams.",
    tags: ["Next.js", "Supabase", "TypeScript", "PostgreSQL"],
    image_url: null,
    live_url: null,
    github_url: null,
    is_featured: true,
    is_active: true,
    display_order: 0,
  },
  {
    id: "healthcare-portal",
    title: "Healthcare Patient Portal",
    slug: "healthcare-portal",
    category: "Web App · Healthcare",
    description:
      "A HIPAA-aligned patient management system with appointment booking, secure messaging, and EHR integration for a regional clinic network.",
    tags: ["React", "Node.js", "PostgreSQL", "Cloudflare"],
    image_url: null,
    live_url: null,
    github_url: null,
    is_featured: true,
    is_active: true,
    display_order: 1,
  },
  {
    id: "ecommerce-platform",
    title: "Multi-Vendor E-commerce Platform",
    slug: "ecommerce-platform",
    category: "SaaS · E-commerce",
    description:
      "A scalable marketplace platform supporting 200+ vendors with automated payouts, inventory management, and a mobile-first storefront.",
    tags: ["Next.js", "Stripe", "Supabase", "React Native"],
    image_url: null,
    live_url: null,
    github_url: null,
    is_featured: true,
    is_active: true,
    display_order: 2,
  },
  {
    id: "logistics-tracker",
    title: "Logistics Tracking System",
    slug: "logistics-tracker",
    category: "Web App · Logistics",
    description:
      "End-to-end shipment tracking with real-time driver location, automated notifications, and a carrier partner integration layer.",
    tags: ["React", "Node.js", "WebSockets", "PostgreSQL"],
    image_url: null,
    live_url: null,
    github_url: null,
    is_featured: false,
    is_active: true,
    display_order: 3,
  },
  {
    id: "edtech-lms",
    title: "EdTech Learning Management System",
    slug: "edtech-lms",
    category: "SaaS · Education",
    description:
      "A feature-complete LMS with video streaming, progress tracking, quiz engine, and certificate generation for 10,000+ learners.",
    tags: ["Next.js", "Supabase", "Cloudflare", "TypeScript"],
    image_url: null,
    live_url: null,
    github_url: null,
    is_featured: false,
    is_active: true,
    display_order: 4,
  },
  {
    id: "ai-saas",
    title: "AI-Powered Content Platform",
    slug: "ai-saas",
    category: "SaaS · AI",
    description:
      "A content generation SaaS with LLM integrations, usage-based billing, and a multi-tenant architecture serving B2B customers.",
    tags: ["Next.js", "OpenAI", "Stripe", "Supabase"],
    image_url: null,
    live_url: null,
    github_url: null,
    is_featured: false,
    is_active: true,
    display_order: 5,
  },
];

// ─────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────
// WARNING: Placeholder data only. These people, companies, and quotes are
// fictional and are NOT rendered anywhere on the site. Do not publish them —
// attributing invented quotes to named companies is a credibility and legal
// risk. Replace with real, written-permission testimonials before use.
export const TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CEO",
    company: "NexaPay",
    avatar_url: null,
    rating: 5,
    content:
      "Sterova delivered our FinTech dashboard ahead of schedule and well within budget. Their technical depth is impressive — they flagged architecture risks before they became problems. Highly recommend for any serious product build.",
    is_active: true,
    display_order: 0,
  },
  {
    id: "2",
    name: "Marcus Okonkwo",
    role: "CTO",
    company: "MedBridge Health",
    avatar_url: null,
    rating: 5,
    content:
      "We've worked with multiple development agencies. Sterova stands out because they think like engineers, not just executors. The patient portal they built is rock-solid and has handled 3× projected load without issues.",
    is_active: true,
    display_order: 1,
  },
  {
    id: "3",
    name: "Priya Nair",
    role: "Founder",
    company: "CartNest",
    avatar_url: null,
    rating: 5,
    content:
      "Building a multi-vendor marketplace is complex. Sterova made it look easy. They asked the right questions, documented every decision, and delivered a platform we're proud to run. The post-launch support was equally excellent.",
    is_active: true,
    display_order: 2,
  },
  {
    id: "4",
    name: "James Whitfield",
    role: "Head of Engineering",
    company: "LogiTrack",
    avatar_url: null,
    rating: 5,
    content:
      "The Sterova team integrated into our processes seamlessly. Daily standups, clean commits, clear communication — and the quality of their TypeScript code is exceptional. We've extended the engagement twice.",
    is_active: true,
    display_order: 3,
  },
  {
    id: "5",
    name: "Aisha Mohammed",
    role: "Product Lead",
    company: "LearnSphere",
    avatar_url: null,
    rating: 5,
    content:
      "Our LMS handles 10,000+ concurrent learners with zero downtime since launch. Sterova's architecture choices are battle-tested. They are the kind of engineering partner that makes a real difference.",
    is_active: true,
    display_order: 4,
  },
];

// ─────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────
export const FAQS = [
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
    id: "7",
    question: "How is pricing structured?",
    answer:
      "We offer fixed-price project quotes for well-scoped work, and monthly retainers for ongoing development and support. We discuss pricing transparently after a scoping call — no surprise invoices.",
    is_active: true,
    display_order: 6,
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
// Blog categories
// ─────────────────────────────────────────────
export const BLOG_CATEGORIES = [
  "All",
  "Engineering",
  "Product",
  "Design",
  "Startup",
];

// ─────────────────────────────────────────────
// Industries
// ─────────────────────────────────────────────
export const INDUSTRIES = [
  { name: "FinTech", icon_name: "Landmark", description: "Payment platforms, banking tools, and financial dashboards" },
  { name: "Healthcare", icon_name: "HeartPulse", description: "Patient portals, clinic systems, and health data platforms" },
  { name: "EdTech", icon_name: "GraduationCap", description: "Learning management systems and course platforms" },
  { name: "E-commerce", icon_name: "ShoppingCart", description: "Online stores, marketplaces, and inventory systems" },
  { name: "Logistics", icon_name: "Truck", description: "Fleet tracking, route planning, and supply chain tools" },
  { name: "Real Estate", icon_name: "Building2", description: "Property listings, CRM tools, and tenant management" },
  { name: "Manufacturing", icon_name: "Factory", description: "Production tracking, quality control, and ERP integrations" },
  { name: "Hospitality", icon_name: "UtensilsCrossed", description: "Booking engines, POS systems, and guest management" },
  { name: "Non-Profit & Government", icon_name: "Users", description: "Grant tracking, case management, and public service portals" },
];

// ─────────────────────────────────────────────
// Tech stack
// ─────────────────────────────────────────────
export const TECH_STACK = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  backend: ["Node.js", "Express", "Supabase", "PostgreSQL"],
  cloud: ["Vercel", "Supabase", "Cloudflare", "Firebase"],
  mobile: ["React Native", "Flutter"],
  languages: ["TypeScript", "JavaScript", "Python"],
  design: ["Figma"],
  devops: ["Git", "GitHub", "GitHub Actions"],
};

// ─────────────────────────────────────────────
// Footer links
// ─────────────────────────────────────────────
export const FOOTER_LINKS = [
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Process", href: "/process" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Services",
    links: [
      { label: "Custom Software", href: "/services#custom-software" },
      { label: "Web Development", href: "/services#web-development" },
      { label: "Mobile Apps", href: "/services#mobile-apps" },
      { label: "SaaS Products", href: "/services#saas" },
      { label: "UI/UX Design", href: "/services#design" },
      { label: "API Integration", href: "/services#api-integration" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Testimonials", href: "/#testimonials" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

// ─────────────────────────────────────────────
// About
// ─────────────────────────────────────────────
export const ABOUT = {
  mission:
    "Build reliable software that actually works for the people using it — and keeps working as their business grows.",
  vision:
    "Be the engineering partner people recommend by name — because the work speaks for itself.",
  values: [
    {
      title: "Innovation",
      description:
        "We stay at the frontier of technology so our clients don't have to. We invest in learning, experimentation, and new approaches.",
    },
    {
      title: "Quality",
      description:
        "We set a high bar on code quality, testing, and architecture. Good enough is never good enough for us.",
    },
    {
      title: "Trust",
      description:
        "We are honest about timelines, risks, and limitations. Clients trust us because we earn it — not because we oversell.",
    },
    {
      title: "Transparency",
      description:
        "Full visibility into progress, decisions, and code. No black boxes, no surprises.",
    },
    {
      title: "Security",
      description:
        "Security is a first-class concern, not an afterthought. We design defensible systems from day one.",
    },
    {
      title: "Customer Success",
      description:
        "We measure our success by the success of our clients. We stay engaged long after launch.",
    },
  ],
};

// ─────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────
export const CONTACT = {
  heading: "Start a conversation",
  subheading:
    "Have a question or want to work together? Send us a message and we'll get back to you within 24 hours.",
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
    "Software Maintenance & Support",
    "Other",
  ],
};

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

// ─────────────────────────────────────────────
// Pre-seeded particles for hero (fixed to avoid hydration mismatch)
// ─────────────────────────────────────────────
export const HERO_PARTICLES = [
  { x: 8,  y: 12, size: 2.5, delay: 0,   duration: 5.5 },
  { x: 92, y: 8,  size: 2,   delay: 0.8, duration: 7   },
  { x: 18, y: 75, size: 3,   delay: 1.5, duration: 6   },
  { x: 85, y: 65, size: 2,   delay: 0.3, duration: 8   },
  { x: 55, y: 88, size: 2.5, delay: 2,   duration: 5   },
  { x: 35, y: 18, size: 2,   delay: 1.1, duration: 6.5 },
  { x: 72, y: 30, size: 3,   delay: 0.6, duration: 7.5 },
  { x: 25, y: 50, size: 1.5, delay: 2.3, duration: 5.8 },
  { x: 80, y: 82, size: 2,   delay: 1.7, duration: 6.2 },
  { x: 48, y: 5,  size: 2.5, delay: 0.4, duration: 7.2 },
  { x: 12, y: 40, size: 2,   delay: 3,   duration: 5.5 },
  { x: 65, y: 55, size: 1.5, delay: 1.9, duration: 8.5 },
  { x: 42, y: 68, size: 2,   delay: 0.9, duration: 6.8 },
  { x: 78, y: 20, size: 1.5, delay: 2.5, duration: 7.3 },
  { x: 5,  y: 58, size: 2.5, delay: 1.3, duration: 5.2 },
  { x: 58, y: 35, size: 1.5, delay: 3.2, duration: 9   },
  { x: 30, y: 90, size: 2,   delay: 0.7, duration: 6.4 },
  { x: 68, y: 78, size: 1.5, delay: 2.1, duration: 7.8 },
  { x: 90, y: 42, size: 2,   delay: 1.4, duration: 5.9 },
  { x: 22, y: 28, size: 2.5, delay: 2.8, duration: 6.1 },
];
