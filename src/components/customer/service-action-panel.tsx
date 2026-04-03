"use client";

import { startTransition, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  ConciergeBell,
  LifeBuoy,
  ReceiptText,
} from "lucide-react";

import { createServiceRequestAction } from "@/lib/actions/service-requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServiceAction, ServiceActionType } from "@/lib/types";

interface ServiceActionPanelProps {
  venueSlug: string;
  tableNumber: number;
  actions: ServiceAction[];
  tableLabel: string;
}

interface ConfirmationState {
  label: string;
  requestedAt: string;
}

const actionIcons: Record<ServiceActionType, LucideIcon> = {
  call_waiter: ConciergeBell,
  request_bill: ReceiptText,
  need_assistance: LifeBuoy,
};

const timeFormatter = new Intl.DateTimeFormat("en-ZM", {
  hour: "2-digit",
  minute: "2-digit",
});

export function ServiceActionPanel({
  venueSlug,
  tableNumber,
  actions,
  tableLabel,
}: ServiceActionPanelProps) {
  const [pendingAction, setPendingAction] = useState<ServiceActionType | null>(
    null
  );
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const availableActions = actions.filter((action) => action.enabled);

  function handleAction(action: ServiceAction) {
    setPendingAction(action.type);
    setErrorMessage(null);

    startTransition(async () => {
      const result = await createServiceRequestAction({
        venueSlug,
        tableNumber,
        requestType: action.type,
      });

      if (result.success) {
        setConfirmation({
          label: action.label,
          requestedAt: timeFormatter.format(new Date()),
        });
      } else {
        setErrorMessage(
          result.error ?? "We could not send that request. Please try again."
        );
      }

      setPendingAction(null);
    });
  }

  return (
    <section aria-labelledby="service-actions" className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">
          Service actions
        </p>
        <h2 id="service-actions" className="font-heading text-3xl text-foreground">
          Need something from your table?
        </h2>
        <p className="text-sm leading-7 text-muted-foreground">
          Send a simple request and keep enjoying the moment. Requests are now
          created server-side and recorded in Supabase.
        </p>
      </div>

      <div className="grid gap-3">
        {availableActions.map((action) => {
          const Icon = actionIcons[action.type];
          const isPending = pendingAction === action.type;

          return (
            <Button
              key={action.type}
              type="button"
              variant={isPending ? "default" : "outline"}
              size="lg"
              onClick={() => handleAction(action)}
              disabled={pendingAction !== null}
              aria-busy={isPending}
              className="h-auto min-h-28 w-full items-start justify-start rounded-[1.75rem] px-5 py-5 text-left shadow-sm shadow-black/5"
            >
              <span className="flex w-full items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background/70 text-primary">
                  <Icon className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-base font-semibold">{action.label}</span>
                  <span className="text-sm leading-6 text-muted-foreground group-data-[variant=default]/button:text-primary-foreground/80">
                    {action.description}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-[0.24em] text-primary/75 group-data-[variant=default]/button:text-primary-foreground/70">
                    {isPending ? "Sending request..." : action.estimatedResponse}
                  </span>
                </span>
              </span>
            </Button>
          );
        })}
      </div>

      <div aria-live="polite">
        {confirmation ? (
          <Card className="rounded-[1.75rem] border border-primary/10 bg-primary/5 shadow-sm shadow-black/5">
            <CardHeader className="gap-3">
              <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <CheckCircle2 className="size-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg">Request sent for {tableLabel}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {confirmation.label} was recorded at {confirmation.requestedAt}.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                Staff will now see this request in the Supabase-backed dashboard.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      {errorMessage ? (
        <Card className="rounded-[1.75rem] border border-destructive/20 bg-destructive/8 shadow-sm shadow-black/5">
          <CardHeader className="gap-2">
            <CardTitle className="text-lg">Request not sent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground">
              {errorMessage}
            </p>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
