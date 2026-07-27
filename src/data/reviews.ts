import type { Review } from "@/types";

export const STATIC_REVIEWS: Review[] = [
  {
    id: "r1",
    created_at: "2024-10-20T10:00:00Z",
    name: "Daniel Park",
    content:
      "Sterova is the real deal. We came in with a vague idea and left with a fully scoped technical plan before we'd spent a dollar. The final product has been running in production for eight months with zero critical incidents.",
    rating: 5,
  },
  {
    id: "r2",
    created_at: "2024-10-05T14:30:00Z",
    name: "Elena Vasquez",
    content:
      "The attention to detail is unmatched. Every API was documented, every database migration was reversible, and the codebase was handed over in a state our internal team could maintain from day one. Rare quality.",
    rating: 5,
  },
  {
    id: "r3",
    created_at: "2024-09-18T09:15:00Z",
    name: "Tom Richardson",
    content:
      "Very professional throughout. Timelines were met, communication was proactive, and the team flagged potential issues well before they became blockers. Would engage again without hesitation.",
    rating: 5,
  },
  {
    id: "r4",
    created_at: "2024-09-02T16:00:00Z",
    name: "Mei-Ling Wu",
    content:
      "Working with Sterova felt like working with a senior in-house engineer who already knew our domain. The onboarding phase was fast and the output was production-quality from sprint one.",
    rating: 5,
  },
  {
    id: "r5",
    created_at: "2024-08-14T11:45:00Z",
    name: "Omar Al-Rashid",
    content:
      "We needed a complete overhaul of our legacy system with zero downtime. Sterova delivered a phased migration plan that was textbook — no drama, no missed deployments, no data loss. Exceptional work.",
    rating: 5,
  },
];
