"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImageGallery } from "@/components/shared/image-gallery";
import { ProviderCard } from "@/components/admin/provider-card";
import { SearchInput } from "@/components/shared/search-input";
import { useStore } from "@farsamo/core";

export function ProviderAssignmentModal({
  requestId,
  open,
  onOpenChange,
}: {
  requestId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { requests, services, users, providers, assignProvider } = useStore();
  const [query, setQuery] = useState("");
  const request = requests.find((item) => item.id === requestId);
  const customer = users.find((user) => user.id === request?.customerId);
  const service = services.find((item) => item.id === request?.serviceId);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return providers.filter((provider) => {
      const haystack = `${provider.fullName} ${provider.profession} ${provider.city} ${provider.skills.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [providers, query]);

  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign service provider</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-navy">{request.requestNumber}</p>
            <p className="mt-1 text-muted-foreground">
              {customer?.fullName} · {service?.name} · {request.location.city}
            </p>
            <p className="mt-2 text-navy">{request.description}</p>
            <ImageGallery images={request.images} className="mt-3" />
          </div>
          <SearchInput value={query} onChange={setQuery} placeholder="Search provider" />
          <div className="space-y-2">
            {filtered.map((provider) => (
              <ProviderCard
                key={provider.id}
                provider={provider}
                onAction={() => {
                  assignProvider(request.id, provider.id);
                  onOpenChange(false);
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
