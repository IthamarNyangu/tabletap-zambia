import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  PencilLine,
  Plus,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import {
  toggleTableActiveAction,
  toggleVenueActionAction,
  upsertMenuItemAction,
  upsertTableAction,
} from "@/lib/actions/admin";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  MenuCategory,
  ServiceAction,
  ServiceActionType,
  TableStatus,
  Venue,
  VenueTable,
} from "@/lib/types";
import { getVenueBranding } from "@/lib/venue-branding";
import { cn } from "@/lib/utils";

interface AdminDashboardViewProps {
  venue: Venue;
  tables: VenueTable[];
  menuCategories: MenuCategory[];
  serviceActions: ServiceAction[];
  requestCount: number;
  activeRequestCount: number;
  notice?: string | null;
  error?: string | null;
  editingTableId?: string | null;
  editingMenuItemId?: string | null;
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

const selectClassName =
  "h-11 w-full rounded-[1rem] border border-border/70 bg-background/85 px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

function buildAdminEditHref(input?: {
  editTableId?: string | null;
  editItemId?: string | null;
}) {
  const searchParams = new URLSearchParams();

  if (input?.editTableId) {
    searchParams.set("editTable", input.editTableId);
  }

  if (input?.editItemId) {
    searchParams.set("editItem", input.editItemId);
  }

  const query = searchParams.toString();

  return `/admin${query ? `?${query}` : ""}`;
}

export function AdminDashboardView({
  venue,
  tables,
  menuCategories,
  serviceActions,
  requestCount,
  activeRequestCount,
  notice = null,
  error = null,
  editingTableId = null,
  editingMenuItemId = null,
}: AdminDashboardViewProps) {
  const totalMenuItems = menuCategories.reduce(
    (count, category) => count + category.items.length,
    0
  );
  const enabledActions = serviceActions.filter((action) => action.enabled);
  const branding = getVenueBranding(venue.slug);
  const editingTable =
    tables.find((table) => table.id === editingTableId) ?? null;
  const menuItems = menuCategories.flatMap((category) =>
    category.items.map((item) => ({
      item,
      category: {
        id: category.id,
        name: category.name,
      },
    }))
  );
  const editingMenuItem =
    menuItems.find(({ item }) => item.id === editingMenuItemId) ?? null;
  const tablePreviewHref = `/v/${venue.slug}/t/${
    tables.find((table) => table.isActive)?.tableNumber ??
    tables[0]?.tableNumber ??
    1
  }`;

  return (
    <DashboardShell
      currentPath="/admin"
      eyebrow=""
      title="Venue overview, table preview, and menu structure at a glance"
      brandSubtitle={null}
      headerLayout="split"
      titleClassName="w-full"
      tablePreviewHref={tablePreviewHref}
      titleVisual={
        branding.logoSrc ? (
          <div className="relative h-20 w-full max-w-[20rem] sm:h-24 sm:max-w-[28rem]">
            <Image
              src={branding.logoSrc}
              alt={branding.logoAlt ?? `${venue.name} logo`}
              fill
              preload
              sizes="(max-width: 640px) 78vw, 28rem"
              className="object-contain object-center"
            />
          </div>
        ) : (
          <span className="font-heading text-[1.7rem] leading-tight text-foreground sm:text-[2rem]">
            {venue.name}
          </span>
        )
      }
    >
      <div className="space-y-5">
        {notice ? (
          <div className="rounded-[1.35rem] border border-emerald-200 bg-emerald-50/90 px-4 py-3 text-sm text-emerald-900">
            {notice}
          </div>
        ) : null}

        {error ? (
          <div className="rounded-[1.35rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-muted-foreground">
            {error}
          </div>
        ) : null}

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

        <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <LayoutGrid className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Table setup
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    Create, edit, or deactivate tables
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <form
                action={upsertTableAction}
                className="space-y-4 rounded-[1.6rem] border border-border/60 bg-background/88 p-4"
              >
                <input type="hidden" name="tableId" value={editingTable?.id ?? ""} />

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {editingTable ? `Editing ${editingTable.label}` : "Add a new table"}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Keep labels simple so staff can spot them quickly during service.
                    </p>
                  </div>

                  {editingTable ? (
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/admin">Cancel edit</Link>
                    </Button>
                  ) : null}
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      Table number
                    </span>
                    <Input
                      type="number"
                      name="tableNumber"
                      min={1}
                      max={9999}
                      required
                      defaultValue={editingTable?.tableNumber ?? ""}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Label</span>
                    <Input
                      type="text"
                      name="label"
                      placeholder="Table 16"
                      defaultValue={editingTable?.label ?? ""}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Zone</span>
                    <Input
                      type="text"
                      name="zone"
                      placeholder="Garden Deck"
                      required
                      defaultValue={editingTable?.zone ?? ""}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Seats</span>
                    <Input
                      type="number"
                      name="seats"
                      min={1}
                      max={24}
                      required
                      defaultValue={editingTable?.seats ?? ""}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Status</span>
                    <select
                      name="status"
                      defaultValue={editingTable?.status ?? "ready"}
                      className={selectClassName}
                    >
                      <option value="ready">Ready</option>
                      <option value="occupied">Occupied</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </label>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Visibility</span>
                    <select
                      name="isActive"
                      defaultValue={editingTable ? String(editingTable.isActive) : "true"}
                      className={selectClassName}
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </label>
                </div>

                <FormSubmitButton
                  label={editingTable ? "Save table" : "Create table"}
                  pendingLabel={editingTable ? "Saving table..." : "Creating table..."}
                  size="lg"
                  className="h-11 rounded-[1rem]"
                />
              </form>

              <div className="space-y-3">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className={cn(
                      "rounded-[1.5rem] border border-border/60 bg-background/92 p-4 shadow-sm shadow-black/5",
                      !table.isActive && "bg-secondary/45"
                    )}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground">
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
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-full px-3 py-1",
                              table.isActive
                                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                                : "border-border bg-secondary/55 text-muted-foreground"
                            )}
                          >
                            {table.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span>{table.zone}</span>
                          <span>{table.seats} seats</span>
                          <span>QR: {table.qrCodeValue}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                          <Link href={buildAdminEditHref({ editTableId: table.id })}>
                            <PencilLine className="size-4" />
                            Edit
                          </Link>
                        </Button>

                        <form action={toggleTableActiveAction}>
                          <input type="hidden" name="tableId" value={table.id} />
                          <input
                            type="hidden"
                            name="nextActive"
                            value={String(!table.isActive)}
                          />
                          <FormSubmitButton
                            label={table.isActive ? "Deactivate" : "Activate"}
                            pendingLabel="Saving..."
                            variant={table.isActive ? "outline" : "default"}
                            size="sm"
                            className="rounded-full"
                          />
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-5">
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
                      Guest request settings
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
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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

                        <form action={toggleVenueActionAction}>
                          <input type="hidden" name="actionType" value={action.type} />
                          <input
                            type="hidden"
                            name="enabled"
                            value={String(!action.enabled)}
                          />
                          <FormSubmitButton
                            label={action.enabled ? "Disable" : "Enable"}
                            pendingLabel="Saving..."
                            variant={action.enabled ? "outline" : "default"}
                            size="sm"
                            className="rounded-full"
                          />
                        </form>
                      </div>
                    </div>
                  );
                })}

                <div className="rounded-[1.5rem] border border-border/60 bg-secondary/35 p-4">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {enabledActions.length} of {serviceActions.length} guest
                    actions are live right now.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
              <CardHeader className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                    <Plus className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                      Menu items
                    </p>
                    <CardTitle className="font-heading text-3xl">
                      Add or update what guests can see
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form
                  action={upsertMenuItemAction}
                  className="space-y-4 rounded-[1.6rem] border border-border/60 bg-background/88 p-4"
                >
                  <input type="hidden" name="itemId" value={editingMenuItem?.item.id ?? ""} />

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {editingMenuItem
                          ? `Editing ${editingMenuItem.item.name}`
                          : "Add a menu item"}
                      </h3>
                      <p className="text-sm leading-6 text-muted-foreground">
                        Categories stay read-only for now so the Phase 3 scope stays light.
                      </p>
                    </div>

                    {editingMenuItem ? (
                      <Button asChild variant="outline" className="rounded-full">
                        <Link href="/admin">Cancel edit</Link>
                      </Button>
                    ) : null}
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">Category</span>
                    <select
                      name="categoryId"
                      defaultValue={
                        editingMenuItem?.category.id ?? menuCategories[0]?.id ?? ""
                      }
                      className={selectClassName}
                    >
                      {menuCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-foreground">Name</span>
                      <Input
                        type="text"
                        name="name"
                        required
                        placeholder="Signature Beef Burger"
                        defaultValue={editingMenuItem?.item.name ?? ""}
                        className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-foreground">Price</span>
                      <Input
                        type="number"
                        name="price"
                        min={0}
                        step="0.01"
                        required
                        placeholder="145"
                        defaultValue={
                          editingMenuItem ? editingMenuItem.item.price.toFixed(2) : ""
                        }
                        className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      Description
                    </span>
                    <Textarea
                      name="description"
                      required
                      placeholder="Flame-grilled beef patty, cheddar, onions, and fries."
                      defaultValue={editingMenuItem?.item.description ?? ""}
                      className="min-h-24 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-foreground">
                        Highlight
                      </span>
                      <Input
                        type="text"
                        name="highlight"
                        placeholder="Best seller"
                        defaultValue={editingMenuItem?.item.highlight ?? ""}
                        className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="text-sm font-medium text-foreground">Tags</span>
                      <Input
                        type="text"
                        name="tags"
                        placeholder="Popular, Sharing"
                        defaultValue={editingMenuItem?.item.tags.join(", ")}
                        className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                      />
                    </label>
                  </div>

                  <label className="space-y-2">
                    <span className="text-sm font-medium text-foreground">
                      Availability
                    </span>
                    <select
                      name="isAvailable"
                      defaultValue={
                        editingMenuItem ? String(editingMenuItem.item.isAvailable) : "true"
                      }
                      className={selectClassName}
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </label>

                  <FormSubmitButton
                    label={editingMenuItem ? "Save menu item" : "Add menu item"}
                    pendingLabel={
                      editingMenuItem ? "Saving menu item..." : "Adding menu item..."
                    }
                    size="lg"
                    className="h-11 rounded-[1rem]"
                  />
                </form>
              </CardContent>
            </Card>
          </div>
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
                  {category.items.length ? (
                    category.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[1.25rem] border border-border/60 bg-secondary/30 p-3"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium text-foreground">{item.name}</p>
                                {!item.isAvailable ? (
                                  <Badge
                                    variant="outline"
                                    className="border-border bg-background/80 text-muted-foreground"
                                  >
                                    Hidden
                                  </Badge>
                                ) : null}
                                {item.highlight ? (
                                  <Badge
                                    variant="outline"
                                    className="border-primary/15 bg-primary/5"
                                  >
                                    {item.highlight}
                                  </Badge>
                                ) : null}
                              </div>
                              <p className="text-sm leading-6 text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                            <p className="shrink-0 text-sm font-medium text-foreground">
                              {currencyFormatter.format(item.price)}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap gap-2">
                              {item.tags.map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="border-border/70 bg-background/80"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <Button asChild variant="outline" size="sm" className="rounded-full">
                              <Link href={buildAdminEditHref({ editItemId: item.id })}>
                                <PencilLine className="size-4" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-[1.25rem] border border-dashed border-border bg-secondary/20 px-4 py-6 text-sm text-muted-foreground">
                      No items in this category yet.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
