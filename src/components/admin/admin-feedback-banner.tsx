import { AlertCircle, CircleCheckBig } from "lucide-react";

import { cn } from "@/lib/utils";

interface AdminFeedbackBannerProps {
  tone: "success" | "error";
  message: string;
}

export function AdminFeedbackBanner({
  tone,
  message,
}: AdminFeedbackBannerProps) {
  const isSuccess = tone === "success";
  const Icon = isSuccess ? CircleCheckBig : AlertCircle;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[1.35rem] border px-4 py-3 text-sm",
        isSuccess
          ? "border-emerald-200 bg-emerald-50/90 text-emerald-900"
          : "border-destructive/20 bg-destructive/8 text-muted-foreground"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
          isSuccess
            ? "bg-emerald-100 text-emerald-700"
            : "bg-destructive/10 text-destructive"
        )}
      >
        <Icon className="size-4" />
      </div>
      <p className="leading-6">{message}</p>
    </div>
  );
}
