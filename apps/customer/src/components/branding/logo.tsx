import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  wordmark = true,
  size = "md",
  inverted = false,
}: {
  className?: string;
  wordmark?: boolean;
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}) {
  const box = size === "lg" ? "size-12" : size === "sm" ? "size-8" : "size-9";
  const text = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex items-center justify-center rounded-xl bg-brand text-white shadow-sm", box)}>
        <Wrench className={size === "sm" ? "size-4" : "size-5"} />
      </div>
      {wordmark ? (
        <div className="leading-tight">
          <p className={cn("font-bold tracking-tight", inverted ? "text-white" : "text-navy", text)}>Farsamo</p>
          {size !== "sm" ? (
            <p className={cn("text-[11px]", inverted ? "text-white/60" : "text-muted-foreground")}>
              All Services in One Place
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
