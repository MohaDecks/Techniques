"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ImageGallery } from "@/components/shared/image-gallery";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ProviderAssignmentModal } from "@/components/admin/provider-assignment-modal";
import { RequestTimeline } from "@/components/shared/request-timeline";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { REQUEST_STATUSES } from "@farsamo/core";
import { formatDateTime, formatPhone } from "@farsamo/core";
import { useStore } from "@farsamo/core";
import type { RequestStatus } from "@farsamo/core";

export default function AdminRequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { requests, users, services, providers, updateRequestStatus, addAdminNote } = useStore();
  const request = requests.find((item) => item.id === id);
  const [note, setNote] = useState("");
  const [assignOpen, setAssignOpen] = useState(false);
  if (!request) return <p>Request not found.</p>;

  const customer = users.find((user) => user.id === request.customerId);
  const service = services.find((item) => item.id === request.serviceId);
  const provider = providers.find((item) => item.id === request.assignedProviderId);

  return (
    <div className="space-y-5">
      <PageHeader
        title={request.requestNumber}
        description={`${customer?.fullName} · ${service?.name}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" render={<Link href="/requests" />} className="rounded-xl">
              Back
            </Button>
            <Button className="rounded-xl" onClick={() => setAssignOpen(true)}>
              Assign provider
            </Button>
          </div>
        }
      />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="app-card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-navy">Customer request</h2>
              <StatusBadge status={request.status} />
            </div>
            <p className="text-sm leading-6 text-slate-600">{request.description}</p>
            <ImageGallery images={request.images} />
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <p><span className="text-muted-foreground">Location:</span> {request.location.address}, {request.location.area}, {request.location.city}</p>
              <p><span className="text-muted-foreground">Preferred:</span> {request.preferredDate} · {request.preferredTime}</p>
              <p><span className="text-muted-foreground">Phone:</span> {formatPhone(request.phone)}</p>
              <p><span className="text-muted-foreground">Created:</span> {formatDateTime(request.createdAt)}</p>
            </div>
            {request.notes ? <p className="text-sm"><span className="text-muted-foreground">Notes:</span> {request.notes}</p> : null}
          </div>
          <div className="app-card p-5">
            <h2 className="mb-3 font-semibold text-navy">Internal notes</h2>
            <div className="space-y-2">
              {request.adminNotes.map((item) => (
                <div key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm">
                  <p>{item.message}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p>
                </div>
              ))}
            </div>
            <Textarea className="mt-3 rounded-xl" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add an internal note" />
            <Button
              className="mt-2 rounded-xl"
              onClick={() => {
                if (!note.trim()) return;
                addAdminNote(request.id, note);
                setNote("");
              }}
            >
              Save note
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="app-card p-5">
            <h2 className="mb-3 font-semibold text-navy">Update status</h2>
            <div className="flex flex-wrap gap-2">
              {REQUEST_STATUSES.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={request.status === status ? "default" : "outline"}
                  onClick={() => updateRequestStatus(request.id, status as RequestStatus)}
                >
                  {status.replaceAll("_", " ")}
                </Button>
              ))}
            </div>
          </div>
          <div className="app-card p-5">
            <h2 className="mb-3 font-semibold text-navy">Assigned provider</h2>
            {provider ? (
              <div>
                <p className="font-semibold text-navy">{provider.fullName}</p>
                <p className="text-sm text-muted-foreground">{provider.profession} · {provider.city}</p>
                <p className="text-sm">{formatPhone(provider.phone)}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No provider assigned yet.</p>
            )}
          </div>
          <div className="app-card p-5">
            <RequestTimeline status={request.status} />
          </div>
        </div>
      </div>
      <ProviderAssignmentModal requestId={request.id} open={assignOpen} onOpenChange={setAssignOpen} />
    </div>
  );
}
