"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable } from "@/components/shared/data-table";
import { FilterChip, FilterPanel } from "@/components/shared/filter-panel";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProviderAssignmentModal } from "@/components/admin/provider-assignment-modal";
import { Button } from "@/components/ui/button";
import { REQUEST_STATUSES } from "@farsamo/core";
import { formatDateTime } from "@farsamo/core";
import { useStore } from "@farsamo/core";
import type { RequestStatus } from "@farsamo/core";

export default function AdminRequestsPage() {
  const { requests, users, services, providers } = useStore();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RequestStatus | "all">("all");
  const [assignId, setAssignId] = useState<string | null>(null);

  const rows = useMemo(() => {
    return requests.filter((request) => {
      const customer = users.find((user) => user.id === request.customerId);
      const service = services.find((item) => item.id === request.serviceId);
      const haystack = `${request.requestNumber} ${customer?.fullName} ${service?.name} ${request.location.city}`.toLowerCase();
      const matchesQuery = haystack.includes(query.toLowerCase());
      const matchesStatus = status === "all" || request.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [requests, users, services, query, status]);

  return (
    <div>
      <PageHeader title="Service Requests" description="Review customer requests and assign a suitable provider." />
      <div className="mb-4 space-y-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Search requests" className="max-w-sm" />
        <FilterPanel>
          <FilterChip active={status === "all"} onClick={() => setStatus("all")}>
            All
          </FilterChip>
          {REQUEST_STATUSES.map((item) => (
            <FilterChip key={item} active={status === item} onClick={() => setStatus(item)}>
              {item.replaceAll("_", " ")}
            </FilterChip>
          ))}
        </FilterPanel>
      </div>
      <DataTable
        rows={rows}
        onRowClick={(row) => router.push(`/requests/${row.id}`)}
        columns={[
          { key: "id", header: "Request ID", render: (row) => <span className="font-medium text-navy">{row.requestNumber}</span> },
          { key: "customer", header: "Customer", render: (row) => users.find((user) => user.id === row.customerId)?.fullName ?? "—" },
          { key: "service", header: "Service", render: (row) => services.find((item) => item.id === row.serviceId)?.name ?? "—" },
          { key: "location", header: "Location", render: (row) => `${row.location.city}, ${row.location.region}` },
          { key: "date", header: "Date", render: (row) => row.preferredDate },
          { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          {
            key: "provider",
            header: "Assigned Provider",
            render: (row) => providers.find((item) => item.id === row.assignedProviderId)?.fullName ?? "Not assigned",
          },
          { key: "created", header: "Created At", render: (row) => formatDateTime(row.createdAt) },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex gap-1" onClick={(event) => event.stopPropagation()}>
                <Button size="xs" variant="outline" render={<Link href={`/requests/${row.id}`} />}>
                  View
                </Button>
                <Button size="xs" onClick={() => setAssignId(row.id)}>
                  Assign
                </Button>
              </div>
            ),
          },
        ]}
      />
      <ProviderAssignmentModal requestId={assignId} open={Boolean(assignId)} onOpenChange={(open) => !open && setAssignId(null)} />
    </div>
  );
}
