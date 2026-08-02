/**
 * Industries Sterova serves, grouped into categories for the chatbot's
 * two-level industry browser. Each entry carries a short line describing the
 * kind of solution we typically build for that sector.
 */

export interface IndustryEntry {
  name: string;
  emoji: string;
  solution: string;
}

export interface IndustryCategory {
  id: string;
  label: string;
  emoji: string;
  industries: IndustryEntry[];
}

export const INDUSTRY_CATEGORIES: IndustryCategory[] = [
  {
    id: "commerce-retail",
    label: "Commerce & Retail",
    emoji: "🛍️",
    industries: [
      {
        name: "E-Commerce",
        emoji: "🛒",
        solution: "Storefronts, checkout, payments and order management.",
      },
      {
        name: "Retail",
        emoji: "🏬",
        solution: "POS integration, inventory and loyalty programmes.",
      },
      {
        name: "Wholesale & Distribution",
        emoji: "📦",
        solution: "B2B ordering portals and stock visibility.",
      },
      {
        name: "Fashion & Apparel",
        emoji: "👗",
        solution: "Lookbooks, size guides and variant-rich catalogues.",
      },
      {
        name: "Grocery & Supermarkets",
        emoji: "🥬",
        solution: "Slot-based delivery and rapid re-ordering.",
      },
      {
        name: "Food Delivery",
        emoji: "🍔",
        solution: "Live order tracking, rider apps and kitchen dashboards.",
      },
      {
        name: "Restaurants & Cafes",
        emoji: "🍽️",
        solution: "Digital menus, reservations and table ordering.",
      },
      {
        name: "Beauty & Cosmetics",
        emoji: "💄",
        solution: "Subscription boxes and appointment booking.",
      },
    ],
  },
  {
    id: "health-wellness",
    label: "Healthcare & Wellness",
    emoji: "🏥",
    industries: [
      {
        name: "Healthcare",
        emoji: "🏥",
        solution: "Patient portals, records and secure messaging.",
      },
      {
        name: "Hospitals & Clinics",
        emoji: "🩺",
        solution: "Appointments, queueing and staff scheduling.",
      },
      { name: "Pharmacy", emoji: "💊", solution: "Prescription ordering and stock control." },
      {
        name: "Diagnostics & Labs",
        emoji: "🔬",
        solution: "Sample tracking and digital report delivery.",
      },
      {
        name: "Fitness & Gyms",
        emoji: "🏋️",
        solution: "Memberships, class booking and progress tracking.",
      },
      {
        name: "Wellness & Spa",
        emoji: "🧖",
        solution: "Therapist calendars and package management.",
      },
      {
        name: "Mental Health",
        emoji: "🧠",
        solution: "Confidential sessions, journals and reminders.",
      },
      {
        name: "Veterinary",
        emoji: "🐾",
        solution: "Pet records, vaccination reminders and bookings.",
      },
    ],
  },
  {
    id: "finance-professional",
    label: "Finance & Professional Services",
    emoji: "💼",
    industries: [
      {
        name: "Finance",
        emoji: "💰",
        solution: "Dashboards, reconciliation and secure reporting.",
      },
      {
        name: "Banking",
        emoji: "🏦",
        solution: "Customer portals and internal operations tooling.",
      },
      { name: "Insurance", emoji: "🛡️", solution: "Quotation engines and claims workflows." },
      {
        name: "Accounting & Audit",
        emoji: "🧾",
        solution: "Document workflows and client portals.",
      },
      { name: "Legal", emoji: "⚖️", solution: "Case management, documents and time tracking." },
      { name: "Consulting", emoji: "📊", solution: "Client dashboards and engagement reporting." },
      {
        name: "Human Resources",
        emoji: "👥",
        solution: "Hiring pipelines, onboarding and leave management.",
      },
      {
        name: "Recruitment",
        emoji: "🎯",
        solution: "Job boards, applicant tracking and assessments.",
      },
    ],
  },
  {
    id: "education-nonprofit",
    label: "Education & Non-Profit",
    emoji: "🎓",
    industries: [
      {
        name: "Education",
        emoji: "🎓",
        solution: "Course delivery, assessments and parent portals.",
      },
      { name: "Schools", emoji: "🏫", solution: "Admissions, attendance and fee management." },
      {
        name: "Universities",
        emoji: "🎓",
        solution: "Departmental portals and research showcases.",
      },
      { name: "E-Learning", emoji: "💻", solution: "Video courses, quizzes and certificates." },
      {
        name: "Coaching & Training",
        emoji: "📚",
        solution: "Batch scheduling and progress dashboards.",
      },
      {
        name: "Non-Profit & NGO",
        emoji: "🤝",
        solution: "Donations, volunteers and impact reporting.",
      },
      {
        name: "Government & Public Sector",
        emoji: "🏛️",
        solution: "Citizen services and accessible information portals.",
      },
      {
        name: "Religious Organizations",
        emoji: "🕊️",
        solution: "Event calendars, donations and community updates.",
      },
    ],
  },
  {
    id: "property-industry",
    label: "Property, Industry & Logistics",
    emoji: "🏗️",
    industries: [
      {
        name: "Real Estate",
        emoji: "🏠",
        solution: "Listings, virtual tours and enquiry pipelines.",
      },
      {
        name: "Construction",
        emoji: "🏗️",
        solution: "Project tracking, site reports and procurement.",
      },
      {
        name: "Architecture & Interiors",
        emoji: "📐",
        solution: "Portfolio sites and client approval flows.",
      },
      { name: "Manufacturing", emoji: "🏭", solution: "Production tracking and quality control." },
      {
        name: "Logistics & Supply Chain",
        emoji: "🚚",
        solution: "Fleet tracking, dispatch and proof of delivery.",
      },
      { name: "Transportation", emoji: "🚌", solution: "Ticketing, routing and passenger apps." },
      {
        name: "Automotive",
        emoji: "🚗",
        solution: "Service booking, dealer portals and inventory.",
      },
      {
        name: "Agriculture & Agritech",
        emoji: "🌾",
        solution: "Crop records, advisory and marketplace tools.",
      },
      {
        name: "Energy & Utilities",
        emoji: "⚡",
        solution: "Consumption dashboards and field-service apps.",
      },
      {
        name: "Mining & Resources",
        emoji: "⛏️",
        solution: "Site operations and compliance reporting.",
      },
    ],
  },
  {
    id: "media-lifestyle",
    label: "Media, Travel & Lifestyle",
    emoji: "🎬",
    industries: [
      {
        name: "Media & Publishing",
        emoji: "📰",
        solution: "Editorial CMS, paywalls and audience analytics.",
      },
      { name: "Entertainment", emoji: "🎬", solution: "Streaming catalogues and ticketing." },
      { name: "Music & Audio", emoji: "🎵", solution: "Artist platforms and release management." },
      {
        name: "Photography & Creative",
        emoji: "📸",
        solution: "Galleries, proofing and client delivery.",
      },
      {
        name: "Events & Weddings",
        emoji: "🎉",
        solution: "Registrations, RSVPs and vendor coordination.",
      },
      {
        name: "Travel & Tourism",
        emoji: "✈️",
        solution: "Itineraries, bookings and payment flows.",
      },
      {
        name: "Hospitality & Hotels",
        emoji: "🏨",
        solution: "Reservations, housekeeping and guest apps.",
      },
      {
        name: "Sports & Recreation",
        emoji: "⚽",
        solution: "Fixtures, memberships and live scores.",
      },
      { name: "Gaming", emoji: "🎮", solution: "Player accounts, leaderboards and live ops." },
      {
        name: "Marketing & Advertising",
        emoji: "📣",
        solution: "Campaign dashboards and lead pipelines.",
      },
    ],
  },
  {
    id: "technology-services",
    label: "Technology & Services",
    emoji: "💡",
    industries: [
      {
        name: "Technology & SaaS",
        emoji: "💡",
        solution: "Multi-tenant products, billing and admin tooling.",
      },
      {
        name: "Startups",
        emoji: "🚀",
        solution: "MVPs shipped fast, built to scale after funding.",
      },
      {
        name: "Telecommunications",
        emoji: "📡",
        solution: "Self-service portals and provisioning tools.",
      },
      {
        name: "Cybersecurity",
        emoji: "🔐",
        solution: "Monitoring dashboards and incident workflows.",
      },
      {
        name: "IT Services",
        emoji: "🖥️",
        solution: "Ticketing, asset management and SLA reporting.",
      },
      {
        name: "Freelancers & Agencies",
        emoji: "🧑‍💻",
        solution: "Portfolios, proposals and client portals.",
      },
      {
        name: "Professional Trades",
        emoji: "🔧",
        solution: "Job scheduling, quotes and invoicing.",
      },
      {
        name: "Facility Management",
        emoji: "🧹",
        solution: "Work orders, inspections and vendor tracking.",
      },
    ],
  },
];

export const ALL_INDUSTRIES: IndustryEntry[] = INDUSTRY_CATEGORIES.flatMap((c) => c.industries);

export const INDUSTRY_INTRO =
  "Sterova has delivered digital solutions across more than 50 industries. Pick a category to see the sectors we work with and the kind of solutions we build for them.";

export const OTHER_INDUSTRY_MESSAGE =
  "Don't see your industry? That's completely fine — our process adapts to any sector. Tell us about your business and we'll map the right solution.";
