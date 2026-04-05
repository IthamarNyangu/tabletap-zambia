import Link from "next/link";
import { Building2, LayoutGrid, ShieldCheck, UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminToolKey = "overview" | "tables" | "menu" | "actions";

interface AdminToolsNavProps {
  active: AdminToolKey;
}

const adminToolLinks = [
  {
    key: "overview",
    href: "/admin",
    label: "Overview",
    description: "Venue snapshot",
    icon: Building2,
  },
  {
    key: "tables",
    href: "/admin/tables",
    label: "Tables",
    description: "Floor setup",
    icon: LayoutGrid,
  },
  {
    key: "menu",
    href: "/admin/menu",
    label: "Menu",
    description: "Guest items",
    icon: UtensilsCrossed,
  },
  {
    key: "actions",
    href: "/admin/actions",
    label: "Service",
    description: "Request toggles",
    icon: ShieldCheck,
  },
] as const;

export function AdminToolsNav({ active }: AdminToolsNavProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {adminToolLinks.map(({ key, href, label, description, icon: Icon }) => {
        const isActive = key === active;

        return (
          <Link
            key={key}
            href={href}
            className={cn(
              "rounded-[1.5rem] border p-4 transition-all",
              isActive
                ? "border-primary/20 bg-[linear-gradient(135deg,rgba(38,79,93,0.98),rgba(55,99,112,0.96))] text-primary-foreground shadow-lg shadow-black/10"
                : "border-border/60 bg-white/88 text-foreground shadow-sm shadow-black/5 hover:-translate-y-0.5 hover:bg-secondary/45"
            )}
          >
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                  isActive
                    ? "bg-white/15 text-primary-foreground"
                    : "bg-secondary text-primary"
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <p className="text-sm font-semibold">{label}</p>
                <p
                  className={cn(
                    "truncate text-sm leading-6",
                    isActive
                      ? "text-primary-foreground/78"
                      : "text-muted-foreground"
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
