import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatsCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "navy" | "violet" | "red";
}) {
  const tones = {
    blue: "bg-blue-50 text-action",
    green: "bg-emerald-50 text-brand",
    amber: "bg-amber-50 text-amber-600",
    navy: "bg-slate-100 text-navy",
    violet: "bg-violet-50 text-violet-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="app-card flex items-center gap-4 p-4">
      <div className={cn("flex size-11 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="text-xl font-bold tracking-tight text-navy">{value}</p>
      </div>
    </div>
  );
}
