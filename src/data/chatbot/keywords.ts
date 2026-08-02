/**
 * Keyword routing table for free-text input.
 *
 * The engine lowercases the visitor's message, strips punctuation, and scores
 * each rule by how many of its keywords appear. The highest scoring rule wins;
 * if nothing scores, the fallback node is used. No AI, no fuzzy model — just
 * deterministic matching over this table.
 */

export interface KeywordRule {
  node: string;
  /** Any match counts. Multi-word phrases score higher than single words. */
  keywords: string[];
}

export const KEYWORD_RULES: KeywordRule[] = [
  {
    node: "services",
    keywords: ["service", "services", "what do you do", "offerings", "what you offer"],
  },
  {
    node: "service-web-development",
    keywords: [
      "website",
      "web site",
      "web app",
      "web application",
      "landing page",
      "ecommerce",
      "e-commerce",
      "online store",
      "shop",
      "crm",
      "erp",
      "dashboard",
      "portal",
      "wordpress",
      "webpage",
    ],
  },
  {
    node: "service-mobile-apps",
    keywords: [
      "mobile",
      "app",
      "android",
      "ios",
      "iphone",
      "flutter",
      "react native",
      "play store",
      "app store",
      "mobile app",
    ],
  },
  {
    node: "service-custom-software",
    keywords: [
      "custom software",
      "software",
      "saas",
      "platform",
      "automation",
      "internal tool",
      "legacy",
      "system",
      "api",
    ],
  },
  {
    node: "service-ui-ux",
    keywords: [
      "design",
      "ui",
      "ux",
      "ui/ux",
      "figma",
      "prototype",
      "wireframe",
      "redesign",
      "branding",
      "user experience",
      "interface",
    ],
  },
  {
    node: "portfolio",
    keywords: [
      "portfolio",
      "work",
      "projects",
      "case study",
      "case studies",
      "examples",
      "previous work",
      "showcase",
    ],
  },
  {
    node: "blog",
    keywords: ["blog", "article", "articles", "insights", "news", "posts", "writing"],
  },
  {
    node: "process",
    keywords: [
      "process",
      "how do you work",
      "workflow",
      "methodology",
      "steps",
      "stages",
      "sprint",
      "agile",
    ],
  },
  {
    node: "timelines",
    keywords: [
      "timeline",
      "how long",
      "duration",
      "deadline",
      "delivery time",
      "when will",
      "time frame",
      "timeframe",
      "eta",
    ],
  },
  {
    node: "industries",
    keywords: ["industry", "industries", "sector", "sectors", "niche", "domain", "vertical"],
  },
  {
    node: "technologies",
    keywords: [
      "technology",
      "technologies",
      "tech stack",
      "stack",
      "framework",
      "react",
      "next",
      "node",
      "python",
      "database",
      "postgres",
      "aws",
      "hosting",
      "cloud",
    ],
  },
  {
    node: "why-sterova",
    keywords: [
      "why sterova",
      "why you",
      "why choose",
      "different",
      "advantage",
      "benefits of working",
      "trust",
      "reliable",
    ],
  },
  { node: "about", keywords: ["about", "who are you", "company", "team", "sterova", "your story"] },
  { node: "faqs", keywords: ["faq", "faqs", "question", "questions", "help", "common questions"] },
  {
    node: "pricing",
    keywords: [
      "price",
      "pricing",
      "cost",
      "quote",
      "quotation",
      "budget",
      "how much",
      "rate",
      "rates",
      "charges",
      "fees",
      "estimate cost",
      "expensive",
      "cheap",
    ],
  },
  {
    node: "quote",
    keywords: ["get a quote", "request quote", "proposal", "send me a quote", "quote me"],
  },
  {
    node: "contact",
    keywords: [
      "contact",
      "email",
      "phone",
      "call",
      "reach",
      "whatsapp",
      "address",
      "location",
      "get in touch",
      "talk to",
    ],
  },
  {
    node: "book-consultation",
    keywords: [
      "consultation",
      "book",
      "meeting",
      "appointment",
      "schedule",
      "call me",
      "discuss",
      "demo",
    ],
  },
  {
    node: "estimator",
    keywords: ["estimator", "estimate", "calculator", "project estimate", "scope"],
  },
  {
    node: "support",
    keywords: ["support", "maintenance", "after launch", "bug", "issue", "warranty", "sla"],
  },
  {
    node: "security",
    keywords: [
      "security",
      "secure",
      "gdpr",
      "privacy",
      "data protection",
      "nda",
      "confidential",
      "ownership",
      "intellectual property",
      "ip",
    ],
  },
  {
    node: "hiring",
    keywords: ["job", "career", "hiring", "vacancy", "internship", "work with you", "join"],
  },
  {
    node: "greeting-reply",
    keywords: [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good afternoon",
      "good evening",
      "namaste",
      "yo",
    ],
  },
  {
    node: "thanks-reply",
    keywords: [
      "thanks",
      "thank you",
      "thankyou",
      "appreciate",
      "cheers",
      "great",
      "awesome",
      "perfect",
    ],
  },
  {
    node: "bye-reply",
    keywords: ["bye", "goodbye", "see you", "later", "that's all", "thats all", "done"],
  },
  {
    node: "human-handoff",
    keywords: [
      "human",
      "real person",
      "agent",
      "speak to someone",
      "talk to a person",
      "representative",
    ],
  },
];

const PUNCTUATION = /[^\p{L}\p{N}\s]/gu;

export function normalize(input: string): string {
  return input.toLowerCase().replace(PUNCTUATION, " ").replace(/\s+/g, " ").trim();
}

/** Returns the best-matching node id, or null when nothing matches. */
export function matchKeyword(input: string): string | null {
  const text = normalize(input);
  if (!text) return null;

  let bestNode: string | null = null;
  let bestScore = 0;

  for (const rule of KEYWORD_RULES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      const k = normalize(keyword);
      if (!k) continue;
      const isPhrase = k.includes(" ");
      if (isPhrase) {
        if (text.includes(k)) score += 3 + k.split(" ").length;
      } else if (new RegExp(`\\b${k}\\b`, "u").test(text)) {
        score += 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestNode = rule.node;
    }
  }

  return bestScore > 0 ? bestNode : null;
}
