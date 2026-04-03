import { Badge } from "@/components/ui/badge";
import type { ServiceRequestStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface RequestStatusBadgeProps {
  status: ServiceRequestStatus;
}

const statusLabelMap: Record<ServiceRequestStatus, string> = {
  pending: "Pending",
  attended: "Attended",
  closed: "Closed",
};

const statusClassMap: Record<ServiceRequestStatus, string> = {
  pending:
    "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200",
  attended:
    "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200",
  closed:
    "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200",
};

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn("rounded-full px-3 py-1 font-medium", statusClassMap[status])}
    >
      {statusLabelMap[status]}
    </Badge>
  );
}
