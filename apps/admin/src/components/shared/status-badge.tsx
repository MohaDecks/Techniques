import { Badge } from "@/components/ui/badge";
import { t } from "@farsamo/core";
import type { LocaleCode, RequestStatus, UserStatus, ProviderStatus } from "@farsamo/core";
import { cn } from "@/lib/utils";

const requestStyles: Record<RequestStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  under_review: "bg-blue-100 text-blue-800",
  provider_assigned: "bg-indigo-100 text-indigo-800",
  on_the_way: "bg-sky-100 text-sky-800",
  service_started: "bg-violet-100 text-violet-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-700",
};

export function StatusBadge({
  status,
  locale = "en",
  className,
}: {
  status: RequestStatus;
  locale?: LocaleCode;
  className?: string;
}) {
  return (
    <Badge className={cn("h-6 rounded-full px-2.5 font-semibold", requestStyles[status], className)}>
      {t(locale, `status.${status}`)}
    </Badge>
  );
}

export function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <Badge className={cn("h-6 rounded-full px-2.5 font-semibold", available ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700")}>
      {available ? "Available" : "Currently Unavailable"}
    </Badge>
  );
}

export function UserStatusBadge({ status }: { status: UserStatus }) {
  const styles = {
    active: "bg-emerald-100 text-emerald-800",
    inactive: "bg-slate-100 text-slate-700",
    blocked: "bg-red-100 text-red-700",
  };
  return <Badge className={cn("h-6 rounded-full capitalize", styles[status])}>{status}</Badge>;
}

export function ProviderStatusBadge({ status }: { status: ProviderStatus }) {
  const styles = {
    pending: "bg-amber-100 text-amber-800",
    approved: "bg-emerald-100 text-emerald-800",
    suspended: "bg-orange-100 text-orange-800",
    rejected: "bg-red-100 text-red-700",
  };
  return <Badge className={cn("h-6 rounded-full capitalize", styles[status])}>{status}</Badge>;
}
