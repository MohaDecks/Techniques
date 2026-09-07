"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { ServiceForm } from "@/components/admin/service-form";
import { useStore } from "@farsamo/core";

export default function EditServicePage() {
  const { id } = useParams<{ id: string }>();
  const { services } = useStore();
  const service = services.find((item) => item.id === id);
  if (!service) return <p>Service not found.</p>;

  return (
    <div>
      <PageHeader title={`Edit ${service.name}`} />
      <ServiceForm service={service} />
    </div>
  );
}
