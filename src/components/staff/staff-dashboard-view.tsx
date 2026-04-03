"use client";

import { startTransition, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ConciergeBell,
  LifeBuoy,
  ReceiptText,
  TimerReset,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { updateServiceRequestStatusAction } from "@/lib/actions/service-requests";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/staff/request-status-badge";
import type {
  ServiceRequest,
  ServiceRequestStatus,
  ServiceRequestStatusActionResult,
  Venue,
} from "@/lib/types";
import { serviceActionDefinitions } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StaffDashboardViewProps {
  venue: Venue;
  requests: ServiceRequest[];
}

type RequestFilter = "all" | ServiceRequestStatus;

const requestTypeMeta: Record<
  keyof typeof serviceActionDefinitions,
  { icon: LucideIcon; accentClassName: string }
> = {
  call_waiter: {
    icon: ConciergeBell,
    accentClassName: "bg-primary/8 text-primary",
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

const filterOptions: { value: RequestFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "attended", label: "Attended" },
  { value: "closed", label: "Closed" },
];

const timeFormatter = new Intl.DateTimeFormat("en-ZM", {
  hour: "2-digit",
  minute: "2-digit",
});

export function StaffDashboardView({
  venue,
  requests,
}: StaffDashboardViewProps) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<RequestFilter>("all");
  const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const sortedRequests = [...requests].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );

  const counts = {
    all: sortedRequests.length,
    pending: sortedRequests.filter((request) => request.status === "pending").length,
    attended: sortedRequests.filter((request) => request.status === "attended")
      .length,
    closed: sortedRequests.filter((request) => request.status === "closed").length,
  };

  const visibleRequests =
    activeFilter === "all"
      ? sortedRequests
      : sortedRequests.filter((request) => request.status === activeFilter);

  function handleStatusUpdate(
    requestId: string,
    nextStatus: "attended" | "closed"
  ) {
    setPendingRequestId(requestId);
    setActionError(null);

    startTransition(async () => {
      const result: ServiceRequestStatusActionResult =
        await updateServiceRequestStatusAction({
          requestId,
          nextStatus,
        });

      if (!result.success) {
        setActionError(
          result.error ?? "We could not update that request right now."
        );
      } else {
        router.refresh();
      }

      setPendingRequestId(null);
    });
  }

  return (
    <DashboardShell
      currentPath="/staff"
      eyebrow="Staff dashboard"
      title="Service requests arranged for fast table response"
      description="This MVP view keeps things simple: scan the list, filter by status, and understand which table needs attention first."
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
              Requests still waiting for a staff touch.
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
              Completed requests kept visible for a quick shift view.
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
                  <button
                    key={filter.value}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveFilter(filter.value)}
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
                  </button>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {actionError ? (
              <div className="rounded-[1.35rem] border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-muted-foreground">
                {actionError}
              </div>
            ) : null}

            {visibleRequests.length ? (
              visibleRequests.map((request) => {
                const meta = requestTypeMeta[request.requestType];
                const Icon = meta.icon;
                const isPending = pendingRequestId === request.id;
                const nextStatus =
                  request.status === "pending"
                    ? "attended"
                    : request.status === "attended"
                      ? "closed"
                      : null;
                const nextActionLabel =
                  nextStatus === "attended"
                    ? "Mark attended"
                    : nextStatus === "closed"
                      ? "Close request"
                      : null;

                return (
                  <div
                    key={request.id}
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
                                Table {request.tableNumber}
                              </h3>
                              <Badge
                                variant="outline"
                                className="border-primary/15 bg-primary/5 px-2.5"
                              >
                                {serviceActionDefinitions[request.requestType].label}
                              </Badge>
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {request.note ?? "No additional note was attached to this request."}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                            <RequestStatusBadge status={request.status} />
                            <p className="text-sm font-medium text-foreground">
                              {timeFormatter.format(new Date(request.createdAt))}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <TimerReset className="size-3.5" />
                              Request ID {request.id}
                            </span>
                          </div>

                          {nextStatus && nextActionLabel ? (
                            <Button
                              type="button"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(request.id, nextStatus)
                              }
                              disabled={isPending}
                              className="rounded-full"
                            >
                              {isPending ? "Updating..." : nextActionLabel}
                            </Button>
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
