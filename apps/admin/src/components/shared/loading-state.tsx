import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground", className)}>
      <LoaderCircle className="size-6 animate-spin text-action" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
