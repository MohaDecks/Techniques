"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { DataTable } from "@/components/shared/data-table";
import { ProviderStatusBadge } from "@/components/shared/status-badge";
import { ProviderCard } from "@/components/admin/provider-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@farsamo/core";
import type { ProviderInput, ProviderStatus, ServiceProvider } from "@farsamo/core";

const emptyProvider: ProviderInput = {
  fullName: "",
  phone: "",
  profession: "",
  skills: [],
  description: "",
  experienceYears: 1,
  city: "Jigjiga",
  region: "Somali",
  address: "",
  serviceArea: "Jigjiga",
  status: "pending",
  availability: "available",
};

export default function AdminProvidersPage() {
  const { providers, upsertProvider, setProviderStatus } = useStore();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceProvider | null>(null);
  const [form, setForm] = useState<ProviderInput>(emptyProvider);
  const rows = useMemo(
    () => providers.filter((item) => `${item.fullName} ${item.profession} ${item.city}`.toLowerCase().includes(query.toLowerCase())),
    [providers, query],
  );

  function openCreate() {
    setEditing(null);
    setForm(emptyProvider);
    setOpen(true);
  }

  function openEdit(provider: ServiceProvider) {
    setEditing(provider);
    setForm(provider);
    setOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Service Providers"
        description="Providers stay hidden from customers until you assign them to a request."
        actions={
          <Button onClick={openCreate} className="rounded-xl">
            Add Provider
          </Button>
        }
      />
      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} placeholder="Search providers" className="max-w-sm" />
      </div>
      <DataTable
        rows={rows}
        columns={[
          { key: "name", header: "Name", render: (row) => <span className="font-medium text-navy">{row.fullName}</span> },
          { key: "profession", header: "Profession", render: (row) => row.profession },
          { key: "city", header: "City", render: (row) => row.city },
          { key: "status", header: "Status", render: (row) => <ProviderStatusBadge status={row.status} /> },
          { key: "availability", header: "Availability", render: (row) => <span className="capitalize">{row.availability}</span> },
          {
            key: "actions",
            header: "Actions",
            render: (row) => (
              <div className="flex flex-wrap gap-1" onClick={(event) => event.stopPropagation()}>
                <Button size="xs" variant="outline" onClick={() => openEdit(row)}>
                  Edit
                </Button>
                {(["approved", "rejected", "suspended", "pending"] as ProviderStatus[]).map((status) => (
                  <Button key={status} size="xs" variant="outline" onClick={() => setProviderStatus(row.id, status)}>
                    {status === "approved" ? "Approve" : status === "rejected" ? "Reject" : status === "suspended" ? "Suspend" : "Pending"}
                  </Button>
                ))}
              </div>
            ),
          },
        ]}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit provider" : "Add provider"}</DialogTitle>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              upsertProvider(form, editing?.id);
              setOpen(false);
            }}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Full name" value={form.fullName} onChange={(value) => setForm({ ...form, fullName: value })} />
              <Field label="Phone" value={form.phone} onChange={(value) => setForm({ ...form, phone: value })} />
              <Field label="Profession" value={form.profession} onChange={(value) => setForm({ ...form, profession: value })} />
              <Field label="City" value={form.city} onChange={(value) => setForm({ ...form, city: value })} />
              <Field label="Region" value={form.region} onChange={(value) => setForm({ ...form, region: value })} />
              <Field label="Service area" value={form.serviceArea} onChange={(value) => setForm({ ...form, serviceArea: value })} />
            </div>
            <Field label="Address" value={form.address} onChange={(value) => setForm({ ...form, address: value })} />
            <Field
              label="Skills (comma separated)"
              value={form.skills.join(", ")}
              onChange={(value) => setForm({ ...form, skills: value.split(",").map((item) => item.trim()).filter(Boolean) })}
            />
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea className="rounded-xl" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
            </div>
            <Button type="submit" className="w-full rounded-xl">
              Save provider
            </Button>
          </form>
          {editing ? (
            <div className="pt-2">
              <ProviderCard provider={editing} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input className="app-input" value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}
