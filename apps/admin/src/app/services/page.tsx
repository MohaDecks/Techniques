"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable } from "@/components/shared/data-table";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CUSTOMER_APP_URL, formatPrice } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function AdminServicesPage() {
  const { services, categories, setServiceAvailability, deleteService } = useStore();
  const [query, setQuery] = useState("");
  const [removeId, setRemoveId] = useState<string | null>(null);
  const rows = useMemo(
    () => services.filter((service) => service.name.toLowerCase().includes(query.toLowerCase())),
    [services, query],
  );

  return (
    <div>
      <PageHeader
        title="Services"
        description="Services shown in the customer app come from this list."
        actions={
          <Button render={<Link href="/services/new" />} className="rounded-xl">
            Add Service
          </Button>
        }
      />
      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search services" className="max-w-sm" />
      </div>
      <DataTable
        rows={rows}
        columns={[
          {
            key: "image",
            header: "Image",
            render: (row) => (
              <div className="size-12 overflow-hidden rounded-xl bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={row.images[0]} alt="" className="h-full w-full object-cover" />
              </div>
            ),
          },
          { key: "name", header: "Service Name", render: (row) => <span className="font-medium text-navy">{row.name}</span> },
          {
            key: "category",
            header: "Category",
            render: (row) => categories.find((category) => category.id === row.categoryId)?.name ?? "—",
          },
          { key: "price", header: "Starting Price", render: (row) => formatPrice(row.startingPrice) },
          { key: "time", header: "Estimated Time", render: (row) => row.estimatedTime },
          { key: "status", header: "Status", render: (row) => <AvailabilityBadge available={row.isAvailable} /> },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex flex-wrap items-center gap-2" onClick={(event) => event.stopPropagation()}>
                <Switch checked={row.isAvailable} onCheckedChange={(checked) => setServiceAvailability(row.id, checked)} />
                <Button size="xs" variant="outline" render={<Link href={`/services/${row.id}`} />}>
                  Edit
                </Button>
                <Button size="xs" variant="outline" render={<a href={`${CUSTOMER_APP_URL}/services/${row.id}`} target="_blank" rel="noreferrer" />}>
                  Preview
                </Button>
                <Button size="xs" variant="destructive" onClick={() => setRemoveId(row.id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />
      <ConfirmDialog
        open={Boolean(removeId)}
        onOpenChange={() => setRemoveId(null)}
        title="Delete service?"
        description="Customers will no longer see this service."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (removeId) deleteService(removeId);
          setRemoveId(null);
        }}
      />
    </div>
  );
}
