"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, MapPin, Phone } from "lucide-react";
import { ImageGallery } from "@/components/shared/image-gallery";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPhone } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function RequestDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { requests, services, providers, locale } = useStore();
  const request = requests.find((item) => item.id === id);
  if (!request) return <p className="pt-10 text-center text-sm">Request not found.</p>;
  const service = services.find((item) => item.id === request.serviceId);
  const provider = providers.find((item) => item.id === request.assignedProviderId);
  const showProvider = Boolean(request.assignedProviderId && provider);

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <Link href="/requests" className="rounded-full p-2 hover:bg-slate-100">
          <ChevronLeft className="size-5" />
        </Link>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">{request.requestNumber}</p>
          <h1 className="text-lg font-bold text-navy">{service?.name}</h1>
        </div>
        <StatusBadge status={request.status} locale={locale} />
      </header>
      <div className="app-card space-y-3 p-4 text-sm">
        <p className="text-slate-600">{request.description}</p>
        <ImageGallery images={request.images} />
        <p className="flex items-start gap-2 text-slate-600">
          <MapPin className="mt-0.5 size-4 text-brand" />
          {request.location.address}, {request.location.area}, {request.location.city}
        </p>
        <p>
          {formatDate(request.preferredDate)} · {request.preferredTime}
        </p>
        <p className="flex items-center gap-2">
          <Phone className="size-4 text-action" />
          {formatPhone(request.phone)}
        </p>
      </div>
      {showProvider ? (
        <div className="app-card p-4">
          <p className="text-xs font-medium text-muted-foreground">Assigned provider</p>
          <p className="mt-1 font-semibold text-navy">{provider?.fullName}</p>
          <p className="text-sm text-muted-foreground">{provider?.profession}</p>
        </div>
      ) : (
        <div className="app-card p-4 text-sm text-muted-foreground">
          A provider will appear here after our team assigns one.
        </div>
      )}
      <Button render={<Link href={`/requests/${request.id}/track`} />} className="h-12 w-full rounded-xl">
        Track request
      </Button>
      {request.status === "completed" ? (
        <Button render={<Link href="/reviews" />} variant="outline" className="h-12 w-full rounded-xl">
          Leave a review
        </Button>
      ) : null}
    </div>
  );
}
