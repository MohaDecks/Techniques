"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { RequestTimeline } from "@/components/customer/request-timeline";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatDate } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function TrackingPage() {
  const { id } = useParams<{ id: string }>();
  const { requests, services, providers, locale } = useStore();
  const request = requests.find((item) => item.id === id);
  if (!request) return null;
  const service = services.find((item) => item.id === request.serviceId);
  const provider = providers.find((item) => item.id === request.assignedProviderId);

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-2">
        <Link href={`/requests/${request.id}`} className="rounded-full p-2 hover:bg-slate-100">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{request.requestNumber}</p>
          <h1 className="text-lg font-bold text-navy">Tracking</h1>
        </div>
        <StatusBadge status={request.status} locale={locale} />
      </header>
      <div className="app-card p-4">
        <RequestTimeline status={request.status} locale={locale} />
      </div>
      {provider && request.assignedProviderId ? (
        <div className="app-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Assigned provider</p>
          <p className="mt-1 font-semibold text-navy">{provider.fullName}</p>
          <p className="text-sm text-muted-foreground">{provider.profession} · {provider.city}</p>
        </div>
      ) : (
        <div className="app-card p-4 text-sm text-muted-foreground">
          A provider will appear here after our team assigns one.
        </div>
      )}
      <div className="app-card space-y-1 p-4 text-sm">
        <p className="font-semibold text-navy">Service information</p>
        <p>{service?.name}</p>
        <p className="text-muted-foreground">
          {request.location.address}, {request.location.city}
        </p>
        <p className="text-muted-foreground">
          {formatDate(request.preferredDate)} · {request.preferredTime}
        </p>
      </div>
    </div>
  );
}
