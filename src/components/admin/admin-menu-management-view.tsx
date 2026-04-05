import Link from "next/link";
import { PencilLine, Plus, UtensilsCrossed } from "lucide-react";

import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminToolsNav } from "@/components/admin/admin-tools-nav";
import { AdminVenueTitleVisual } from "@/components/admin/admin-venue-title-visual";
import { upsertMenuItemAction } from "@/lib/actions/admin";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { MenuCategory, Venue } from "@/lib/types";

interface AdminMenuManagementViewProps {
  venue: Venue;
  menuCategories: MenuCategory[];
  editingMenuItemId?: string | null;
  notice?: string | null;
  error?: string | null;
}

const currencyFormatter = new Intl.NumberFormat("en-ZM", {
  style: "currency",
  currency: "ZMW",
  maximumFractionDigits: 0,
});

const selectClassName =
  "h-11 w-full rounded-[1rem] border border-border/70 bg-background/85 px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const fieldLabelClassName =
  "mb-3 inline-flex px-1 text-sm font-medium text-foreground";

function buildMenuHref(editItemId?: string | null) {
  const searchParams = new URLSearchParams();

  if (editItemId) {
    searchParams.set("editItem", editItemId);
  }

  const query = searchParams.toString();

  return `/admin/menu${query ? `?${query}` : ""}`;
}

export function AdminMenuManagementView({
  venue,
  menuCategories,
  editingMenuItemId = null,
  notice = null,
  error = null,
}: AdminMenuManagementViewProps) {
  const editingMenuItem =
    menuCategories
      .flatMap((category) =>
        category.items.map((item) => ({
          item,
          category,
        }))
      )
      .find(({ item }) => item.id === editingMenuItemId) ?? null;
  const tablePreviewHref = `/v/${venue.slug}/t/1`;

  return (
    <DashboardShell
      currentPath="/admin"
      eyebrow="Admin menu"
      title="Manage menu items"
      description="Keep categories read-only for now, while giving admins a clean way to update the guest-facing items inside them."
      brandSubtitle={null}
      headerLayout="split"
      titleClassName="w-full"
      tablePreviewHref={tablePreviewHref}
      titleVisual={<AdminVenueTitleVisual venue={venue} />}
    >
      <div className="space-y-5">
        <AdminToolsNav active="menu" />

        {notice ? (
          <AdminFeedbackBanner tone="success" message={notice} />
        ) : null}

        {error ? (
          <AdminFeedbackBanner tone="error" message={error} />
        ) : null}

        <div className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
          <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5 xl:self-start">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Plus className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Menu form
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    {editingMenuItem
                      ? `Edit ${editingMenuItem.item.name}`
                      : "Add a menu item"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                action={upsertMenuItemAction}
                className="space-y-5 rounded-[1.6rem] border border-border/60 bg-background/88 p-4"
              >
                <input type="hidden" name="redirectPath" value="/admin/menu" />
                <input type="hidden" name="itemId" value={editingMenuItem?.item.id ?? ""} />

                {editingMenuItem ? (
                  <div className="flex justify-end">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href="/admin/menu">Cancel edit</Link>
                    </Button>
                  </div>
                ) : null}

                <label className="flex flex-col">
                  <span className={fieldLabelClassName}>
                    Category
                  </span>
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

                <div className="grid gap-x-4 gap-y-4 pt-1 sm:grid-cols-2">
                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Name
                    </span>
                    <Input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingMenuItem?.item.name ?? ""}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Price
                    </span>
                    <Input
                      type="number"
                      name="price"
                      min={0}
                      step="0.01"
                      required
                      defaultValue={
                        editingMenuItem ? editingMenuItem.item.price.toFixed(2) : ""
                      }
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>
                </div>

                <label className="flex flex-col">
                  <span className={fieldLabelClassName}>
                    Description
                  </span>
                  <Textarea
                    name="description"
                    required
                    defaultValue={editingMenuItem?.item.description ?? ""}
                    className="min-h-24 rounded-[1rem] border-border/70 bg-background/85"
                  />
                </label>

                <div className="grid gap-x-4 gap-y-4 pt-1 sm:grid-cols-2">
                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Highlight
                    </span>
                    <Input
                      type="text"
                      name="highlight"
                      defaultValue={editingMenuItem?.item.highlight ?? ""}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Tags
                    </span>
                    <Input
                      type="text"
                      name="tags"
                      placeholder="Popular, Sharing"
                      defaultValue={editingMenuItem?.item.tags.join(", ")}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>
                </div>

                <label className="flex flex-col">
                  <span className={fieldLabelClassName}>
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

                <div className="pt-3">
                  <FormSubmitButton
                    label={editingMenuItem ? "Save menu item" : "Add menu item"}
                    pendingLabel={
                      editingMenuItem ? "Saving menu item..." : "Adding menu item..."
                    }
                    size="lg"
                    className="h-11 rounded-[1rem] px-5"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <UtensilsCrossed className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Menu library
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    Current venue menu
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {menuCategories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-[1.6rem] border border-border/60 bg-background/90 p-4"
                >
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">
                      {category.name}
                    </h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {category.description ?? "Menu items for this section."}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[1.25rem] border border-border/60 bg-secondary/25 p-3"
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="font-medium text-foreground">{item.name}</h4>
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
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                            <p className="text-sm font-medium text-foreground">
                              {currencyFormatter.format(item.price)}
                            </p>
                            <Button asChild variant="outline" size="sm" className="rounded-full">
                              <Link href={buildMenuHref(item.id)}>
                                <PencilLine className="size-4" />
                                Edit
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
