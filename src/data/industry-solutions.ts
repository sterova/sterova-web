export interface IndustrySolution {
  name: string;
  slug: string;
  description: string;
  icon_key: string;
  solutions: string[];
}

/**
 * The industries Sterova is actively set up to serve today: local and growing
 * businesses that need a credible web presence, an easier way to sell, or a
 * focused tool to run day-to-day operations.
 */
export const INDUSTRY_SOLUTIONS: IndustrySolution[] = [
  {
    name: "Local Businesses & Services",
    slug: "local-businesses",
    description: "Clear, fast websites that turn local searches and referrals into enquiries.",
    icon_key: "Store",
    solutions: ["Brochure websites", "Lead forms", "WhatsApp enquiries"],
  },
  {
    name: "Fashion & Apparel",
    slug: "fashion-apparel",
    description:
      "Collection-led storefronts that make your brand, catalogue, and sizes easy to explore.",
    icon_key: "Shirt",
    solutions: ["Lookbooks", "Size guides", "Product catalogues"],
  },
  {
    name: "Ecommerce & D2C",
    slug: "ecommerce-d2c",
    description:
      "Simple online stores built to help growing brands sell without operational clutter.",
    icon_key: "ShoppingBag",
    solutions: ["Online stores", "Payments", "Orders & inventory"],
  },
  {
    name: "Retail & Showrooms",
    slug: "retail-showrooms",
    description:
      "Digital catalogues and customer journeys that connect your shop floor with online demand.",
    icon_key: "Store",
    solutions: ["Digital catalogues", "Stock visibility", "Customer enquiries"],
  },
  {
    name: "Restaurants & Cafes",
    slug: "restaurants-cafes",
    description: "Web experiences that make menus, orders, table bookings, and updates effortless.",
    icon_key: "Utensils",
    solutions: ["Digital menus", "Table bookings", "Order links"],
  },
  {
    name: "Beauty, Salons & Wellness",
    slug: "beauty-wellness",
    description:
      "Polished booking experiences that let clients discover services and reserve a slot quickly.",
    icon_key: "Sparkles",
    solutions: ["Service menus", "Appointments", "Packages"],
  },
  {
    name: "Clinics & Healthcare Practices",
    slug: "clinics-healthcare",
    description:
      "Approachable patient-facing sites and appointment flows for independent practices.",
    icon_key: "Stethoscope",
    solutions: ["Practice websites", "Appointment requests", "Service information"],
  },
  {
    name: "Professional Services",
    slug: "professional-services",
    description:
      "Trust-building websites for consultants, accountants, lawyers, and business advisors.",
    icon_key: "BriefcaseBusiness",
    solutions: ["Service pages", "Lead capture", "Client portals"],
  },
  {
    name: "Real Estate & Interiors",
    slug: "real-estate-interiors",
    description:
      "Visual-first websites that showcase properties, projects, and expertise with confidence.",
    icon_key: "House",
    solutions: ["Property listings", "Project galleries", "Enquiry workflows"],
  },
  {
    name: "Education & Training",
    slug: "education-training",
    description:
      "Easy-to-navigate websites for institutes, tutors, coaches, and training providers.",
    icon_key: "GraduationCap",
    solutions: ["Course pages", "Enrolment forms", "Student resources"],
  },
  {
    name: "Trades & Home Services",
    slug: "trades-home-services",
    description: "Practical websites that help customers understand your work and request a quote.",
    icon_key: "Wrench",
    solutions: ["Service areas", "Quote requests", "Job galleries"],
  },
  {
    name: "Creative Studios & Agencies",
    slug: "creative-studios-agencies",
    description: "Portfolio-led sites that put your work, process, and credibility at the centre.",
    icon_key: "Palette",
    solutions: ["Portfolio sites", "Case studies", "Enquiry forms"],
  },
  {
    name: "Startups & SaaS",
    slug: "startups-saas",
    description:
      "Focused landing pages and MVPs for teams validating a product or preparing to grow.",
    icon_key: "Rocket",
    solutions: ["MVPs", "Product landing pages", "Admin dashboards"],
  },
  {
    name: "Hotels, Travel & Events",
    slug: "hotels-travel-events",
    description: "Conversion-focused sites for stays, experiences, venues, and memorable events.",
    icon_key: "Hotel",
    solutions: ["Booking enquiries", "Itineraries", "Event registrations"],
  },
  {
    name: "Fitness & Sports",
    slug: "fitness-sports",
    description: "Motivating web experiences for gyms, studios, trainers, and sports communities.",
    icon_key: "Dumbbell",
    solutions: ["Membership pages", "Class bookings", "Programmes"],
  },
  {
    name: "Nonprofits & Communities",
    slug: "nonprofits-communities",
    description:
      "Accessible websites that make it easier to share your mission and mobilise supporters.",
    icon_key: "HeartHandshake",
    solutions: ["Campaign pages", "Donations", "Volunteer sign-ups"],
  },
];
