import {
  ConciergeBell,
  LayoutGrid,
  ReceiptText,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";

import { AdminToolsNav } from "@/components/admin/admin-tools-nav";
import { AdminVenueTitleVisual } from "@/components/admin/admin-venue-title-visual";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const actionAccentMap: Record<ServiceActionType, string> = {
  call_waiter: "bg-secondary text-primary",
  ready_to_order: "bg-amber-50 text-amber-700",
  request_bill: "bg-secondary text-primary",
  need_assistance: "bg-secondary text-primary",
};

const actionIconMap = {
  call_waiter: ConciergeBell,
  ready_to_order: UtensilsCrossed,
  request_bill: ReceiptText,
  need_assistance: ShieldCheck,
} as const;

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
  const tablePreview = tables.slice(0, 8);
  const tablePreviewHref = `/v/${venue.slug}/t/${
    tables.find((table) => table.isActive)?.tableNumber ??
    tables[0]?.tableNumber ??
    1
  }`;

  return (
    <DashboardShell
      currentPath="/admin"
      eyebrow=""
      title="Venue overview"
      brandSubtitle={null}
      headerLayout="split"
      titleClassName="w-full"
      tablePreviewHref={tablePreviewHref}
      titleVisual={<AdminVenueTitleVisual venue={venue} />}
    >
      <div className="space-y-5">
        <Card className="rounded-[1.7rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
          <CardContent className="p-3 sm:p-4">
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
              <Card className="rounded-[1.25rem] border-border/60 bg-background/90 shadow-sm">
                <CardHeader className="space-y-1 px-2 py-3 text-center sm:px-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/80 sm:text-xs sm:tracking-[0.28em]">
                    Tables
                  </p>
                  <CardTitle className="font-heading text-xl sm:text-[1.9rem]">
                    {tables.length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="rounded-[1.25rem] border-border/60 bg-background/90 shadow-sm">
                <CardHeader className="space-y-1 px-2 py-3 text-center sm:px-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/80 sm:text-xs sm:tracking-[0.28em]">
                    Active
                  </p>
                  <CardTitle className="font-heading text-xl sm:text-[1.9rem]">
                    {activeRequestCount}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="rounded-[1.25rem] border-border/60 bg-background/90 shadow-sm">
                <CardHeader className="space-y-1 px-2 py-3 text-center sm:px-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/80 sm:text-xs sm:tracking-[0.28em]">
                    Menu items
                  </p>
                  <CardTitle className="font-heading text-xl sm:text-[1.9rem]">
                    {totalMenuItems}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="rounded-[1.25rem] border-border/60 bg-background/90 shadow-sm">
                <CardHeader className="space-y-1 px-2 py-3 text-center sm:px-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary/80 sm:text-xs sm:tracking-[0.28em]">
                    Requests
                  </p>
                  <CardTitle className="font-heading text-xl sm:text-[1.9rem]">
                    {requestCount}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </CardContent>
        </Card>

        <AdminToolsNav active="overview" />

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <LayoutGrid className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Table preview
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    Current floor setup
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {tablePreview.map((table) => (
                <div
                  key={table.id}
                  className="rounded-[1.4rem] border border-border/60 bg-background/92 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-semibold text-foreground">
                          {table.label}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-full px-3 py-1",
                            tableStatusClassMap[table.status]
                          )}
                        >
                          {table.status}
                        </Badge>
                        {!table.isActive ? (
                          <Badge
                            variant="outline"
                            className="rounded-full border-border bg-secondary/55 px-3 py-1 text-muted-foreground"
                          >
                            Inactive
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {table.zone} · {table.seats} seats
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {table.qrCodeValue}
                    </p>
                  </div>
                </div>
              ))}

              {tables.length > tablePreview.length ? (
                <div className="rounded-[1.4rem] border border-dashed border-border bg-secondary/20 px-4 py-3 text-sm text-muted-foreground">
                  {tables.length - tablePreview.length} more tables are
                  available in the tables workspace.
                </div>
              ) : null}
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
                const Icon = actionIconMap[action.type];

                return (
                  <div
                    key={action.type}
                    className="rounded-[1.5rem] border border-border/60 bg-background/90 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                          actionAccentMap[action.type]
                        )}
                      >
                        <Icon className="size-5" />
                      </div>
                      <div className="space-y-2">
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
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                <UtensilsCrossed className="size-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  Menu preview
                </p>
                <CardTitle className="font-heading text-3xl">
                  Current guest-facing menu
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            {menuCategories.map((category) => {
              const previewItems = category.items.slice(0, 3);
              const hiddenCount = category.items.length - previewItems.length;

              return (
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
                    {previewItems.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[1.25rem] border border-border/60 bg-secondary/30 p-3"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <p className="font-medium text-foreground">
                              {item.name}
                            </p>
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

                    {hiddenCount > 0 ? (
                      <div className="rounded-[1.25rem] border border-dashed border-border bg-secondary/20 px-4 py-3 text-sm text-muted-foreground">
                        {hiddenCount} more items are available in the menu
                        workspace.
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
