"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { CircleDollarSign, ClipboardList, Star, Users } from "lucide-react";
import { formatPrice } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function AdminReportsPage() {
  const { users, requests, reviews, payments, services } = useStore();
  const revenue = payments.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0);
  const byCity = ["Jigjiga", "Addis Ababa", "Dire Dawa", "Harar"].map((city) => ({
    name: city,
    requests: requests.filter((item) => item.location.city === city).length,
  }));
  const byService = services.map((service) => ({
    name: service.name,
    requests: requests.filter((item) => item.serviceId === service.id).length,
  }));

  return (
    <div className="space-y-5">
      <PageHeader title="Reports" description="Operational snapshot for the Farsamo marketplace." />
      <div className="grid gap-3 md:grid-cols-4">
        <StatsCard label="Customers" value={users.filter((user) => user.role === "customer").length} icon={Users} />
        <StatsCard label="Requests" value={requests.length} icon={ClipboardList} tone="amber" />
        <StatsCard label="Reviews" value={reviews.length} icon={Star} tone="green" />
        <StatsCard label="Revenue" value={formatPrice(revenue)} icon={CircleDollarSign} tone="violet" />
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="app-card p-4">
          <h2 className="mb-4 font-semibold text-navy">Requests by city</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="app-card p-4">
          <h2 className="mb-4 font-semibold text-navy">Requests by service</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byService}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="requests" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
