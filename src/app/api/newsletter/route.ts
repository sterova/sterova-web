import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import type { ApiResponse } from "@/types";

const schema = z.object({
  email: z.string().email().max(320).trim().toLowerCase(),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = rateLimit(`newsletter:${ip}`, {
    maxRequests: 3,
    windowMs: 5 * 60_000,
  });

  if (!allowed) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later.", error: "Rate limit exceeded" },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body", error: "Bad JSON" },
      { status: 400 }
    );
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Please provide a valid email address.", error: "Validation failed" },
      { status: 422 }
    );
  }

  const { email } = parsed.data;

  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert({ email, active: true, source: "website_footer" }, { onConflict: "email" });

    if (error && error.code !== "23505") {
      console.error("[Newsletter API] DB error:", error.message);
      return NextResponse.json(
        { success: false, message: "Failed to subscribe. Please try again.", error: "DB error" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("[Newsletter API] Supabase unavailable:", err);
    return NextResponse.json(
      { success: false, message: "Service temporarily unavailable.", error: "Service error" },
      { status: 503 }
    );
  }

  return NextResponse.json(
    { success: true, message: "You're subscribed!" },
    { status: 200 }
  );
}
