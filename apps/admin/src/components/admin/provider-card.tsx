import { MapPin, Star } from "lucide-react";
import { ProviderStatusBadge } from "@/components/shared/status-badge";
import { formatPhone } from "@farsamo/core";
import type { ServiceProvider } from "@farsamo/core";
import { Button } from "@/components/ui/button";

export function ProviderCard({
  provider,
  actionLabel = "Assign",
  onAction,
}: {
  provider: ServiceProvider;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="app-card flex items-center gap-3 p-3">
      <div className="size-12 overflow-hidden rounded-full bg-slate-100">
        {provider.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={provider.avatarUrl} alt={provider.fullName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm font-semibold text-navy">
            {provider.fullName.slice(0, 1)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-semibold text-navy">{provider.fullName}</p>
          <ProviderStatusBadge status={provider.status} />
        </div>
        <p className="text-xs text-muted-foreground">{provider.profession}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {provider.city}
          </span>
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {provider.rating || "New"}
          </span>
          <span className="capitalize">{provider.availability}</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{formatPhone(provider.phone)}</p>
      </div>
      {onAction ? (
        <Button size="sm" onClick={onAction} disabled={provider.status !== "approved" || provider.availability === "offline"}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
