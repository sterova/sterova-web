import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { sendContactNotification, sendContactConfirmation } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import type { ApiResponse } from "@/types";

const schema = z.object({
  name: z.string().min(2).max(200).trim(),
  email: z.string().email().max(320).trim().toLowerCase(),
  company: z.string().max(200).trim().optional(),
  service: z.string().max(200).trim().optional(),
  budget: z.string().max(100).trim().optional(),
  message: z.string().min(20).max(5000).trim(),
});

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
  // Rate limit: 5 submissions per 10 minutes per IP
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = rateLimit(`contact:${ip}`, {
    maxRequests: 5,
    windowMs: 10 * 60_000,
  });

  if (!allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "Too many submissions. Please try again later.",
        error: "Rate limit exceeded",
      },
      { status: 429 }
    );
  }

  // Parse and validate body
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
    const messages = parsed.error.errors.map((e) => e.message).join(", ");
    return NextResponse.json(
      { success: false, message: messages, error: "Validation failed" },
      { status: 422 }
    );
  }

  const data = parsed.data;

  // Persist to Supabase
  try {
    const supabase = createServiceClient();
    const { error: dbError } = await supabase.from("contact_messages").insert({
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      service: data.service ?? null,
      budget: data.budget ?? null,
      message: data.message,
      status: "new",
      ip_address: ip,
      user_agent: req.headers.get("user-agent")?.slice(0, 500) ?? null,
    });

    if (dbError) {
      console.error("[Contact API] DB insert error:", dbError.message);
      // Continue — we still attempt email; log and don't expose DB details
    }
  } catch (err) {
    console.error("[Contact API] Supabase unavailable:", err);
    // Don't block the response — email may still succeed
  }

  // Send notification email (gracefully degrades without RESEND_API_KEY)
  await Promise.allSettled([
    sendContactNotification(data),
    sendContactConfirmation({ name: data.name, email: data.email }),
  ]);

  return NextResponse.json(
    {
      success: true,
      message:
        "Message received. We'll get back to you within 24 hours.",
    },
    { status: 200 }
  );
}
