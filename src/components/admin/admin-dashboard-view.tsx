import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  MapPinned,
  QrCode,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  MenuCategory,
  ServiceAction,
  ServiceActionType,
  TableStatus,
  Venue,
  VenueTable,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdminDashboardViewProps {
  venue: Venue;
  tables: VenueTable[];
  menuCategories: MenuCategory[];
  serviceActions: ServiceAction[];
  requestCount: number;
  activeRequestCount: number;
}

const currencyFormatter = new Intl.NumberFormat("en-ZM", {
  style: "currency",
  currency: "ZMW",
  maximumFractionDigits: 0,
});

const tableStatusClassMap: Record<TableStatus, string> = {
  ready:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200",
  occupied:
    "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200",
  reserved:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200",
};

const actionIcons: Record<ServiceActionType, LucideIcon> = {
  call_waiter: Sparkles,
  ready_to_order: UtensilsCrossed,
  request_bill: ReceiptText,
  need_assistance: ShieldCheck,
};

export function AdminDashboardView({
  venue,
  tables,
  menuCategories,
  serviceActions,
  requestCount,
  activeRequestCount,
}: AdminDashboardViewProps) {
  const totalMenuItems = menuCategories.reduce(
    (count, category) => count + category.items.length,
    0
  );
  const enabledActions = serviceActions.filter((action) => action.enabled);

  return (
    <DashboardShell
      currentPath="/admin"
      eyebrow="Admin dashboard"
      title="Venue overview, table preview, and menu structure at a glance"
      description="This MVP admin screen stays intentionally light: real data, clear read-only visibility, and no extra CRUD complexity yet."
      tablePreviewHref={`/v/${venue.slug}/t/${tables[0]?.tableNumber ?? 1}`}
    >
      <div className="space-y-5">
        <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
          <CardHeader className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  Venue overview
                </p>
                <CardTitle className="font-heading text-3xl">
                  {venue.name}
                </CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-7">
                  {venue.description}
                </CardDescription>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/60 bg-secondary/45 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <MapPinned className="size-4 text-primary" />
                    {venue.location}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {venue.tagline}
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-border/60 bg-secondary/45 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <QrCode className="size-4 text-primary" />
                    Demo table {tables[0]?.tableNumber ?? 1}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {venue.ambienceNote}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
              <Card className="rounded-[1.5rem] border-border/60 bg-background/90 shadow-sm">
                <CardHeader className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                    Tables
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    {tables.length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="rounded-[1.5rem] border-border/60 bg-background/90 shadow-sm">
                <CardHeader className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                    Active requests
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    {activeRequestCount}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="rounded-[1.5rem] border-border/60 bg-background/90 shadow-sm">
                <CardHeader className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                    Menu items
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    {totalMenuItems}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="rounded-[1.5rem] border-border/60 bg-background/90 shadow-sm">
                <CardHeader className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">
                    Total requests
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    {requestCount}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <LayoutGrid className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Table list
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    Current floor setup
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Zone</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>QR label</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.id}>
                      <TableCell className="font-medium text-foreground">
                        {table.label}
                      </TableCell>
                      <TableCell>{table.zone}</TableCell>
                      <TableCell>{table.seats}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("rounded-full px-3 py-1", tableStatusClassMap[table.status])}
                        >
                          {table.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{table.qrCodeValue}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <ShieldCheck className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Service actions
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    Current venue settings
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {serviceActions.map((action) => {
                const Icon = actionIcons[action.type];

                return (
                  <div
                    key={action.type}
                    className="rounded-[1.5rem] border border-border/60 bg-background/90 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                        <Icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-foreground">
                            {action.label}
                          </h3>
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-3 py-1",
                              action.enabled
                                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                                : "border-border bg-secondary/55 text-muted-foreground"
                            )}
                          >
                            {action.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {action.description}
                        </p>
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary/75">
                          {action.estimatedResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="rounded-[1.5rem] border border-border/60 bg-secondary/35 p-4">
                <p className="text-sm leading-7 text-muted-foreground">
                  {enabledActions.length} of {serviceActions.length} service
                  actions are currently enabled for guests.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                <UtensilsCrossed className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  Menu preview
                </p>
                <CardTitle className="font-heading text-3xl">
                  Categories and items backed by Supabase now
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {menuCategories.map((category) => (
              <div
                key={category.id}
                className="rounded-[1.75rem] border border-border/60 bg-background/90 p-5"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {category.name}
                  </h3>
                  <p className="text-sm leading-7 text-muted-foreground">
                    {category.description ?? "Menu items for this section."}
                  </p>
                </div>
                <div className="mt-4 space-y-3">
                  {category.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.25rem] border border-border/60 bg-secondary/30 p-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <p className="font-medium text-foreground">{item.name}</p>
                          <p className="text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-medium text-foreground">
                          {currencyFormatter.format(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
