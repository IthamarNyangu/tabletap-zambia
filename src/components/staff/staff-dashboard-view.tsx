import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ChevronLeft,
  ChevronRight,
  ConciergeBell,
  LifeBuoy,
  ReceiptText,
  TimerReset,
  UtensilsCrossed,
} from "lucide-react";

import { RequestStatusSubmitButton } from "@/components/staff/request-status-submit-button";
import { submitStaffStatusUpdateFormAction } from "@/lib/actions/service-requests";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/staff/request-status-badge";
import type {
  ServiceActionType,
  ServiceRequest,
  ServiceRequestStatus,
  Venue,
} from "@/lib/types";
import { serviceActionDefinitions } from "@/lib/types";
import type {
  StaffPage,
  StaffRequestFilter,
} from "@/lib/validations/service-request";
import { cn } from "@/lib/utils";

interface StaffDashboardViewProps {
  venue: Venue;
  requests: ServiceRequest[];
  activeFilter: StaffRequestFilter;
  currentPage: StaffPage;
  actionError?: string | null;
}

interface StaffRequestGroup {
  key: string;
  requestIds: string[];
  tableId: string;
  tableNumber: number;
  requestType: ServiceActionType;
  status: ServiceRequestStatus;
  note: string | null;
  latestCreatedAt: string;
  duplicateCount: number;
}

const requestTypeMeta: Record<
  keyof typeof serviceActionDefinitions,
  { icon: LucideIcon; accentClassName: string }
> = {
  call_waiter: {
    icon: ConciergeBell,
    accentClassName: "bg-primary/8 text-primary",
  },
  ready_to_order: {
    icon: UtensilsCrossed,
    accentClassName: "bg-amber-50 text-amber-700",
  },
  request_bill: {
    icon: ReceiptText,
    accentClassName: "bg-primary/8 text-primary",
  },
  need_assistance: {
    icon: LifeBuoy,
    accentClassName: "bg-primary/8 text-primary",
  },
};

const filterOptions: { value: StaffRequestFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "attended", label: "Attended" },
  { value: "closed", label: "Closed" },
];

const timeFormatter = new Intl.DateTimeFormat("en-ZM", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function buildStaffHref(filter: StaffRequestFilter, page = 1) {
  const searchParams = new URLSearchParams();

  if (filter !== "all") {
    searchParams.set("status", filter);
  }

  if (page > 1) {
    searchParams.set("page", String(page));
  }

  const query = searchParams.toString();

  return `/staff${query ? `?${query}` : ""}`;
}

function groupRequests(requests: ServiceRequest[]): StaffRequestGroup[] {
  const sortedRequests = [...requests].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );
  const groupedRequests = new Map<string, StaffRequestGroup>();

  for (const request of sortedRequests) {
    const key = `${request.tableId}:${request.requestType}:${request.status}`;
    const existingGroup = groupedRequests.get(key);

    if (!existingGroup) {
      groupedRequests.set(key, {
        key,
        requestIds: [request.id],
        tableId: request.tableId,
        tableNumber: request.tableNumber,
        requestType: request.requestType,
        status: request.status,
        note: request.note,
        latestCreatedAt: request.createdAt,
        duplicateCount: 1,
      });
      continue;
    }

    existingGroup.requestIds.push(request.id);
    existingGroup.duplicateCount += 1;
  }

  return Array.from(groupedRequests.values()).sort(
    (left, right) =>
      new Date(right.latestCreatedAt).getTime() -
      new Date(left.latestCreatedAt).getTime()
  );
}

