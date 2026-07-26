"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirectTo = params.get("from") ?? "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (authError) {
        setError("Invalid email or password.");
        return;
      }
      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display">Admin Login</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to manage your Sterova website
          </p>
        </div>

        <div className="bg-background rounded-2xl border p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@sterova.tech"
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
                  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring",
                  "transition-all"
                )}
              />
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-medium block mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
                  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring",
                  "transition-all"
                )}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground",
                "px-4 py-2.5 text-sm font-medium shadow-sm shadow-primary/20",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            First time?{" "}
            <a href="/admin/setup" className="text-primary hover:underline">
              Set up admin account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
