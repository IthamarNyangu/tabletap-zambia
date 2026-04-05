import {
  ConciergeBell,
  ReceiptText,
  ShieldCheck,
  UtensilsCrossed,
} from "lucide-react";

import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminToolsNav } from "@/components/admin/admin-tools-nav";
import { AdminVenueTitleVisual } from "@/components/admin/admin-venue-title-visual";
import { toggleVenueActionAction } from "@/lib/actions/admin";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import type { ServiceAction, ServiceActionType, Venue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AdminActionsManagementViewProps {
  venue: Venue;
  serviceActions: ServiceAction[];
  notice?: string | null;
  error?: string | null;
}

const actionIconMap = {
  call_waiter: ConciergeBell,
  ready_to_order: UtensilsCrossed,
  request_bill: ReceiptText,
  need_assistance: ShieldCheck,
} as const satisfies Record<ServiceActionType, typeof ConciergeBell>;

const actionAccentMap: Record<ServiceActionType, string> = {
  call_waiter: "bg-secondary text-primary",
  ready_to_order: "bg-amber-50 text-amber-700",
  request_bill: "bg-secondary text-primary",
  need_assistance: "bg-secondary text-primary",
};

export function AdminActionsManagementView({
  venue,
  serviceActions,
  notice = null,
  error = null,
}: AdminActionsManagementViewProps) {
  return (
    <DashboardShell
      currentPath="/admin"
      eyebrow="Admin service actions"
      title="Manage guest request options"
      description="Enable only the guest actions your team can confidently support during the current service setup."
      brandSubtitle={null}
      headerLayout="split"
      titleClassName="w-full"
      tablePreviewHref={`/v/${venue.slug}/t/1`}
      titleVisual={<AdminVenueTitleVisual venue={venue} />}
    >
      <div className="space-y-5">
        <AdminToolsNav active="actions" />

        {notice ? (
          <AdminFeedbackBanner tone="success" message={notice} />
        ) : null}

        {error ? (
          <AdminFeedbackBanner tone="error" message={error} />
        ) : null}

        <Card className="rounded-[2rem] border-border/60 bg-white/88 shadow-lg shadow-black/5">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary text-primary">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
                  Service action controls
                </p>
                <CardTitle className="font-heading text-3xl">
                  Toggle guest-facing requests
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {serviceActions.map((action) => {
              const Icon = actionIconMap[action.type];

              return (
                <div
                  key={action.type}
                  className="rounded-[1.5rem] border border-border/60 bg-background/90 p-4"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                          <h3 className="text-lg font-semibold text-foreground">
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
                      <input type="hidden" name="redirectPath" value="/admin/actions" />
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
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
