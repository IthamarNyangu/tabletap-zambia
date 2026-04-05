import type { ServiceAction } from "@/lib/types";
import { ServiceActionSubmitButton } from "@/components/customer/service-action-submit-button";
import { cn } from "@/lib/utils";
import type { CustomerView } from "@/lib/validations/service-request";
import type { ServiceActionType } from "@/lib/types";

interface ServiceActionPanelProps {
  venueSlug: string;
  tableNumber: number;
  actions: ServiceAction[];
  layout?: "grid" | "dock";
  view: CustomerView;
  sentActionType?: ServiceActionType | null;
}

function shouldShowActionSuccess(input: {
  actionType: ServiceActionType;
  sentActionType: ServiceActionType | null;
  view: CustomerView;
}) {
  if (!input.sentActionType) {
    return false;
  }

  if (input.sentActionType === input.actionType) {
    return true;
  }

  return (
    input.view === "home" &&
    input.actionType === "call_waiter" &&
    input.sentActionType === "ready_to_order"
  );
}

export function ServiceActionPanel({
  venueSlug,
  tableNumber,
  actions,
  layout = "grid",
  view,
  sentActionType = null,
}: ServiceActionPanelProps) {
  if (!actions.length) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid gap-3",
        layout === "dock" && actions.length > 1 ? "grid-cols-2" : "grid-cols-1"
      )}
    >
      {actions.map((action) => (
        <ServiceActionSubmitButton
          key={action.type}
          venueSlug={venueSlug}
          tableNumber={tableNumber}
          action={action}
          layout={layout}
          view={view}
          showSuccess={shouldShowActionSuccess({
            actionType: action.type,
            sentActionType,
            view,
          })}
        />
      ))}
    </div>
  );
}
