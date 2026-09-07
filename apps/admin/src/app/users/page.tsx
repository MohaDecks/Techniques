"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable } from "@/components/shared/data-table";
import { UserStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatDate, formatPhone } from "@farsamo/core";
import { useStore } from "@farsamo/core";
import type { UserStatus } from "@farsamo/core";

export default function AdminUsersPage() {
  const { users, setUserStatus } = useStore();
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () =>
      users.filter((user) => `${user.fullName} ${user.phone} ${user.role}`.toLowerCase().includes(query.toLowerCase())),
    [users, query],
  );

  return (
    <div>
      <PageHeader title="Users" description="Customers and administrators" />
      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search users" className="max-w-sm" />
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "name", header: "Name", render: (row) => <span className="font-medium text-navy">{row.fullName}</span> },
          { key: "phone", header: "Phone", render: (row) => formatPhone(row.phone) },
          { key: "role", header: "Role", render: (row) => <span className="capitalize">{row.role}</span> },
          { key: "status", header: "Status", render: (row) => <UserStatusBadge status={row.status} /> },
          { key: "joined", header: "Joined", render: (row) => formatDate(row.createdAt) },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex flex-wrap gap-1" onClick={(event) => event.stopPropagation()}>
                {(["active", "inactive", "blocked"] as UserStatus[]).map((status) => (
                  <Button key={status} size="xs" variant="outline" onClick={() => setUserStatus(row.id, status)}>
                    {status === "active" ? "Activate" : status === "inactive" ? "Deactivate" : "Block"}
                  </Button>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
