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
      "mobile application",
      "smartphone app",
    ],
  },
  {
    node: "service-saas",
    keywords: [
      "saas",
      "software as a service",
      "subscription software",
      "b2b saas",
      "b2c saas",
      "multi tenant",
      "platform",
      "startup",
    ],
  },
  {
    node: "service-custom-software",
    keywords: [
      "software",
      "custom software",
      "bespoke software",
      "internal tool",
      "automation",
      "legacy system",
      "modernization",
      "from scratch",
    ],
  },
  {
    node: "service-api-integration",
    keywords: [
      "api",
      "integration",
      "integrate",
      "connect",
      "payment gateway",
      "webhook",
      "third party",
      "rest",
      "graphql",
      "zapier",
    ],
  },
  {
    node: "service-design",
    keywords: [
      "design",
      "ui",
      "ux",
      "ui/ux",
      "user interface",
      "user experience",
      "figma",
      "wireframe",
      "prototype",
      "mockup",
      "redesign",
    ],
  },
  {
    node: "portfolio",
    keywords: [
      "portfolio",
      "work",
      "case study",
      "case studies",
      "examples",
      "past projects",
      "previous work",
      "what you built",
    ],
  },
  {
    node: "contact",
    keywords: [
      "contact",
      "email",
      "phone",
      "call",
      "talk",
      "speak",
      "reach",
      "message",
      "get in touch",
      "location",
      "address",
      "where are you",
    ],
  },

  {
    node: "faqs",
    keywords: ["faq", "faqs", "questions", "frequently asked", "help"],
  },
  {
    node: "process",
    keywords: [
      "process",
      "how you work",
      "how do you work",
      "methodology",
      "agile",
      "steps",
      "stages",
      "timeline",
      "how long",
    ],
  },

  {
    node: "why-sterova",
    keywords: ["why sterova", "why you", "about you", "who are you", "agency", "team", "company"],
  },
  {
    node: "service-request",
    keywords: [
      "service request",
      "request a service",
      "start a project",
      "hire you",
      "hire sterova",
      "work with you",
      "need a developer",
      "build my app",
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
