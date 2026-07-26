"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Setup failed. Please try again.");
      } else {
        setDone(true);
        setTimeout(() => router.push("/admin/login"), 2500);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
        <div className="text-center">
          <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Admin account created!</h1>
          <p className="text-sm text-muted-foreground">Redirecting to login…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
            <ShieldCheck className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display">Create Admin Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            One-time setup — only works if no admin exists yet.
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
                placeholder="you@sterova.tech"
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
                  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
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
                minLength={8}
                placeholder="Min. 8 characters"
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
                  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
                )}
              />
            </div>

            <div>
              <label htmlFor="confirm" className="text-sm font-medium block mb-1.5">
                Confirm password
              </label>
              <input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Repeat password"
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
                  "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring"
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
                "px-4 py-2.5 text-sm font-medium shadow-sm",
                "hover:bg-primary/90 transition-colors",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating…
                </>
              ) : (
                "Create admin account"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Already have an account?{" "}
            <a href="/admin/login" className="text-primary hover:underline">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
