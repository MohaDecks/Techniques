import Link from "next/link";
import { Clock, Star } from "lucide-react";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { formatPrice } from "@farsamo/core";
import type { Service } from "@farsamo/core";

export function ServiceCard({
  service,
  variant = "grid",
}: {
  service: Service;
  variant?: "grid" | "row";
}) {
  const href = `/services/${service.id}`;

  if (variant === "row") {
    return (
      <Link href={href} className="app-card flex items-center gap-3 p-3">
        <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.images[0]} alt={service.name} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate font-semibold text-navy">{service.name}</p>
            <span className="text-sm font-semibold text-action">{formatPrice(service.startingPrice)}</span>
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{service.shortDescription}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {service.rating}
            <Clock className="ml-1 size-3" />
            {service.estimatedTime}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="app-card overflow-hidden">
      <div className="relative h-32 bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.images[0]} alt={service.name} className="h-full w-full object-cover" />
        <div className="absolute top-2 right-2">
          <AvailabilityBadge available={service.isAvailable} />
        </div>
      </div>
      <div className="space-y-1.5 p-3">
        <p className="font-semibold text-navy">{service.name}</p>
        <p className="line-clamp-2 text-xs text-muted-foreground">{service.shortDescription}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-action">{formatPrice(service.startingPrice)}</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="size-3" />
            {service.estimatedTime}
          </span>
        </div>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          {service.rating} · {service.reviewCount} reviews
        </p>
      </div>
    </Link>
  );
}
