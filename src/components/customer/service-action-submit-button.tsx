"use client";

import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  ConciergeBell,
  Dot,
  LifeBuoy,
  LoaderCircle,
  ReceiptText,
  UtensilsCrossed,
} from "lucide-react";
import { useFormStatus } from "react-dom";

import { submitCustomerServiceRequestAction } from "@/lib/actions/service-requests";
import { Button } from "@/components/ui/button";
import type { ServiceAction, ServiceActionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { CustomerView } from "@/lib/validations/service-request";

interface ServiceActionSubmitButtonProps {
  venueSlug: string;
  tableNumber: number;
  action: ServiceAction;
  view: CustomerView;
  layout?: "grid" | "dock";
  showSuccess?: boolean;
}

const actionIcons: Record<ServiceActionType, LucideIcon> = {
  call_waiter: ConciergeBell,
  ready_to_order: UtensilsCrossed,
  request_bill: ReceiptText,
  need_assistance: LifeBuoy,
};

function LoadingOverlay({
  action,
  tableNumber,
}: {
  action: ServiceAction;
  tableNumber: number;
}) {
  const Icon = actionIcons[action.type];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(38,79,93,0.2),transparent_35%),linear-gradient(180deg,rgba(249,247,242,0.94),rgba(244,239,230,0.96))] px-5 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-[2rem] border border-white/80 bg-white/92 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
        <div className="space-y-5 text-center">
          <div className="mx-auto flex size-[4.5rem] items-center justify-center rounded-[1.75rem] bg-primary/8 text-primary">
            <div className="relative flex size-16 items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-primary/15" />
              <span className="absolute inset-[5px] rounded-full border-2 border-primary/35 border-t-primary animate-spin" />
              <Icon className="size-6" />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/75">
              TableTap Zambia
            </p>
            <h3 className="font-heading text-[1.9rem] leading-tight text-foreground">
              {action.pendingLabel}
            </h3>
            <p className="text-sm leading-6 text-muted-foreground">
              We&apos;re notifying the team for Table {tableNumber}. This usually
              takes a moment.
            </p>
          </div>

          <div className="inline-flex items-center justify-center gap-1 rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-primary/80">
            <span>Sending</span>
            <Dot className="size-4 animate-pulse" />
            <span>{action.shortLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceActionButtonContents({
  action,
  tableNumber,
  layout,
  showSuccess,
}: {
  action: ServiceAction;
  tableNumber: number;
  layout: "grid" | "dock";
  showSuccess: boolean;
}) {
  const { pending } = useFormStatus();
  const Icon = actionIcons[action.type];

  if (layout === "dock") {
    return (
      <>
        {pending ? (
          <LoadingOverlay action={action} tableNumber={tableNumber} />
        ) : null}

        <Button
          type="submit"
          size="lg"
          variant={showSuccess ? "secondary" : "default"}
          disabled={pending}
          aria-busy={pending}
          className={cn(
            "h-auto min-h-[3.75rem] w-full touch-manipulation whitespace-normal break-words rounded-[1.25rem] px-4 py-3 text-left transition duration-150 ease-out active:scale-[0.985]",
            showSuccess
              ? "border-transparent bg-white text-foreground shadow-[0_16px_32px_rgba(15,23,42,0.1)] hover:bg-white active:bg-white"
              : "shadow-sm shadow-black/10 active:bg-primary/92"
          )}
        >
          <span className="flex w-full items-center gap-3">
            <span
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-2xl",
                showSuccess
                  ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/15"
                  : "bg-white/15 text-current"
              )}
            >
              {pending ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : showSuccess ? (
                <CheckCircle2 className="size-4" />
              ) : (
                <Icon className="size-4" />
              )}
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-sm font-semibold">
                {pending ? action.pendingLabel : action.label}
              </span>
              <span
                className={cn(
                  "text-[11px] leading-5",
                  showSuccess ? "text-muted-foreground" : "text-primary-foreground/72"
                )}
              >
                {pending
                  ? "Please hold while we send that request."
                  : showSuccess
                    ? action.successMessage
                    : action.estimatedResponse}
              </span>
            </span>
            {showSuccess ? (
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-700 shadow-sm shadow-emerald-900/5">
                Sent
              </span>
            ) : null}
          </span>
        </Button>
      </>
    );
  }

  return (
    <>
      {pending ? <LoadingOverlay action={action} tableNumber={tableNumber} /> : null}

      <Button
        type="submit"
        variant={showSuccess ? "secondary" : "outline"}
        size="lg"
        disabled={pending}
        aria-busy={pending}
        className={cn(
          "h-auto min-h-[5rem] w-full touch-manipulation items-start justify-start whitespace-normal break-words rounded-[1.5rem] px-4 py-4 text-left transition duration-150 ease-out active:scale-[0.985]",
          showSuccess
            ? "border-transparent bg-white text-foreground shadow-[0_20px_42px_rgba(15,23,42,0.1)] hover:bg-white active:bg-white"
            : "border-white/80 bg-white/90 shadow-sm shadow-black/5 hover:border-primary/15 hover:bg-white active:border-primary/20 active:bg-primary/4"
        )}
      >
        <span className="flex w-full items-start gap-3.5">
          <span
            className={cn(
              "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl",
              showSuccess
                ? "bg-emerald-600 text-white shadow-sm shadow-emerald-900/15"
                : pending
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary/80 text-primary"
            )}
          >
            {pending ? (
              <LoaderCircle className="size-4 animate-spin" />
            ) : showSuccess ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <Icon className="size-4" />
            )}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="text-[0.95rem] font-semibold">
              {pending ? action.pendingLabel : action.label}
            </span>
            <span className="text-sm leading-6 text-muted-foreground">
              {pending
                ? "Please hold while we send that request."
                : showSuccess
                  ? action.successMessage
                  : action.description}
            </span>
            {showSuccess ? (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700 shadow-sm shadow-emerald-900/5">
                <CheckCircle2 className="size-3.5" />
                Request sent
              </span>
            ) : (
              <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-primary/75">
                {action.estimatedResponse}
              </span>
            )}
          </span>
        </span>
      </Button>
    </>
  );
}

export function ServiceActionSubmitButton({
  venueSlug,
  tableNumber,
  action,
  view,
  layout = "grid",
  showSuccess = false,
}: ServiceActionSubmitButtonProps) {
  return (
    <form action={submitCustomerServiceRequestAction}>
      <input type="hidden" name="venueSlug" value={venueSlug} />
      <input type="hidden" name="tableNumber" value={tableNumber} />
      <input type="hidden" name="requestType" value={action.type} />
      <input type="hidden" name="view" value={view} />
      <ServiceActionButtonContents
        action={action}
        tableNumber={tableNumber}
        layout={layout}
        showSuccess={showSuccess}
      />
    </form>
  );
}
