"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  ConciergeBell,
  LifeBuoy,
  ReceiptText,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ServiceAction, ServiceActionType } from "@/lib/types";

interface ServiceActionPanelProps {
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
  water_refill: Sparkles,
  manager_visit: ConciergeBell,
};

const timeFormatter = new Intl.DateTimeFormat("en-ZM", {
  hour: "2-digit",
  minute: "2-digit",
});

export function ServiceActionPanel({
  actions,
  tableLabel,
}: ServiceActionPanelProps) {
  const timeoutRef = useRef<number | null>(null);
  const [activeAction, setActiveAction] = useState<ServiceActionType | null>(
    null
  );
  const [confirmation, setConfirmation] = useState<ConfirmationState | null>(
    null
  );

  const availableActions = actions.filter((action) => action.enabled).slice(0, 3);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleAction(action: ServiceAction) {
    setActiveAction(action.type);

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      startTransition(() => {
        setConfirmation({
          label: action.label,
          requestedAt: timeFormatter.format(new Date()),
        });
        setActiveAction(null);
      });
    }, 320);
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
          Send a simple request and keep enjoying the moment. This MVP uses local
          mock feedback only.
        </p>
      </div>

      <div className="grid gap-3">
        {availableActions.map((action) => {
          const Icon = actionIcons[action.type];
          const isActive = activeAction === action.type;

          return (
            <Button
              key={action.type}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="lg"
              onClick={() => handleAction(action)}
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
                    {isActive ? "Sending request..." : action.estimatedResponse}
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
                  {confirmation.label} was recorded locally at {confirmation.requestedAt}.
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-7 text-muted-foreground">
                In the next phase, this will sync directly to the staff dashboard
                and persist beyond the current session.
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
