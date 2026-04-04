"use client";

import { useActionState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  CheckCircle2,
  ConciergeBell,
  LifeBuoy,
  LoaderCircle,
  ReceiptText,
  UtensilsCrossed,
} from "lucide-react";

import { submitServiceRequestFormAction } from "@/lib/actions/service-requests";
import { Button } from "@/components/ui/button";
import type {
  ServiceAction,
  ServiceActionType,
  ServiceRequestActionResult,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface ServiceActionSubmitButtonProps {
  venueSlug: string;
  tableNumber: number;
  action: ServiceAction;
  layout?: "grid" | "dock";
}

const actionIcons: Record<ServiceActionType, LucideIcon> = {
  call_waiter: ConciergeBell,
  ready_to_order: UtensilsCrossed,
  request_bill: ReceiptText,
  need_assistance: LifeBuoy,
};

const initialState: ServiceRequestActionResult = {
  success: false,
};

export function ServiceActionSubmitButton({
  venueSlug,
  tableNumber,
  action,
  layout = "grid",
}: ServiceActionSubmitButtonProps) {
  const [state, formAction, pending] = useActionState(
    submitServiceRequestFormAction,
    initialState
  );
  const Icon = actionIcons[action.type];
  const showSuccess = state.success && !pending;

  if (layout === "dock") {
    return (
      <div className="space-y-2">
        <form action={formAction}>
          <input type="hidden" name="venueSlug" value={venueSlug} />
          <input type="hidden" name="tableNumber" value={tableNumber} />
          <input type="hidden" name="requestType" value={action.type} />
          <Button
            type="submit"
            size="lg"
            variant={showSuccess ? "secondary" : "default"}
            aria-busy={pending}
            className={cn(
              "h-auto min-h-[3.75rem] w-full touch-manipulation whitespace-normal break-words rounded-[1.25rem] px-4 py-3 text-left transition duration-150 ease-out active:scale-[0.985]",
              showSuccess
                ? "border border-emerald-200 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 active:bg-emerald-100"
                : "shadow-sm shadow-black/10 active:bg-primary/92"
            )}
          >
            <span className="flex w-full items-center gap-3">
              <span
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-2xl",
                  showSuccess
                    ? "bg-emerald-600 text-white"
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
                    showSuccess ? "text-emerald-700" : "text-primary-foreground/72"
                  )}
                >
                  {pending
                    ? "Please hold while we send that request."
                    : showSuccess
                      ? "Sent"
                      : action.estimatedResponse}
                </span>
              </span>
            </span>
          </Button>
        </form>

        {!state.success && state.error ? (
          <p className="px-1 text-sm leading-6 text-destructive">
            {state.error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="venueSlug" value={venueSlug} />
        <input type="hidden" name="tableNumber" value={tableNumber} />
        <input type="hidden" name="requestType" value={action.type} />
        <Button
          type="submit"
          variant={showSuccess ? "secondary" : "outline"}
          size="lg"
          aria-busy={pending}
          className={cn(
            "h-auto min-h-[5rem] w-full touch-manipulation items-start justify-start whitespace-normal break-words rounded-[1.5rem] px-4 py-4 text-left transition duration-150 ease-out active:scale-[0.985]",
            showSuccess
              ? "border-emerald-200 bg-emerald-50 text-emerald-950 shadow-sm shadow-emerald-900/5 hover:bg-emerald-100 active:bg-emerald-100"
              : "border-white/80 bg-white/90 shadow-sm shadow-black/5 hover:border-primary/15 hover:bg-white active:border-primary/20 active:bg-primary/4"
          )}
        >
          <span className="flex w-full items-start gap-3.5">
            <span
              className={cn(
                "mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl",
                showSuccess
                  ? "bg-emerald-600 text-white"
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
              <span
                className={cn(
                  "text-sm leading-6",
                  showSuccess ? "text-emerald-800" : "text-muted-foreground"
                )}
              >
                {pending
                  ? "Please hold while we send that request."
                  : showSuccess
                    ? state.message ?? action.successMessage
                    : action.description}
              </span>
              <span
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.24em]",
                  showSuccess ? "text-emerald-700" : "text-primary/75"
                )}
              >
                {showSuccess ? "Request sent" : action.estimatedResponse}
              </span>
            </span>
          </span>
        </Button>
      </form>

      {!state.success && state.error ? (
        <p className="px-1 text-sm leading-6 text-destructive">
          {state.error}
        </p>
      ) : null}
    </div>
  );
}
