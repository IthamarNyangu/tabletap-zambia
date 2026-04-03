import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, Building2, ScanLine, UsersRound } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Button } from "@/components/ui/button";
import { customerDemoHref } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  currentPath: "/staff" | "/admin";
  eyebrow: string;
  title: string;
  description: string;
  tablePreviewHref?: string;
  children: ReactNode;
}

export function DashboardShell({
  currentPath,
  eyebrow,
  title,
  description,
  tablePreviewHref = customerDemoHref,
  children,
}: DashboardShellProps) {
  const navLinks = [
    {
      href: "/staff",
      label: "Staff",
      icon: UsersRound,
    },
    {
      href: "/admin",
      label: "Admin",
      icon: Building2,
    },
    {
      href: tablePreviewHref,
      label: "Demo table",
      icon: ScanLine,
    },
  ] as const;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(243,239,232,0.9),rgba(248,246,241,1))]">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-lg shadow-black/5 backdrop-blur">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <BrandMark compact />
              <div className="max-w-2xl space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                  {eyebrow}
                </p>
                <div className="space-y-2">
                  <h1 className="font-heading text-3xl leading-tight text-foreground sm:text-4xl">
                    {title}
                  </h1>
                  <p className="max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            <nav
              aria-label="Dashboard navigation"
              className="flex flex-wrap gap-2 lg:justify-end"
            >
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    currentPath === href
                      ? "border-primary/20 bg-primary text-primary-foreground shadow-sm"
                      : "border-border/70 bg-background/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <main className="flex-1 py-6">{children}</main>

        <footer className="flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/75 p-4 text-sm text-muted-foreground shadow-sm shadow-black/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <p>Supabase-backed MVP workflow for venue, staff, and guest flows.</p>
          <Button asChild variant="ghost" className="justify-start sm:justify-center">
            <Link href="/">
              View product landing
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}
