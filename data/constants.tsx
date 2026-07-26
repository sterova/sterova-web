import {
  Code2,
  Globe,
  Smartphone,
  Layers,
  Palette,
  Plug,
  Cloud,
  GitBranch,
  Bot,
  Shield,
  MessageSquare,
  Wrench,
  ChevronRight,
} from "lucide-react";
import type { ReactNode } from "react";

// ─────────────────────────────────────────────
// Site metadata
// ─────────────────────────────────────────────
export const SITE = {
  name: "Sterova",
  tagline: "Build. Scale. Innovate.",
  description:
    "Sterova is a modern software development company that helps startups, businesses, and enterprises build high-quality digital products — from web apps and mobile apps to cloud solutions and AI-powered systems.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sterova.tech",
  email: "hello@sterova.tech",
  phone: "[PHONE_PLACEHOLDER]",
  address: "[ADDRESS_PLACEHOLDER]",
  whatsapp: "+919786475035",
  whatsappDisplay: "+91 97864 75035",
  social: {
    twitter: "[TWITTER_PLACEHOLDER]",
    linkedin: "[LINKEDIN_PLACEHOLDER]",
    github: "[GITHUB_PLACEHOLDER]",
    instagram: "[INSTAGRAM_PLACEHOLDER]",
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
      { label: "AI & Automation", href: "/services#ai-automation" },
      { label: "Cloud & DevOps", href: "/services#cloud-devops" },
      { label: "Cybersecurity", href: "/services#cybersecurity" },
    ],
  },
  { label: "Portfolio", href: "/portfolio" },
  { label: "Process", href: "/process" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

// ─────────────────────────────────────────────
// Hero
// ─────────────────────────────────────────────
export const HERO = {
  badge: "Trusted Engineering Partner",
  headline: "Build. Scale. Innovate.",
  subheadline:
    "We help startups, businesses, and enterprises design, develop, and deploy high-quality digital products — fast.",
  cta: {
    primary: { label: "Start a Project", href: "/contact" },
    secondary: { label: "View Our Work", href: "/portfolio" },
  },
  stats: [
    { value: "50+", label: "Projects Delivered" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "12+", label: "Industries Served" },
    { value: "5★", label: "Average Rating" },
  ],
};

// ─────────────────────────────────────────────
// Services
// ─────────────────────────────────────────────
export interface Service {
  id: string;
  icon: ReactNode;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  technologies: string[];
}

export const SERVICES: Service[] = [
  {
    id: "custom-software",
    icon: <Code2 className="h-6 w-6" />,
    title: "Custom Software Development",
    shortDescription:
      "Tailor-made software built around your exact business requirements.",
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
  },
  {
    id: "web-development",
    icon: <Globe className="h-6 w-6" />,
    title: "Web Application Development",
    shortDescription:
      "Fast, accessible, SEO-optimized web apps that convert and scale.",
    description:
      "From marketing sites to full-featured SaaS platforms, we build web applications that are performant, accessible, and designed to grow.",
    features: [
      "Server-side and static rendering with Next.js",
      "Responsive design for all screen sizes",
      "SEO and Core Web Vitals optimization",
      "Authentication, authorization, and user management",
      "Real-time features and interactive UX",
      "Analytics and conversion tracking setup",
    ],
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
  },
  {
    id: "mobile-apps",
    icon: <Smartphone className="h-6 w-6" />,
    title: "Mobile App Development",
    shortDescription:
      "Native-quality iOS and Android apps from a single codebase.",
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
  },
  {
    id: "saas",
    icon: <Layers className="h-6 w-6" />,
    title: "SaaS Product Development",
    shortDescription:
      "End-to-end product engineering for scalable SaaS platforms.",
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
  },
  {
    id: "design",
    icon: <Palette className="h-6 w-6" />,
    title: "UI/UX Design",
    shortDescription:
      "User-centered design that balances beauty with usability.",
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
  },
  {
    id: "ai-automation",
    icon: <Bot className="h-6 w-6" />,
    title: "AI & Automation Solutions",
    shortDescription:
      "Intelligent systems that reduce manual work and surface insights.",
    description:
      "We integrate AI and automation into your products and workflows — from LLM-powered features to intelligent process automation.",
    features: [
      "LLM integration and prompt engineering",
      "AI-powered search and recommendations",
      "Workflow automation pipelines",
      "Data processing and enrichment",
      "Custom ML model integration",
      "Monitoring and cost control",
    ],
    technologies: ["Python", "OpenAI", "LangChain", "PostgreSQL", "Node.js"],
  },
  {
    id: "cloud-devops",
    icon: <Cloud className="h-6 w-6" />,
    title: "Cloud & DevOps",
    shortDescription:
      "Infrastructure that is secure, cost-efficient, and production-ready.",
    description:
      "We design and manage cloud infrastructure that scales with your product — reliable, observable, and built for zero-downtime deployments.",
    features: [
      "Cloud architecture design on Vercel, Supabase, Cloudflare",
      "CI/CD pipeline setup with GitHub Actions",
      "Containerization and orchestration",
      "Infrastructure-as-code",
      "Monitoring, alerting, and observability",
      "Cost optimization reviews",
    ],
    technologies: ["Vercel", "Supabase", "Cloudflare", "GitHub Actions", "Docker"],
  },
  {
    id: "cybersecurity",
    icon: <Shield className="h-6 w-6" />,
    title: "Cybersecurity Consulting",
    shortDescription:
      "Security built in from day one, not bolted on at the end.",
    description:
      "We help businesses identify vulnerabilities, implement security best practices, and build defensible systems from the ground up.",
    features: [
      "Security architecture review",
      "Penetration testing",
      "Row Level Security and access control design",
      "Compliance readiness (GDPR, SOC 2 basics)",
      "Threat modeling",
      "Security code review",
    ],
    technologies: ["Supabase RLS", "OWASP", "CSP", "JWT", "PostgreSQL"],
  },
  {
    id: "api-integration",
    icon: <Plug className="h-6 w-6" />,
    title: "API Development & Integration",
    shortDescription:
      "Seamless integrations that connect your systems and unlock data flow.",
    description:
      "From REST APIs to event-driven architectures, we design robust integrations that connect your stack and power your product.",
    features: [
      "RESTful and GraphQL API design",
      "Third-party API integrations",
      "Webhook systems",
      "API documentation with OpenAPI",
      "Rate limiting and caching",
      "SDK and client library development",
    ],
    technologies: ["Node.js", "Express", "TypeScript", "PostgreSQL", "Redis"],
  },
  {
    id: "maintenance",
    icon: <Wrench className="h-6 w-6" />,
    title: "Software Maintenance & Support",
    shortDescription:
      "Ongoing engineering support to keep your product running at its best.",
    description:
      "We provide retainer-based engineering support — bug fixes, performance tuning, dependency updates, and feature additions on your schedule.",
    features: [
      "Bug tracking and resolution SLAs",
      "Dependency and security updates",
      "Performance monitoring and optimization",
      "Feature development on retainer",
      "Documentation and knowledge transfer",
      "Emergency on-call support",
    ],
    technologies: ["TypeScript", "Node.js", "React", "PostgreSQL", "Next.js"],
  },
  {
    id: "it-consulting",
    icon: <MessageSquare className="h-6 w-6" />,
    title: "IT Consulting",
    shortDescription:
      "Strategic technology advice from engineers who build for a living.",
    description:
      "We help leadership teams make better technology decisions — from vendor selection to architecture reviews to build-vs-buy analysis.",
    features: [
      "Technology stack assessment",
      "Build vs. buy analysis",
      "Vendor evaluation",
      "Technical roadmap planning",
      "CTO-as-a-service for early-stage startups",
      "Engineering team structure and hiring guidance",
    ],
    technologies: ["Strategy", "Architecture", "Cloud", "AI", "Security"],
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
// Portfolio / case studies
// ─────────────────────────────────────────────
export const PORTFOLIO_ITEMS = [
  {
    id: "fintech-dashboard",
    title: "FinTech Analytics Dashboard",
    category: "SaaS · FinTech",
    description:
      "A real-time financial analytics platform processing millions of transactions with sub-second query performance and role-based access for enterprise teams.",
    tags: ["Next.js", "Supabase", "TypeScript", "PostgreSQL"],
    image: "/portfolio/fintech-dashboard.png",
    featured: true,
  },
  {
    id: "healthcare-portal",
    title: "Healthcare Patient Portal",
    category: "Web App · Healthcare",
    description:
      "A HIPAA-aligned patient management system with appointment booking, secure messaging, and EHR integration for a regional clinic network.",
    tags: ["React", "Node.js", "PostgreSQL", "Cloudflare"],
    image: "/portfolio/healthcare-portal.png",
    featured: true,
  },
  {
    id: "ecommerce-platform",
    title: "Multi-Vendor E-commerce Platform",
    category: "SaaS · E-commerce",
    description:
      "A scalable marketplace platform supporting 200+ vendors with automated payouts, inventory management, and a mobile-first storefront.",
    tags: ["Next.js", "Stripe", "Supabase", "React Native"],
    image: "/portfolio/ecommerce.png",
    featured: true,
  },
  {
    id: "logistics-tracker",
    title: "Logistics Tracking System",
    category: "Web App · Logistics",
    description:
      "End-to-end shipment tracking with real-time driver location, automated notifications, and a carrier partner integration layer.",
    tags: ["React", "Node.js", "WebSockets", "PostgreSQL"],
    image: "/portfolio/logistics.png",
    featured: false,
  },
  {
    id: "edtech-lms",
    title: "EdTech Learning Management System",
    category: "SaaS · Education",
    description:
      "A feature-complete LMS with video streaming, progress tracking, quiz engine, and certificate generation for 10,000+ learners.",
    tags: ["Next.js", "Supabase", "Cloudflare", "TypeScript"],
    image: "/portfolio/edtech.png",
    featured: false,
  },
  {
    id: "ai-saas",
    title: "AI-Powered Content Platform",
    category: "SaaS · AI",
    description:
      "A content generation SaaS with LLM integrations, usage-based billing, and a multi-tenant architecture serving B2B customers.",
    tags: ["Next.js", "OpenAI", "Stripe", "Supabase"],
    image: "/portfolio/ai-saas.png",
    featured: false,
  },
];

// ─────────────────────────────────────────────
// Testimonials
// ─────────────────────────────────────────────
export const TESTIMONIALS = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "CEO, NexaPay",
    avatar: "/testimonials/sarah.png",
    rating: 5,
    content:
      "Sterova delivered our FinTech dashboard ahead of schedule and well within budget. Their technical depth is impressive — they flagged architecture risks before they became problems. Highly recommend for any serious product build.",
  },
  {
    id: "2",
    name: "Marcus Okonkwo",
    role: "CTO, MedBridge Health",
    avatar: "/testimonials/marcus.png",
    rating: 5,
    content:
      "We've worked with multiple development agencies. Sterova stands out because they think like engineers, not just executors. The patient portal they built is rock-solid and has handled 3× projected load without issues.",
  },
  {
    id: "3",
    name: "Priya Nair",
    role: "Founder, CartNest",
    avatar: "/testimonials/priya.png",
    rating: 5,
    content:
      "Building a multi-vendor marketplace is complex. Sterova made it look easy. They asked the right questions, documented every decision, and delivered a platform we're proud to run. The post-launch support was equally excellent.",
  },
  {
    id: "4",
    name: "James Whitfield",
    role: "Head of Engineering, LogiTrack",
    avatar: "/testimonials/james.png",
    rating: 5,
    content:
      "The Sterova team integrated into our processes seamlessly. Daily standups, clean commits, clear communication — and the quality of their TypeScript code is exceptional. We've extended the engagement twice.",
  },
  {
    id: "5",
    name: "Aisha Mohammed",
    role: "Product Lead, LearnSphere",
    avatar: "/testimonials/aisha.png",
    rating: 5,
    content:
      "Our LMS handles 10,000+ concurrent learners with zero downtime since launch. Sterova's architecture choices are battle-tested. They are the kind of engineering partner that makes a real difference.",
  },
];

// ─────────────────────────────────────────────
// FAQs
// ─────────────────────────────────────────────
export const FAQS = [
  {
    question: "How long does a typical project take?",
    answer:
      "It depends on scope. A focused MVP typically takes 6–10 weeks. A full-featured SaaS platform can take 3–6 months. We always start with a scoping call to give you an accurate timeline based on your specific requirements.",
  },
  {
    question: "Do you work with early-stage startups?",
    answer:
      "Absolutely. We work with founders from idea stage through to post-Series A. We understand early-stage constraints and can help you prioritize ruthlessly to hit your first milestone with the right technical foundation.",
  },
  {
    question: "Can you work with our existing codebase?",
    answer:
      "Yes. We frequently take over existing projects, perform code audits, refactor legacy systems, and add new features. We'll do an honest technical assessment before committing to anything.",
  },
  {
    question: "What is your tech stack?",
    answer:
      "Our primary stack is Next.js, TypeScript, Tailwind CSS, Supabase, and PostgreSQL for web. For mobile we use React Native and Flutter. For backend services, Node.js and Python. We adapt to your requirements — we're not stack-locked.",
  },
  {
    question: "How do you handle project communication?",
    answer:
      "You get a dedicated project manager, weekly demo calls, a shared Slack channel, and full access to our project management board. No black boxes — you always know what we're working on.",
  },
  {
    question: "Do you sign NDAs?",
    answer:
      "Yes. We sign NDAs as standard before any detailed technical discussions. Your ideas and data stay confidential.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "We offer fixed-price project quotes for well-scoped work, and monthly retainers for ongoing development and support. We discuss pricing transparently after a scoping call — no surprise invoices.",
  },
  {
    question: "What happens after launch?",
    answer:
      "Every project includes a 30-day support window. Beyond that, we offer maintenance retainers for bug fixes, performance monitoring, dependency updates, and feature additions. We don't disappear after delivery.",
  },
  {
    question: "Do you have experience with my industry?",
    answer:
      "We've built products for FinTech, Healthcare, EdTech, E-commerce, Logistics, Real Estate, and more. We learn your domain deeply before starting. Check our portfolio for examples.",
  },
  {
    question: "How do I get started?",
    answer:
      "Fill out the contact form or send us a WhatsApp message describing your project. We'll schedule a free 30-minute scoping call within 24 hours.",
  },
];

// ─────────────────────────────────────────────
// Blog / Insights categories
// ─────────────────────────────────────────────
export const BLOG_CATEGORIES = [
  "All",
  "Engineering",
  "Product",
  "AI & Automation",
  "Design",
  "Startup",
  "Security",
];

// ─────────────────────────────────────────────
// Team members
// ─────────────────────────────────────────────
export const TEAM_MEMBERS = [
  {
    name: "[TEAM_MEMBER_1]",
    role: "[ROLE_PLACEHOLDER]",
    bio: "[BIO_PLACEHOLDER]",
    avatar: "/team/member1.png",
    linkedin: "[LINKEDIN_PLACEHOLDER]",
    github: "[GITHUB_PLACEHOLDER]",
  },
];

// ─────────────────────────────────────────────
// Industries served
// ─────────────────────────────────────────────
export const INDUSTRIES = [
  "FinTech",
  "Healthcare",
  "EdTech",
  "E-commerce",
  "Logistics",
  "Real Estate",
  "Manufacturing",
  "Hospitality",
  "Artificial Intelligence",
  "Cybersecurity",
  "Government & Non-Profit",
];

// ─────────────────────────────────────────────
// Technologies
// ─────────────────────────────────────────────
export const TECH_STACK = {
  frontend: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  backend: ["Node.js", "Express", "Supabase", "PostgreSQL"],
  cloud: ["Vercel", "Supabase", "Cloudflare"],
  mobile: ["React Native", "Flutter"],
  languages: ["TypeScript", "JavaScript", "Python"],
  design: ["Figma"],
  devops: ["Git", "GitHub", "GitHub Actions"],
};

// ─────────────────────────────────────────────
// Footer
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
      { label: "Web Development", href: "/services#web-development" },
      { label: "Mobile Apps", href: "/services#mobile-apps" },
      { label: "SaaS Products", href: "/services#saas" },
      { label: "AI & Automation", href: "/services#ai-automation" },
      { label: "UI/UX Design", href: "/services#design" },
      { label: "Cloud & DevOps", href: "/services#cloud-devops" },
    ],
  },
  {
    heading: "Work",
    links: [
      { label: "Portfolio", href: "/portfolio" },
      { label: "Case Studies", href: "/portfolio" },
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
// About page
// ─────────────────────────────────────────────
export const ABOUT = {
  mission:
    "Build reliable, scalable, and future-ready software that empowers businesses through innovation, quality engineering, and long-term partnerships.",
  vision:
    "Become a globally recognized technology company known for delivering exceptional digital products, trusted engineering, and innovative software solutions.",
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
// Contact page
// ─────────────────────────────────────────────
export const CONTACT = {
  heading: "Start a conversation",
  subheading:
    "Tell us about your project and we'll get back to you within 24 hours.",
  formFields: {
    name: "Full Name",
    email: "Business Email",
    company: "Company Name (optional)",
    service: "Service You Need",
    budget: "Estimated Budget",
    message: "Project Details",
  },
  budgetOptions: [
    "Under $5,000",
    "$5,000 – $15,000",
    "$15,000 – $50,000",
    "$50,000 – $100,000",
    "$100,000+",
    "Not sure yet",
  ],
  serviceOptions: [
    "Custom Software Development",
    "Web Application Development",
    "Mobile App Development",
    "SaaS Product Development",
    "UI/UX Design",
    "API Development & Integration",
    "Cloud & DevOps",
    "AI & Automation",
    "Cybersecurity Consulting",
    "IT Consulting",
    "Software Maintenance & Support",
    "Other",
  ],
};

// ─────────────────────────────────────────────
// Careers
// ─────────────────────────────────────────────
export const OPEN_POSITIONS = [
  // Populate when there are open roles
];
