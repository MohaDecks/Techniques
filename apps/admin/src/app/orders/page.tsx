"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { useStore } from "@farsamo/core";

export default function AdminOrdersPage() {
  const { requests, users, services, providers } = useStore();
  const rows = requests.filter((request) =>
    ["provider_assigned", "on_the_way", "service_started", "completed"].includes(request.status),
  );

  return (
    <div>
      <PageHeader title="Orders" description="Jobs that have been assigned and are being fulfilled." />
      <DataTable
        rows={rows}
        columns={[
          {
            key: "id",
            header: "Order / Request",
            render: (row) => (
              <Link href={`/requests/${row.id}`} className="font-medium text-action">
                {row.requestNumber}
              </Link>
            ),
          },
          { key: "customer", header: "Customer", render: (row) => users.find((user) => user.id === row.customerId)?.fullName ?? "—" },
          { key: "service", header: "Service", render: (row) => services.find((item) => item.id === row.serviceId)?.name ?? "—" },
          { key: "provider", header: "Provider", render: (row) => providers.find((item) => item.id === row.assignedProviderId)?.fullName ?? "—" },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          { key: "city", header: "City", render: (row) => row.location.city },
        ]}
      />
    </div>
  );
}
