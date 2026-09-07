import { PageHeader } from "@/components/shared/page-header";
import { ServiceForm } from "@/components/admin/service-form";

export default function NewServicePage() {
  return (
    <div>
      <PageHeader title="Add Service" description="This service will appear in the customer app when it is available." />
      <ServiceForm />
    </div>
  );
}
