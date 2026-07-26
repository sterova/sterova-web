"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { writeAuditLog } from "@/lib/admin-auth";

const LoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .max(255)
    .email("Invalid email")
    .toLowerCase()
    .trim(),
  password: z.string().min(1, "Password is required").max(256),
  redirectTo: z.string().optional(),
});

export interface LoginState {
  error?: string;
}

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // ── Rate limiting ────────────────────────────────────────────────────
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headersList.get("x-real-ip") ??
    "unknown";

  const rl = rateLimit(`admin:login:${ip}`, {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 5 attempts per 15 minutes
  });

  if (!rl.allowed) {
    return {
      error: "Too many login attempts. Please wait 15 minutes before trying again.",
    };
  }

  // ── Input validation ─────────────────────────────────────────────────
  const parsed = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo"),
  });

  if (!parsed.success) {
    // Generic error — do not reveal which field failed
    return { error: "Invalid credentials." };
  }

  const { email, password, redirectTo } = parsed.data;

  // ── Supabase authentication ───────────────────────────────────────────
  let destination = "/admin";

  try {
    const { createClient: createSupabaseJSClient } = await import("@supabase/supabase-js");
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const jsClient = createSupabaseJSClient(supabaseUrl, supabaseAnonKey);
    const { data: authData, error: authError } = await jsClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user || !authData.session) {
      console.error("[Login Auth Error]", authError);
      const msg = authError?.message || "Invalid email or password.";
      await writeAuditLog({
        action: "admin.login.failed",
        actor_email: email,
        metadata: { ip, reason: msg },
      });
      return { error: msg };
    }

    // Sync session to cookies for SSR
    const supabase = await createClient();
    await supabase.auth.setSession({
      access_token: authData.session.access_token,
      refresh_token: authData.session.refresh_token,
    });

    const user = authData.user;

    const service = createServiceClient();
    const { data: adminRecord, error: adminErr } = await service
      .from("admins")
      .select("id, role, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (adminErr) {
      console.error("[Admin Check Error]", adminErr.message);
    }

    if (!adminRecord) {
      console.error("[Login Error] User authenticated but not found in admins table. User ID:", user.id);
      await supabase.auth.signOut();
      await writeAuditLog({
        action: "admin.login.unauthorized",
        actor_email: email,
        metadata: { ip, reason: "not_in_admins_table" },
      });
      return { error: `Access denied: User (${email}) is not in the admins table.` };
    }

    await writeAuditLog({
      action: "admin.login.success",
      actor_email: email,
      metadata: { ip, role: adminRecord.role },
    });

    // Safe redirect — only allow internal paths
    if (
      redirectTo &&
      redirectTo.startsWith("/") &&
      !redirectTo.startsWith("//") &&
      !redirectTo.startsWith("/admin/login")
    ) {
      destination = redirectTo;
    }
  } catch (err) {
    // Re-throw NEXT_REDIRECT so Next.js can handle it
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
    console.error("[admin login]", err);
    return { error: "An unexpected error occurred. Please try again." };
  }

  redirect(destination);
}
