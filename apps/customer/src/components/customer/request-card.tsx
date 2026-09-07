import Link from "next/link";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@farsamo/core";
import type { LocaleCode, Service, ServiceRequest } from "@farsamo/core";

export function RequestCard({
  request,
  service,
  locale = "en",
}: {
  request: ServiceRequest;
  service?: Service;
  locale?: LocaleCode;
}) {
  return (
    <Link href={`/requests/${request.id}`} className="app-card flex items-center gap-3 p-3">
      <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service?.images[0]} alt={service?.name ?? "Service"} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-navy">{service?.name ?? "Service"}</p>
          <StatusBadge status={request.status} locale={locale} />
        </div>
        <p className="mt-0.5 text-xs font-medium text-slate-500">{request.requestNumber}</p>
        <p className="text-xs text-muted-foreground">{formatDate(request.createdAt)}</p>
      </div>
    </Link>
  );
}
