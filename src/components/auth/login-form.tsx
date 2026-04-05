"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail } from "lucide-react";

import type { LoginActionState } from "@/lib/actions/auth";
import { loginAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  nextPath?: string;
}

const initialLoginActionState: LoginActionState = {};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialLoginActionState
  );

  return (
    <Card className="rounded-[2rem] border-white/80 bg-white/92 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
      <CardHeader className="space-y-3 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
          Staff login
        </p>
        <CardTitle className="font-heading text-[1.9rem] leading-tight">
          Sign in to manage your venue
        </CardTitle>
        <p className="text-sm leading-7 text-muted-foreground">
          Use your email and password to access the staff or admin dashboard.
        </p>
      </CardHeader>

      <CardContent className="space-y-4 px-6 pb-6">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={nextPath ?? ""} />

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@venue.com"
                className="h-11 rounded-[1rem] border-border/70 bg-background/80 pl-10"
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Password</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 rounded-[1rem] border-border/70 bg-background/80 pl-10"
              />
            </div>
          </label>

          {state.error ? (
            <div className="rounded-[1rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-muted-foreground">
              {state.error}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            disabled={pending}
            className="h-11 w-full rounded-[1rem]"
          >
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
