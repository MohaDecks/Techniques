"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime, formatPrice } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function AdminPaymentsPage() {
  const { payments, users, requests } = useStore();

  return (
    <div>
      <PageHeader title="Payments" description="Settlements linked to completed service requests." />
      <DataTable
        rows={payments}
        columns={[
          { key: "request", header: "Request", render: (row) => requests.find((item) => item.id === row.requestId)?.requestNumber ?? row.requestId },
          { key: "customer", header: "Customer", render: (row) => users.find((user) => user.id === row.customerId)?.fullName ?? "—" },
          { key: "amount", header: "Amount", render: (row) => formatPrice(row.amount) },
          { key: "method", header: "Method", render: (row) => row.method },
          {
            key: "status",
            header: "Status",
            render: (row) => <Badge className="capitalize">{row.status}</Badge>,
          },
          { key: "date", header: "Date", render: (row) => formatDateTime(row.createdAt) },
        ]}
      />
    </div>
  );
}
