import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// Rate limiting — in-memory (single process)
const attempts = new Map<string, { count: number; last: number }>();
const WINDOW_MS = 15 * 60 * 1000; // 15 min
const MAX_ATTEMPTS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.last > WINDOW_MS) {
    attempts.set(ip, { count: 1, last: now });
    return false;
  }
  record.count++;
  record.last = now;
  if (record.count > MAX_ATTEMPTS) return true;
  return false;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      { status: 429 }
    );
  }

  let email: string, password: string;
  try {
    ({ email, password } = await req.json());
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email and password (min 8 chars) required." },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Only allow if no admin exists yet
  const { count } = await supabase
    .from("admins")
    .select("*", { count: "exact", head: true });

  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "An admin already exists. Use the login page." },
      { status: 403 }
    );
  }

  // Create the Supabase Auth user
  const { data: userData, error: userError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (userError || !userData.user) {
    return NextResponse.json(
      { error: userError?.message ?? "Failed to create user." },
      { status: 400 }
    );
  }

  // Insert into admins table
  const { error: adminError } = await supabase.from("admins").insert({
    user_id: userData.user.id,
    email,
    role: "super_admin",
    is_active: true,
  });

  if (adminError) {
    // Roll back the auth user
    await supabase.auth.admin.deleteUser(userData.user.id);
    return NextResponse.json(
      { error: "Failed to create admin record." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
