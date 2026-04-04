import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  QrCode,
  UtensilsCrossed,
} from "lucide-react";

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
import type {
  MenuCategory,
  MenuItem,
  ServiceAction,
  ServiceActionType,
  Venue,
  VenueTable,
} from "@/lib/types";
import type { CustomerView } from "@/lib/validations/service-request";

interface CustomerFeedback {
  tone: "success" | "error";
  title: string;
  message: string;
  actionType?: ServiceActionType | null;
  dismissHref: string;
}

interface CustomerTableViewProps {
  venue: Venue;
  table: VenueTable;
  menuCategories: MenuCategory[];
  specials: MenuItem[];
  serviceActions: ServiceAction[];
  view: CustomerView;
  feedback?: CustomerFeedback | null;
  sentActionType?: ServiceActionType | null;
}

const currencyFormatter = new Intl.NumberFormat("en-ZM", {
  style: "currency",
  currency: "ZMW",
  maximumFractionDigits: 0,
});

const homeActionTypes: ServiceActionType[] = [
  "call_waiter",
  "request_bill",
  "need_assistance",
];

const menuActionTypes: ServiceActionType[] = [
  "call_waiter",
  "ready_to_order",
];

function buildCustomerHref(input: {
  venueSlug: string;
  tableNumber: number;
  view?: CustomerView;
}) {
  const searchParams = new URLSearchParams();

  if (input.view === "menu") {
    searchParams.set("view", "menu");
  }

  const query = searchParams.toString();

  return `/v/${input.venueSlug}/t/${input.tableNumber}${query ? `?${query}` : ""}`;
}

