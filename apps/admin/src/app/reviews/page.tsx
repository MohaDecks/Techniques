"use client";

import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StarRating } from "@/components/shared/star-rating";
import { formatDate } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function AdminReviewsPage() {
  const { reviews, users, services } = useStore();

  return (
    <div>
      <PageHeader title="Reviews" description="Customer feedback after completed jobs." />
      <DataTable
        rows={reviews}
        columns={[
          { key: "customer", header: "Customer", render: (row) => users.find((user) => user.id === row.customerId)?.fullName ?? "—" },
          { key: "service", header: "Service", render: (row) => services.find((item) => item.id === row.serviceId)?.name ?? "—" },
          { key: "rating", header: "Rating", render: (row) => <StarRating value={row.rating} /> },
          { key: "comment", header: "Comment", render: (row) => row.comment },
          { key: "date", header: "Date", render: (row) => formatDate(row.createdAt) },
        ]}
      />
    </div>
  );
}
