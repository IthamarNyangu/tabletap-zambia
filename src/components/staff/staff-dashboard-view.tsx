"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  ConciergeBell,
  LifeBuoy,
  ReceiptText,
  TimerReset,
  Waves,
} from "lucide-react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestStatusBadge } from "@/components/staff/request-status-badge";
import type {
  ServiceActionType,
  ServiceRequest,
  ServiceRequestStatus,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface StaffDashboardViewProps {
  requests: ServiceRequest[];
}

type RequestFilter = "all" | ServiceRequestStatus;

const requestTypeMeta: Record<
  ServiceActionType,
  { label: string; icon: LucideIcon; accentClassName: string }
> = {
  call_waiter: {
    label: "Call Waiter",
    icon: ConciergeBell,
    accentClassName: "bg-primary/8 text-primary",
  },
  request_bill: {
    label: "Request Bill",
    icon: ReceiptText,
    accentClassName: "bg-primary/8 text-primary",
  },
  need_assistance: {
    label: "Need Assistance",
    icon: LifeBuoy,
    accentClassName: "bg-primary/8 text-primary",
  },
  water_refill: {
    label: "Water Refill",
    icon: Waves,
    accentClassName: "bg-primary/8 text-primary",
  },
  manager_visit: {
    label: "Manager Visit",
    icon: BellRing,
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

export function StaffDashboardView({ requests }: StaffDashboardViewProps) {
  const [activeFilter, setActiveFilter] = useState<RequestFilter>("all");

  const sortedRequests = [...requests].sort(
    (left, right) =>
      new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime()
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

  return (
    <DashboardShell
      currentPath="/staff"
      eyebrow="Staff dashboard"
      title="Service requests arranged for fast table response"
      description="This MVP view keeps things simple: scan the list, filter by status, and understand which table needs attention first."
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
            {visibleRequests.length ? (
              visibleRequests.map((request) => {
                const meta = requestTypeMeta[request.requestType];
                const Icon = meta.icon;

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
                                {meta.label}
                              </Badge>
                            </div>
                            <p className="text-sm leading-7 text-muted-foreground">
                              {request.note ?? "No additional note was attached to this request."}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                            <RequestStatusBadge status={request.status} />
                            <p className="text-sm font-medium text-foreground">
                              {timeFormatter.format(new Date(request.timestamp))}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <TimerReset className="size-3.5" />
                            Request ID {request.id}
                          </span>
                          {request.partySize ? (
                            <span>Party of {request.partySize}</span>
                          ) : null}
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
                  Switch filters to review the rest of the mock shift activity.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
