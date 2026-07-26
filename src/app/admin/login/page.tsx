"use client";

import React, { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function AdminLoginPage() {
  const params = useSearchParams();
  const redirectTo = params.get("from") ?? "/admin";

  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 dark:bg-background p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4 ring-1 ring-primary/20">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display">Admin Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Restricted access — authorized personnel only
          </p>
        </div>

        {/* Form card */}
        <div className="bg-background rounded-2xl border border-border/60 p-6 shadow-sm">
          <form action={formAction} className="space-y-4">
            {/* Hidden redirect field */}
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <div>
              <label
                htmlFor="email"
                className="text-sm font-medium block mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                autoFocus
                placeholder="you@sterova.tech"
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
                  "placeholder:text-muted-foreground/60",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "transition-all duration-150"
                )}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-medium block mb-1.5"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  "w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm",
                  "placeholder:text-muted-foreground/60",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  "transition-all duration-150"
                )}
              />
            </div>

            {/* Error message */}
            {state.error && (
              <div
                role="alert"
                className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5"
              >
                {state.error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-xl",
                "bg-primary text-primary-foreground",
                "px-4 py-2.5 text-sm font-medium",
                "shadow-sm shadow-primary/20 hover:bg-primary/90",
                "transition-colors duration-150",
                "disabled:opacity-60 disabled:cursor-not-allowed"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Authenticating…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Sign in securely
                </>
              )}
            </button>
          </form>
        </div>

        {/* Security notice */}
        <p className="text-center text-xs text-muted-foreground/60 mt-5">
          All access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
}