export function StaffDashboardView({
  venue,
  requests,
  activeFilter,
  currentPage,
  actionError = null,
}: StaffDashboardViewProps) {
  const groupedRequests = groupRequests(requests);
  const counts = {
    all: groupedRequests.length,
    pending: groupedRequests.filter((request) => request.status === "pending")
      .length,
    attended: groupedRequests.filter((request) => request.status === "attended")
      .length,
    closed: groupedRequests.filter((request) => request.status === "closed").length,
  };

  const filteredRequests =
    activeFilter === "all"
      ? groupedRequests
      : groupedRequests.filter((request) => request.status === activeFilter);

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * pageSize;
  const paginatedRequests = filteredRequests.slice(
    startIndex,
    startIndex + pageSize
  );
  const pageStart = filteredRequests.length ? startIndex + 1 : 0;
  const pageEnd = filteredRequests.length
    ? Math.min(startIndex + pageSize, filteredRequests.length)
    : 0;

  return (
    <DashboardShell
      currentPath="/staff"
      eyebrow="Staff dashboard"
      title="Service requests arranged for fast table response"
      description="Repeated taps from the same table are grouped together so staff can act once, see the latest time, and spot duplicates quickly."
      tablePreviewHref={`/v/${venue.slug}/t/${requests[0]?.tableNumber ?? 1}`}
    >
      <div className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-[1.75rem] border-border/60 bg-white/85 shadow-sm shadow-black/5">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                Pending now
              </p>
              <CardTitle className="font-heading text-3xl">
                {counts.pending}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Grouped request cards still waiting for a staff touch.
            </CardContent>
          </Card>
          <Card className="rounded-[1.75rem] border-border/60 bg-white/85 shadow-sm shadow-black/5">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                In progress
              </p>
              <CardTitle className="font-heading text-3xl">
                {counts.attended}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Requests acknowledged and being handled.
            </CardContent>
          </Card>
          <Card className="rounded-[1.75rem] border-border/60 bg-white/85 shadow-sm shadow-black/5">
            <CardHeader className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                Closed
              </p>
              <CardTitle className="font-heading text-3xl">
                {counts.closed}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-muted-foreground">
              Completed request groups kept visible for shift review.
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                Filter requests
              </p>
              <CardTitle className="font-heading text-3xl">
                Readable at a glance, even during peak service
              </CardTitle>
            </div>

            <div
              role="tablist"
              aria-label="Request status filter"
              className="grid grid-cols-2 gap-2 rounded-[1.5rem] bg-secondary/60 p-2 sm:grid-cols-4"
            >
              {filterOptions.map((filter) => {
                const isActive = filter.value === activeFilter;

                return (
                  <Link
                    key={filter.value}
                    href={buildStaffHref(filter.value)}
                    role="tab"
                    aria-selected={isActive}
                    className={cn(
                      "rounded-[1.1rem] px-4 py-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-background/80 text-muted-foreground hover:bg-background hover:text-foreground"
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span>{filter.label}</span>
                      <span className="rounded-full bg-black/6 px-2 py-0.5 text-xs text-current">
                        {counts[filter.value]}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {filteredRequests.length
                  ? `Showing ${pageStart}-${pageEnd} of ${filteredRequests.length} grouped requests`
                  : "No grouped requests in this filter right now."}
              </p>
              {totalPages > 1 ? (
                <div className="flex items-center gap-2">
                  {safeCurrentPage > 1 ? (
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={buildStaffHref(activeFilter, safeCurrentPage - 1)}>
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
                  <Badge
                    variant="outline"
                    className="rounded-full border-border bg-background/80 px-3 py-1"
                  >
                    Page {safeCurrentPage} of {totalPages}
                  </Badge>
                  {safeCurrentPage < totalPages ? (
                    <Button asChild variant="outline" size="sm" className="rounded-full">
                      <Link href={buildStaffHref(activeFilter, safeCurrentPage + 1)}>
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
            </div>

            {actionError ? (
              <div className="rounded-[1.35rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-muted-foreground">
                {actionError}
              </div>
            ) : null}

            {paginatedRequests.length ? (
              paginatedRequests.map((requestGroup) => {
                const meta = requestTypeMeta[requestGroup.requestType];
                const Icon = meta.icon;
                const nextStatus =
                  requestGroup.status === "pending"
                    ? "attended"
                    : requestGroup.status === "attended"
                      ? "closed"
                      : null;
                const nextActionLabel =
                  nextStatus === "attended"
                    ? "Mark attended"
                    : nextStatus === "closed"
                      ? "Close request"
                      : null;
                const pendingLabel =
                  nextStatus === "attended" ? "Updating..." : "Closing...";
                const noteText =
                  requestGroup.note ??
                  (requestGroup.duplicateCount > 1
                    ? `${requestGroup.duplicateCount} matching taps were combined for this request.`
                    : "No additional note was attached to this request.");

                return (
                  <div
                    key={requestGroup.key}
                    className="rounded-[1.6rem] border border-border/60 bg-background/90 p-4 shadow-sm shadow-black/5"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "flex size-12 shrink-0 items-center justify-center rounded-2xl",
                          meta.accentClassName
                        )}
                      >
                        <Icon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1 space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-semibold text-foreground">
                                Table {requestGroup.tableNumber}
                              </h3>
                              <Badge
                                variant="outline"
                                className="border-primary/15 bg-primary/5 px-2.5"
                              >
                                {serviceActionDefinitions[requestGroup.requestType].label}
                              </Badge>
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {noteText}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                            <div className="flex flex-wrap items-center gap-2">
                              <RequestStatusBadge status={requestGroup.status} />
                              {requestGroup.duplicateCount > 1 ? (
                                <Badge
                                  variant="outline"
                                  className="rounded-full border-primary/15 bg-primary/5 px-3 py-1"
                                >
                                  x{requestGroup.duplicateCount}
                                </Badge>
                              ) : null}
                            </div>
                            <p className="text-sm font-medium text-foreground">
                              {timeFormatter.format(
                                new Date(requestGroup.latestCreatedAt)
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <TimerReset className="size-3.5" />
                              {requestGroup.duplicateCount > 1
                                ? `${requestGroup.duplicateCount} matching taps combined`
                                : "Single request"}
                            </span>
                          </div>

                          {nextStatus && nextActionLabel ? (
                            <form action={submitStaffStatusUpdateFormAction}>
                              {requestGroup.requestIds.map((requestId) => (
                                <input
                                  key={requestId}
                                  type="hidden"
                                  name="requestIds"
                                  value={requestId}
                                />
                              ))}
                              <input type="hidden" name="nextStatus" value={nextStatus} />
                              <input type="hidden" name="filter" value={activeFilter} />
                              <input
                                type="hidden"
                                name="page"
                                value={safeCurrentPage}
                              />
                              <RequestStatusSubmitButton
                                label={nextActionLabel}
                                pendingLabel={pendingLabel}
                              />
                            </form>
                          ) : (
                            <Badge
                              variant="outline"
                              className="rounded-full border-border bg-secondary/45 px-3 py-1 text-muted-foreground"
                            >
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[1.6rem] border border-dashed border-border bg-secondary/30 px-5 py-10 text-center">
                <p className="text-base font-medium text-foreground">
                  No requests in this filter right now.
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Switch filters to review the rest of the current shift activity.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
