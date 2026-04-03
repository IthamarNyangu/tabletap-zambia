import Link from "next/link";
import { MapPinned, Sparkles, SunMedium, Trees, UsersRound } from "lucide-react";

import { BrandMark } from "@/components/layout/brand-mark";
import { ServiceActionPanel } from "@/components/customer/service-action-panel";
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
import type { MenuCategory, MenuItem, ServiceAction, Venue, VenueTable } from "@/lib/types";

interface CustomerTableViewProps {
  venue: Venue;
  table: VenueTable;
  menuCategories: MenuCategory[];
  specials: MenuItem[];
  serviceActions: ServiceAction[];
}

const currencyFormatter = new Intl.NumberFormat("en-ZM", {
  style: "currency",
  currency: "ZMW",
  maximumFractionDigits: 0,
});

export function CustomerTableView({
  venue,
  table,
  menuCategories,
  specials,
  serviceActions,
}: CustomerTableViewProps) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(240,236,229,0.9),rgba(249,247,242,1))]">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 pb-10 pt-4 sm:max-w-lg sm:px-5">
        <header className="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-lg shadow-black/5 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <BrandMark compact />
            <Badge className="rounded-full bg-primary px-3 py-1 text-primary-foreground">
              {table.label}
            </Badge>
          </div>

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                Mobile guest view
              </p>
              <h1 className="font-heading text-3xl leading-tight text-foreground">
                {venue.name}
              </h1>
              <p className="text-sm leading-7 text-muted-foreground">
                {venue.tagline}
              </p>
            </div>

            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-border/60 bg-secondary/45 p-4">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <MapPinned className="size-4 text-primary" />
                  {venue.location}
                </div>
                <p className="mt-2 text-muted-foreground">{table.zone}</p>
              </div>
              <div className="rounded-[1.5rem] border border-border/60 bg-secondary/45 p-4">
                <div className="flex items-center gap-2 font-medium text-foreground">
                  <UsersRound className="size-4 text-primary" />
                  Seats {table.seats}
                </div>
                <p className="mt-2 text-muted-foreground">{venue.ambienceNote}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 space-y-5 pt-5">
          <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-[linear-gradient(145deg,rgba(26,42,50,0.98),rgba(73,94,95,0.92),rgba(182,143,93,0.72))] p-5 text-primary-foreground shadow-xl shadow-black/10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/72">
                  <Sparkles className="size-4" />
                  Specials Today
                </p>
                <h2 className="font-heading text-3xl">Bright picks for the patio</h2>
                <p className="max-w-md text-sm leading-7 text-primary-foreground/76">
                  Built to stay readable outdoors with generous spacing, large
                  tap targets, and strong contrast.
                </p>
              </div>
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/10">
                <SunMedium className="size-5" />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {specials.length ? (
                specials.map((special) => (
                  <div
                    key={special.id}
                    className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{special.name}</h3>
                        <p className="text-sm leading-7 text-primary-foreground/74">
                          {special.description}
                        </p>
                        <p className="text-xs font-medium uppercase tracking-[0.24em] text-primary-foreground/62">
                          {special.highlight ?? "Featured today"}
                        </p>
                      </div>
                      <Badge className="bg-white/90 text-primary shadow-none">
                        {currencyFormatter.format(special.price)}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-white/12 bg-white/10 p-4 backdrop-blur">
                  <p className="text-sm leading-7 text-primary-foreground/74">
                    No specials have been published yet. The full menu is still
                    available below.
                  </p>
                </div>
              )}
            </div>
          </section>

          <ServiceActionPanel
            venueSlug={venue.slug}
            tableNumber={table.tableNumber}
            actions={serviceActions}
            tableLabel={table.label}
          />

          <section className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                Menu
              </p>
              <h2 className="font-heading text-3xl text-foreground">
                Browse by category
              </h2>
              <p className="text-sm leading-7 text-muted-foreground">
                Premium, easy-scanning cards that keep prices, highlights, and
                descriptions clear in daylight.
              </p>
            </div>

            <div className="grid gap-4">
              {menuCategories.map((category) => (
                <Card
                  key={category.id}
                  className="rounded-[2rem] border-white/70 bg-white/85 shadow-lg shadow-black/5 backdrop-blur"
                >
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-2">
                        <CardTitle className="font-heading text-2xl">
                          {category.name}
                        </CardTitle>
                        <CardDescription className="text-sm leading-7">
                          {category.description ?? "Browse this section of the menu."}
                        </CardDescription>
                      </div>
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Trees className="size-5" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={item.id} className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1">
                                <h3 className="text-base font-semibold text-foreground">
                                  {item.name}
                                </h3>
                                {item.highlight ? (
                                  <Badge
                                    variant="outline"
                                    className="border-primary/15 bg-primary/5 px-2.5"
                                  >
                                    {item.highlight}
                                  </Badge>
                                ) : null}
                              </div>
                              <p className="shrink-0 font-medium text-foreground">
                                {currencyFormatter.format(item.price)}
                              </p>
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {item.description}
                            </p>
                            {item.tags?.length ? (
                              <div className="flex flex-wrap gap-2">
                                {item.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="border-border/70 bg-secondary/55"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        {index < category.items.length - 1 ? <Separator /> : null}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <footer className="pt-5">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-between rounded-full border border-border/70 bg-white/70 px-4 shadow-sm shadow-black/5"
          >
            <Link href="/">Back to product overview</Link>
          </Button>
        </footer>
      </div>
    </div>
  );
}
