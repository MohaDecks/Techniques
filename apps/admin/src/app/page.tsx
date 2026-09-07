"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BriefcaseBusiness, CircleDollarSign, ClipboardList, Clock3, PackageCheck, UserCog, Users, Wrench } from "lucide-react";
import { StatsCard } from "@/components/shared/stats-card";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatPrice } from "@farsamo/core";
import { useStore } from "@farsamo/core";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#8b5cf6", "#ef4444"];

export default function AdminDashboardPage() {
  const { users, providers, services, requests, payments } = useStore();
  const today = "2026-09-05";
  const todayRequests = requests.filter((item) => item.createdAt.startsWith(today));
  const revenue = payments.filter((item) => item.status === "paid").reduce((sum, item) => sum + item.amount, 0);

  const overview = [
    { name: "Mon", requests: 8, completed: 5 },
    { name: "Tue", requests: 11, completed: 7 },
    { name: "Wed", requests: 9, completed: 6 },
    { name: "Thu", requests: 14, completed: 10 },
    { name: "Fri", requests: 12, completed: 8 },
    { name: "Sat", requests: 16, completed: 11 },
    { name: "Sun", requests: todayRequests.length + 4, completed: 3 },
  ];

  const popular = services
    .map((service) => ({
      name: service.name,
      value: requests.filter((request) => request.serviceId === service.id).length || (service.isPopular ? 4 : 1),
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const recent = requests.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Marketplace activity across Ethiopia</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard label="Total Users" value={users.filter((user) => user.role === "customer").length} icon={Users} tone="blue" />
        <StatsCard label="Service Providers" value={providers.length} icon={UserCog} tone="navy" />
        <StatsCard label="Total Services" value={services.length} icon={Wrench} tone="green" />
        <StatsCard label="Today's Requests" value={todayRequests.length} icon={ClipboardList} tone="amber" />
        <StatsCard label="Pending Requests" value={requests.filter((item) => item.status === "pending").length} icon={Clock3} tone="amber" />
        <StatsCard label="Active Jobs" value={requests.filter((item) => ["provider_assigned", "on_the_way", "service_started"].includes(item.status)).length} icon={BriefcaseBusiness} tone="violet" />
        <StatsCard label="Completed Jobs" value={requests.filter((item) => item.status === "completed").length} icon={PackageCheck} tone="green" />
        <StatsCard label="Revenue" value={formatPrice(revenue)} icon={CircleDollarSign} tone="blue" />
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="app-card p-4 xl:col-span-2">
          <h2 className="mb-4 font-semibold text-navy">Requests overview</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#2563eb" strokeWidth={3} />
                <Line type="monotone" dataKey="completed" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="app-card p-4">
          <h2 className="mb-4 font-semibold text-navy">Popular services</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={popular} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80}>
                  {popular.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <div className="app-card p-4">
          <h2 className="mb-4 font-semibold text-navy">Completed services</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="app-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-navy">Latest requests</h2>
            <Link href="/requests" className="text-sm text-action">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recent.map((request) => (
              <Link key={request.id} href={`/requests/${request.id}`} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-navy">{request.requestNumber}</p>
                  <p className="text-xs text-muted-foreground">{request.location.city}</p>
                </div>
                <StatusBadge status={request.status} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
