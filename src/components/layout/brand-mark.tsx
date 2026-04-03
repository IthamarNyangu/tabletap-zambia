import Link from "next/link";
import { QrCode, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  href?: string;
  className?: string;
  compact?: boolean;
}

export function BrandMark({
  href = "/",
  className,
  compact = false,
}: BrandMarkProps) {
  const content = (
    <>
      <span className="flex size-11 items-center justify-center rounded-2xl border border-white/60 bg-white/85 shadow-sm shadow-black/5 backdrop-blur">
        <QrCode className="size-5 text-primary" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          TableTap Zambia
          {!compact ? <Sparkles className="size-3.5 text-primary/70" /> : null}
        </span>
        <span className="truncate font-heading text-lg leading-none text-foreground">
          {compact ? "Table service, simplified" : "Phase 1 MVP foundation"}
        </span>
      </span>
    </>
  );

  const sharedClassName = cn(
    "inline-flex items-center gap-3 text-left",
    className
  );

  if (!href) {
    return <div className={sharedClassName}>{content}</div>;
  }

  return (
    <Link href={href} className={sharedClassName}>
      {content}
    </Link>
  );
}
