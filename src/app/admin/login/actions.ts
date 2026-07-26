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
    const supabase = await createClient();

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      await writeAuditLog({
        action: "admin.login.failed",
        actor_email: email,
        metadata: { ip, reason: "invalid_credentials" },
      });
      // Generic message — never reveal whether the email exists
      return { error: "Invalid email or password." };
    }

    // ── Admin table check ─────────────────────────────────────────────
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Authentication failed. Please try again." };
    }

    const service = createServiceClient();
    const { data: adminRecord } = await service
      .from("admins")
      .select("id, role, is_active")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .maybeSingle();

    if (!adminRecord) {
      // Authenticated with Supabase but not an admin — sign out immediately
      await supabase.auth.signOut();
      await writeAuditLog({
        action: "admin.login.unauthorized",
        actor_email: email,
        metadata: { ip, reason: "not_in_admins_table" },
      });
      return { error: "Access denied." };
    }

    await writeAuditLog({
      action: "admin.login.success",
      actor_email: email,
      metadata: { ip, role: adminRecord.role },
    });

    // Safe redirect — only allow internal paths
    if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
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
