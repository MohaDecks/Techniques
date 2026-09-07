import { Check } from "lucide-react";
import { TRACKING_STEPS } from "@farsamo/core";
import { t } from "@farsamo/core";
import type { LocaleCode, RequestStatus } from "@farsamo/core";
import { cn } from "@/lib/utils";

export function RequestTimeline({
  status,
  locale = "en",
}: {
  status: RequestStatus;
  locale?: LocaleCode;
}) {
  const currentIndex = status === "cancelled" ? -1 : TRACKING_STEPS.indexOf(status);

  return (
    <ol className="space-y-0">
      {TRACKING_STEPS.map((step, index) => {
        const done = currentIndex >= index;
        const current = currentIndex === index;
        return (
          <li key={step} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-7 items-center justify-center rounded-full border-2",
                  done ? "border-brand bg-brand text-white" : "border-slate-200 bg-white text-slate-300",
                )}
              >
                {done ? <Check className="size-3.5" /> : <span className="size-2 rounded-full bg-slate-200" />}
              </div>
              {index < TRACKING_STEPS.length - 1 ? (
                <div className={cn("my-1 w-0.5 flex-1 min-h-6", done && !current ? "bg-brand" : "bg-slate-200")} />
              ) : null}
            </div>
            <div className="pb-5">
              <p className={cn("text-sm font-semibold", done ? "text-navy" : "text-slate-400")}>
                {t(locale, `timeline.${step}`)}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
