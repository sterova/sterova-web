import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const ReviewSchema = z.object({
  name: z.string().max(100).optional().default("Anonymous"),
  content: z.string().min(10, "Review must be at least 10 characters").max(2000),
  rating: z.number().int().min(1).max(5).default(5),
});

// GET — fetch approved reviews, newest first
export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("reviews")
      .select("id, created_at, name, content, rating")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      // Table may not exist yet — return empty list gracefully
      console.error("[Reviews GET]", error.message);
      return NextResponse.json([]);
    }

    return NextResponse.json(data ?? []);
  } catch (err) {
    console.error("[Reviews GET] unexpected error:", err);
    return NextResponse.json([]);
  }
}

// POST — submit a new review
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = rateLimit(`reviews:${ip}`, { maxRequests: 3, windowMs: 60 * 60 * 1000 });
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many reviews submitted. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid input" },
      { status: 422 }
    );
  }

  const { name, content, rating } = parsed.data;
  const displayName = name?.trim() || "Anonymous";

  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("reviews")
      .insert({ name: displayName, content: content.trim(), rating, ip_address: ip })
      .select("id, created_at, name, content, rating")
      .single();

    if (error) {
      console.error("[Reviews POST]", error.message);
      return NextResponse.json({ error: "Failed to save review. Please try again." }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error("[Reviews POST] unexpected:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
