import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Building2,
  LayoutDashboard,
  MapPinned,
  QrCode,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
  UsersRound,
} from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  audienceSegments,
  customerDemoHref,
  landingPreviewVenue,
  marketingFeatures,
} from "@/lib/mock-data";

const featureIcons = {
  "scan-menu": QrCode,
  "service-actions": BellRing,
  "light-ops": LayoutDashboard,
} as const;

const previewLinks = [
  {
    title: "Customer table page",
    description: "A mobile-first menu and service surface for guests.",
    href: customerDemoHref,
    icon: ScanLine,
  },
  {
    title: "Staff dashboard",
    description: "A quick triage view for requests in motion.",
    href: "/staff",
    icon: UsersRound,
  },
  {
    title: "Admin dashboard",
    description: "A simple venue, table, and menu preview layer.",
    href: "/admin",
    icon: Building2,
  },
] as const;

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(241,236,228,0.88),rgba(248,246,241,1))]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-lg shadow-black/5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <BrandMark />
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="ghost">
              <Link href="/staff">Staff</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/admin">Admin</Link>
            </Button>
            <Button asChild>
              <Link href={customerDemoHref}>
                View live demo
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </header>

        <main className="py-6 sm:py-8">
          <section className="relative overflow-hidden rounded-[2.5rem] border border-white/70 bg-[linear-gradient(140deg,rgba(24,39,47,0.98),rgba(57,75,74,0.92),rgba(174,138,92,0.78))] px-6 py-8 text-primary-foreground shadow-2xl shadow-black/10 sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_28%)]" />
            <div className="relative grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div className="space-y-6">
                <Badge className="border-white/15 bg-white/12 px-3 py-1 text-primary-foreground backdrop-blur">
                  Phase 2 foundation
                </Badge>
                <div className="space-y-4">
                  <h1 className="max-w-3xl font-heading text-4xl leading-tight sm:text-5xl lg:text-6xl">
                    QR-based table service for hospitality teams that want a
                    cleaner, faster guest experience.
                  </h1>
                  <p className="max-w-2xl text-base leading-8 text-primary-foreground/82 sm:text-lg">
                    TableTap Zambia helps guests scan a table QR, browse the
                    menu, see specials, and send simple service requests while
                    staff track everything in a lightweight dashboard.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
                    <Link href={customerDemoHref}>
                      Open customer demo
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white/20 bg-white/8 text-primary-foreground hover:bg-white/16"
                  >
                    <Link href="/staff">See staff workflow</Link>
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/65">
                      Product feel
                    </p>
                    <p className="mt-2 font-medium">Premium SaaS meets hospitality</p>
                  </div>
                  <div className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/65">
                      Current scope
                    </p>
                    <p className="mt-2 font-medium">Supabase-backed MVP flows</p>
                  </div>
                  <div className="rounded-3xl border border-white/12 bg-white/10 p-4 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/65">
                      Best fit
                    </p>
                    <p className="mt-2 font-medium">Restaurants, lounges, lodges</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                {previewLinks.map(({ title, description, href, icon: Icon }) => (
                  <Card
                    key={title}
                    className="rounded-[1.75rem] border-white/12 bg-white/12 text-primary-foreground shadow-none backdrop-blur"
                  >
                    <CardHeader className="gap-3">
                      <div className="flex size-12 items-center justify-center rounded-2xl border border-white/14 bg-white/10">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-primary-foreground">
                          {title}
                        </CardTitle>
                        <CardDescription className="text-primary-foreground/70">
                          {description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button
                        asChild
                        variant="ghost"
                        className="w-full justify-between rounded-2xl border border-white/10 bg-black/10 px-4 text-primary-foreground hover:bg-white/10"
                      >
                        <Link href={href}>
                          Open preview
                          <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="mt-6 rounded-[2.25rem] border border-white/70 bg-white/80 p-6 shadow-lg shadow-black/5 backdrop-blur sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                  MVP features
                </p>
                <h2 className="font-heading text-3xl text-foreground">
                  A narrow first release, shaped around the table experience
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                The goal is fast validation: one clear guest flow, one lightweight
                staff view, and one admin preview that a solo builder can extend.
              </p>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {marketingFeatures.map((feature) => {
                const Icon = featureIcons[feature.id as keyof typeof featureIcons];

                return (
                  <Card
                    key={feature.id}
                    className="rounded-[1.75rem] border-border/60 bg-background/90 shadow-sm shadow-black/5"
                  >
                    <CardHeader className="space-y-4">
                      <div className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/75">
                          {feature.eyebrow}
                        </p>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <Card className="rounded-[2.25rem] border-white/70 bg-white/80 shadow-lg shadow-black/5 backdrop-blur">
              <CardHeader className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                  Who it is for
                </p>
                <CardTitle className="font-heading text-3xl">
                  Built for venues where speed should never feel rushed
                </CardTitle>
                <CardDescription className="max-w-xl text-sm leading-7">
                  The MVP is especially useful for teams with outdoor seating,
                  lounge-style service, or high-volume table checks.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                {audienceSegments.map((segment) => (
                  <div
                    key={segment.id}
                    className="rounded-[1.5rem] border border-border/60 bg-secondary/40 p-4"
                  >
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium text-foreground">
                        {segment.title}
                      </h3>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {segment.description}
                      </p>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {segment.venueExamples.map((example) => (
                        <Badge
                          key={example}
                          variant="outline"
                          className="border-primary/15 bg-background/70 px-3"
                        >
                          {example}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="rounded-[2.25rem] border-white/70 bg-white/80 shadow-lg shadow-black/5 backdrop-blur">
              <CardHeader className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-primary/80">
                  Demo venue
                </p>
                <div className="space-y-2">
                  <CardTitle className="font-heading text-3xl">
                    {landingPreviewVenue.name}
                  </CardTitle>
                  <CardDescription className="text-sm leading-7">
                    {landingPreviewVenue.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-border/60 bg-secondary/45 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <MapPinned className="size-4 text-primary" />
                      {landingPreviewVenue.location}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {landingPreviewVenue.ambienceNote}
                    </p>
                  </div>
                  <div className="rounded-[1.5rem] border border-border/60 bg-secondary/45 p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <ShieldCheck className="size-4 text-primary" />
                      Phase 2 boundaries
                    </div>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      No auth, payments, notifications, waiter assignment, or
                      backend integration yet.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <p className="text-sm font-medium text-foreground">
                    What guests can do today
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {landingPreviewVenue.actionLabels.map((label) => (
                      <Badge
                        key={label}
                        variant="outline"
                        className="border-primary/15 bg-background/70 px-3 py-1"
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-6 rounded-[2.25rem] border border-white/70 bg-[linear-gradient(135deg,rgba(25,41,50,0.97),rgba(57,74,76,0.92))] p-6 text-primary-foreground shadow-xl shadow-black/10 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl space-y-3">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.32em] text-primary-foreground/70">
                  <Sparkles className="size-4" />
                  Call to action
                </p>
                <h2 className="font-heading text-3xl leading-tight sm:text-4xl">
                  Start with the table experience, then expand once real venue
                  workflows are clear.
                </h2>
                <p className="text-sm leading-7 text-primary-foreground/78 sm:text-base">
                  This foundation is ready for the next phase: auth, stronger
                  staff controls, and policies layered on top of the new data model.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-white text-primary hover:bg-white/90">
                  <Link href={customerDemoHref}>
                    Preview guest flow
                    <UtensilsCrossed className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-white/18 bg-white/10 text-primary-foreground hover:bg-white/16"
                >
                  <Link href="/admin">Open admin preview</Link>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
