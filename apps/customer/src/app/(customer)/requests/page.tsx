"use client";

import { useMemo, useState } from "react";
import { RequestCard } from "@/components/customer/request-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { requestTab } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function RequestsPage() {
  const { requests, services, currentUser, locale } = useStore();
  const [tab, setTab] = useState("active");
  const mine = useMemo(
    () => requests.filter((request) => request.customerId === currentUser?.id),
    [requests, currentUser],
  );
  const filtered = mine.filter((request) => requestTab(request.status) === tab);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-navy">My Requests</h1>
      <Tabs value={tab} onValueChange={(value) => setTab(String(value))}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-3">
        {filtered.length ? (
          filtered.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              service={services.find((service) => service.id === request.serviceId)}
              locale={locale}
            />
          ))
        ) : (
          <EmptyState
            title={tab === "active" ? "You have no active requests." : tab === "completed" ? "No completed services yet." : "No cancelled requests."}
          />
        )}
      </div>
    </div>
  );
}
