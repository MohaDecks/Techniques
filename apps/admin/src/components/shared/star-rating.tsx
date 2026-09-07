import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  onChange,
  size = "sm",
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
}) {
  const icon = size === "md" ? "size-6" : "size-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(star)}
          className="disabled:cursor-default"
          aria-label={`${star} stars`}
        >
          <Star
            className={cn(icon, star <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-300")}
          />
        </button>
      ))}
    </div>
  );
}
