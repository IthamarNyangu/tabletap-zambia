import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FileImage,
  FileText,
  LayoutGrid,
  PencilLine,
  QrCode,
} from "lucide-react";

import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminToolsNav } from "@/components/admin/admin-tools-nav";
import { AdminVenueTitleVisual } from "@/components/admin/admin-venue-title-visual";
import {
  toggleTableActiveAction,
  upsertTableAction,
} from "@/lib/actions/admin";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Input } from "@/components/ui/input";
import type { TableStatus, Venue, VenueTable } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdminTablesManagementViewProps {
  venue: Venue;
  tables: VenueTable[];
  currentPage: number;
  editingTableId?: string | null;
  notice?: string | null;
  error?: string | null;
}

const tableStatusClassMap: Record<TableStatus, string> = {
  ready:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200",
  occupied:
    "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200",
  reserved:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200",
};

const selectClassName =
  "h-11 w-full rounded-[1rem] border border-border/70 bg-background/85 px-3 text-sm text-foreground shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";
const fieldLabelClassName =
  "mb-3 inline-flex px-1 text-sm font-medium text-foreground";

function buildTablesHref(input?: { page?: number; editTableId?: string | null }) {
  const searchParams = new URLSearchParams();

  if (input?.page && input.page > 1) {
    searchParams.set("page", String(input.page));
  }

  if (input?.editTableId) {
    searchParams.set("editTable", input.editTableId);
  }

  const query = searchParams.toString();

  return `/admin/tables${query ? `?${query}` : ""}`;
}

export function AdminTablesManagementView({
  venue,
  tables,
  currentPage,
  editingTableId = null,
  notice = null,
  error = null,
}: AdminTablesManagementViewProps) {
  const editingTable =
    tables.find((table) => table.id === editingTableId) ?? null;
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(tables.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStartIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedTables = tables.slice(pageStartIndex, pageStartIndex + pageSize);
  const pageStart = tables.length ? pageStartIndex + 1 : 0;
  const pageEnd = tables.length
    ? Math.min(pageStartIndex + pageSize, tables.length)
    : 0;
  const tablePreviewHref = `/v/${venue.slug}/t/${
    tables.find((table) => table.isActive)?.tableNumber ?? tables[0]?.tableNumber ?? 1
  }`;

  return (
    <DashboardShell
      currentPath="/admin"
      eyebrow="Admin tables"
      title="Manage venue tables"
      description="Add tables, update labels, and deactivate unused spots without cluttering the main overview."
      brandSubtitle={null}
      headerLayout="split"
      titleClassName="w-full"
      tablePreviewHref={tablePreviewHref}
      titleVisual={<AdminVenueTitleVisual venue={venue} />}
    >
      <div className="space-y-5">
        <AdminToolsNav active="tables" />

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
                  <LayoutGrid className="size-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Table form
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    {editingTable ? `Edit ${editingTable.label}` : "Add a table"}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form
                action={upsertTableAction}
                className="space-y-5 rounded-[1.6rem] border border-border/60 bg-background/88 p-4"
              >
                <input type="hidden" name="redirectPath" value="/admin/tables" />
                <input type="hidden" name="page" value={safeCurrentPage} />
                <input type="hidden" name="tableId" value={editingTable?.id ?? ""} />

                {editingTable ? (
                  <div className="flex justify-end">
                    <Button asChild variant="outline" className="rounded-full">
                      <Link href={buildTablesHref({ page: safeCurrentPage })}>
                        Cancel edit
                      </Link>
                    </Button>
                  </div>
                ) : null}

                <div className="grid gap-x-4 gap-y-4 pt-1 sm:grid-cols-2">
                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
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

                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Label
                    </span>
                    <Input
                      type="text"
                      name="label"
                      placeholder="Table 16"
                      defaultValue={editingTable?.label ?? ""}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Zone
                    </span>
                    <Input
                      type="text"
                      name="zone"
                      placeholder="Garden Deck"
                      required
                      defaultValue={editingTable?.zone ?? ""}
                      className="h-11 rounded-[1rem] border-border/70 bg-background/85"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Seats
                    </span>
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

                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Status
                    </span>
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

                  <label className="flex flex-col">
                    <span className={fieldLabelClassName}>
                      Visibility
                    </span>
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

                <div className="pt-2">
                  <FormSubmitButton
                    label={editingTable ? "Save table" : "Create table"}
                    pendingLabel={editingTable ? "Saving table..." : "Creating table..."}
                    size="lg"
                    className="h-11 rounded-[1rem] px-5"
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
            <CardHeader className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                    Tables list
                  </p>
                  <CardTitle className="font-heading text-3xl">
                    {tables.length} tables in this venue
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Showing {pageStart}-{pageEnd} of {tables.length} tables.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="rounded-full border-border bg-background/80 px-3 py-1"
                >
                  Page {safeCurrentPage} of {totalPages}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {paginatedTables.map((table) => (
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
                        <span>{table.qrCodeValue}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:items-end">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button asChild variant="outline" size="sm" className="rounded-full">
                          <Link
                            href={buildTablesHref({
                              page: safeCurrentPage,
                              editTableId: table.id,
                            })}
                          >
                            <PencilLine className="size-4" />
                            Edit
                          </Link>
                        </Button>

                        <form action={toggleTableActiveAction}>
                          <input type="hidden" name="redirectPath" value="/admin/tables" />
                          <input type="hidden" name="page" value={safeCurrentPage} />
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

                      <div className="flex flex-col gap-2 sm:items-end">
                        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.24em] text-primary/75">
                          <QrCode className="size-3.5" />
                          Download QR
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Button asChild variant="outline" size="sm" className="rounded-full">
                            <a href={`/admin/tables/${table.id}/qr/png`}>
                              <FileImage className="size-4" />
                              PNG
                            </a>
                          </Button>
                          <Button asChild variant="outline" size="sm" className="rounded-full">
                            <a href={`/admin/tables/${table.id}/qr/pdf`}>
                              <FileText className="size-4" />
                              PDF
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {totalPages > 1 ? (
                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  {safeCurrentPage > 1 ? (
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={buildTablesHref({ page: safeCurrentPage - 1 })}>
                        <ChevronLeft className="size-4" />
                        Previous
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="rounded-full" disabled>
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                  )}

                  {safeCurrentPage < totalPages ? (
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={buildTablesHref({ page: safeCurrentPage + 1 })}>
                        Next
                        <ChevronRight className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" className="rounded-full" disabled>
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  )}
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