function FeedbackDialog({ feedback }: { feedback: CustomerFeedback }) {
  const isSuccess = feedback.tone === "success";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[rgba(20,28,36,0.34)] px-5">
      <Card
        className={
          isSuccess
            ? "w-full max-w-sm rounded-[1.8rem] border-white/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.2)]"
            : "w-full max-w-sm rounded-[1.8rem] border-white/80 bg-white shadow-[0_28px_70px_rgba(15,23,42,0.2)]"
        }
      >
        <CardHeader className="space-y-4 px-5 py-5 text-center">
          <div
            className={
              isSuccess
                ? "mx-auto flex size-14 items-center justify-center rounded-[1.25rem] bg-emerald-50 text-emerald-700"
                : "mx-auto flex size-14 items-center justify-center rounded-[1.25rem] bg-destructive/10 text-destructive"
            }
          >
            {isSuccess ? (
              <CheckCircle2 className="size-6" />
            ) : (
              <CircleAlert className="size-6" />
            )}
          </div>
          <div className="space-y-1.5">
            <p
              className={
                isSuccess
                  ? "text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-700/80"
                  : "text-[11px] font-semibold uppercase tracking-[0.3em] text-destructive/80"
              }
            >
              {isSuccess ? "Request sent" : "Something went wrong"}
            </p>
            <CardTitle className="text-[1.7rem] leading-tight">
              {feedback.title}
            </CardTitle>
            <CardDescription className="text-sm leading-6 text-muted-foreground">
              {feedback.message}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <Button
            asChild
            size="lg"
            className={
              isSuccess
                ? "h-12 w-full rounded-[1.2rem] bg-emerald-700 text-base font-semibold text-white shadow-lg shadow-emerald-900/15 hover:bg-emerald-800 active:scale-[0.985]"
                : "h-12 w-full rounded-[1.2rem] text-base font-semibold"
            }
            variant={isSuccess ? "default" : "destructive"}
          >
            <Link href={feedback.dismissHref}>Okay</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export function CustomerTableView({
  venue,
  table,
  menuCategories,
  specials,
  serviceActions,
  view,
  feedback = null,
  sentActionType = null,
}: CustomerTableViewProps) {
  const homeActions = homeActionTypes
    .map((type) => serviceActions.find((action) => action.type === type))
    .filter((action): action is ServiceAction => Boolean(action));
  const menuQuickActions = menuActionTypes
    .map((type) => serviceActions.find((action) => action.type === type))
    .filter((action): action is ServiceAction => Boolean(action));
  const featuredSpecials = specials.slice(0, 2);
  const menuItemCount = menuCategories.reduce(
    (count, category) => count + category.items.length,
    0
  );

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(117,91,61,0.08),transparent_0),linear-gradient(180deg,#f3eee6_0%,#f8f5f0_36%,#fbfaf7_100%)]">
      {feedback ? <FeedbackDialog feedback={feedback} /> : null}

      <div className="mx-auto flex min-h-screen max-w-sm flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+0.875rem)] pt-3 sm:max-w-md sm:px-5">
        <header className="rounded-[1.5rem] border border-white/80 bg-white/94 px-4 py-3 shadow-lg shadow-black/5 backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-2xl border border-white/60 bg-white/85 shadow-sm shadow-black/5">
                <QrCode className="size-4 text-primary" />
              </span>
              <p className="min-w-0 truncate text-[11px] font-semibold uppercase tracking-[0.32em] text-primary/75">
                TableTap Zambia
              </p>
            </div>
            <Badge className="shrink-0 rounded-full bg-primary px-3 py-1 text-primary-foreground">
              {table.label}
            </Badge>
          </div>
        </header>

        {view === "home" ? (
          <main className="flex flex-1 flex-col gap-4 pt-4">
            <section className="overflow-hidden rounded-[1.8rem] border border-primary/10 bg-[linear-gradient(150deg,rgba(19,40,46,0.98),rgba(27,49,58,0.95),rgba(139,87,48,0.78))] px-4 py-4 text-primary-foreground shadow-xl shadow-black/10">
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary-foreground/72">
                  Welcome
                </p>
                <h1 className="font-heading text-[2.15rem] leading-none sm:text-5xl">
                  {venue.name}
                </h1>
                <p className="max-w-sm text-sm leading-6 text-primary-foreground/80">
                  Tap below to open the menu or request service for Table{" "}
                  {table.tableNumber}.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <div className="space-y-1.5 text-center">
                <h2 className="font-heading text-[2rem] leading-tight text-foreground">
                  Choose the next step
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Open the menu or send a quick request from your table.
                </p>
              </div>

              <Button
                asChild
                size="lg"
                className="h-auto w-full min-h-[5rem] items-start justify-between whitespace-normal break-words rounded-[1.55rem] bg-[#264f5d] px-4 py-4 text-left shadow-lg shadow-black/10 hover:bg-[#2b5867] active:scale-[0.985] active:bg-[#204652]"
              >
                <Link
                  href={buildCustomerHref({
                    venueSlug: venue.slug,
                    tableNumber: table.tableNumber,
                    view: "menu",
                  })}
                >
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-base font-semibold">Check Menu</span>
                    <span className="text-sm leading-6 text-primary-foreground/80">
                      Browse {menuCategories.length} categories and {menuItemCount}{" "}
                      menu items for your table.
                    </span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-primary-foreground/72">
                      Open menu view
                    </span>
                  </span>
                  <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/12">
                    <ArrowRight className="size-4" />
                  </span>
                </Link>
              </Button>

              <ServiceActionPanel
                venueSlug={venue.slug}
                tableNumber={table.tableNumber}
                actions={homeActions}
                view={view}
                sentActionType={sentActionType}
              />
            </section>

            {featuredSpecials.length ? (
              <section className="rounded-[1.5rem] border border-amber-200/80 bg-amber-50/95 px-4 py-3.5 shadow-sm shadow-amber-900/5">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                    <UtensilsCrossed className="size-4" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
                      Specials today
                    </p>
                    <h2 className="text-base font-semibold leading-6 text-amber-950">
                      {featuredSpecials[0]?.name}
                      {featuredSpecials[1]
                        ? ` and ${featuredSpecials[1].name}`
                        : ""}
                    </h2>
                    <p className="text-sm leading-6 text-amber-900/80">
                      Open the menu to see today&apos;s highlights before you call
                      someone over.
                    </p>
                  </div>
                </div>
              </section>
            ) : null}

            <footer className="mt-auto pt-1">
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start rounded-full border border-border/70 bg-white/75 px-4 py-3 text-sm shadow-sm shadow-black/5"
              >
                <Link href="/">Back to product overview</Link>
              </Button>
            </footer>
          </main>
        ) : (
          <main className="flex flex-1 flex-col pt-4">
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full bg-white/92 px-4 active:scale-[0.985]"
                >
                  <Link
                    href={buildCustomerHref({
                      venueSlug: venue.slug,
                      tableNumber: table.tableNumber,
                      view: "home",
                    })}
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Link>
                </Button>
                <Badge className="rounded-full border border-border/70 bg-white/92 px-3 py-1 text-foreground shadow-sm">
                  Table {table.tableNumber}
                </Badge>
              </div>

              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/80">
                  Menu view
                </p>
                <h1 className="font-heading text-3xl leading-tight text-foreground">
                  {venue.name}
                </h1>
                <p className="text-sm leading-6 text-muted-foreground">
                  Browse clearly by category, then use the quick actions below
                  when your table is ready for the next step.
                </p>
              </div>

              {featuredSpecials.length ? (
                <div className="rounded-[1.35rem] border border-primary/10 bg-primary/5 px-4 py-3 text-sm leading-6 text-muted-foreground">
                  Today&apos;s specials are included below in the menu.
                </div>
              ) : null}
            </section>

            <section className="space-y-3 pb-28 pt-4">
              {menuCategories.map((category) => (
                <Card
                  key={category.id}
                  className="rounded-[1.75rem] border-white/80 bg-white/92 shadow-lg shadow-black/5"
                >
                  <CardHeader className="space-y-1.5 px-4 py-4">
                    <CardTitle className="font-heading text-[1.6rem]">
                      {category.name}
                    </CardTitle>
                    <CardDescription className="text-sm leading-6">
                      {category.description ?? "Explore this section of the menu."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 px-4 pb-4">
                    {category.items.map((item, index) => (
                      <div key={item.id} className="space-y-3">
                        <div className="space-y-2.5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0 space-y-1">
                              <h3 className="text-[0.98rem] font-semibold text-foreground">
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
                            <p className="shrink-0 text-sm font-semibold text-foreground">
                              {currencyFormatter.format(item.price)}
                            </p>
                          </div>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                          {item.tags.length ? (
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
                        {index < category.items.length - 1 ? <Separator /> : null}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </section>

            <div className="sticky bottom-0 mt-auto space-y-3 rounded-[1.75rem] border border-white/80 bg-white/94 p-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] backdrop-blur">
              <div className="space-y-1 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                  Quick service
                </p>
                <p className="text-sm leading-6 text-muted-foreground">
                  Call someone over or let staff know you&apos;re ready to order.
                </p>
              </div>

              <ServiceActionPanel
                venueSlug={venue.slug}
                tableNumber={table.tableNumber}
                actions={menuQuickActions}
                layout="dock"
                view={view}
                sentActionType={sentActionType}
              />
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
