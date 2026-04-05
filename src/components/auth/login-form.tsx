"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail, QrCode } from "lucide-react";

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
    <Card className="rounded-[2rem] border-white/85 bg-white/94 shadow-[0_22px_70px_rgba(15,23,42,0.08)] backdrop-blur">
      <CardHeader className="space-y-6 p-6 pt-7 text-center sm:p-7">
        <div className="mx-auto inline-flex items-center gap-3 rounded-[1.5rem] border border-border/60 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(247,244,238,0.96))] px-4 py-3 shadow-sm shadow-black/5">
          <span className="flex size-11 items-center justify-center rounded-2xl border border-white/80 bg-[linear-gradient(180deg,rgba(244,239,231,1),rgba(255,255,255,1))] text-primary shadow-sm shadow-black/5">
            <QrCode className="size-5" />
          </span>
          <span className="min-w-0 text-left pr-1">
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              TableTap Zambia
            </span>
          </span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/75">
          Staff login
        </p>
        <CardTitle className="font-heading text-[1.9rem] leading-tight">
          Sign in to manage your venue
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 px-6 pb-6 sm:px-7 sm:pb-7">
        <form action={formAction} className="space-y-5">
          <input type="hidden" name="next" value={nextPath ?? ""} />

          <label className="block space-y-3.5">
            <span className="text-sm font-medium text-foreground">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="you@venue.com"
                className="h-11 rounded-[1rem] border-border/70 bg-background/75 pl-10"
              />
            </div>
          </label>

          <label className="block space-y-3.5 pt-1">
            <span className="text-sm font-medium text-foreground">Password</span>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                name="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                className="h-11 rounded-[1rem] border-border/70 bg-background/75 pl-10"
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
            className="h-11 w-full rounded-[1rem] shadow-sm shadow-black/5"
          >
            {pending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
