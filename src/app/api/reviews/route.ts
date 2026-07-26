import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Simple in-memory rate limit per IP
const ipSubmissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000; // 10 min
const MAX_PER_WINDOW = 3;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = (ipSubmissions.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (times.length >= MAX_PER_WINDOW) return true;
  times.push(now);
  ipSubmissions.set(ip, times);
  return false;
}

export async function GET() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("id, created_at, name, content, rating")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json([], { status: 200 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many reviews submitted. Please wait 10 minutes." },
      { status: 429 }
    );
  }

  let name: string, content: string, rating: number;
  try {
    ({ name, content, rating } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!content || content.trim().length < 10) {
    return NextResponse.json(
      { error: "Review must be at least 10 characters." },
      { status: 400 }
    );
  }
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5." }, { status: 400 });
  }

  const safeContent = content.trim().slice(0, 2000);
  const safeName = (name?.trim() || "Anonymous").slice(0, 100);

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      name: safeName,
      content: safeContent,
      rating,
      approved: true,
    })
    .select("id, created_at, name, content, rating")
    .single();

  if (error) {
    console.error("[Reviews] insert error:", error.message);
    return NextResponse.json({ error: "Failed to submit review." }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
