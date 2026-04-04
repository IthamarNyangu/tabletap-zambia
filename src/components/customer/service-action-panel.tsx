import type { ServiceAction } from "@/lib/types";
import { ServiceActionSubmitButton } from "@/components/customer/service-action-submit-button";
import { cn } from "@/lib/utils";

interface ServiceActionPanelProps {
  venueSlug: string;
  tableNumber: number;
  actions: ServiceAction[];
  layout?: "grid" | "dock";
}

export function ServiceActionPanel({
  venueSlug,
  tableNumber,
  actions,
  layout = "grid",
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
        />
      ))}
    </div>
  );
}
