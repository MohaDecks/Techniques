"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@farsamo/core";

export default function RequestConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const { requests } = useStore();
  const request = requests.find((item) => item.id === id);
  if (!request) return null;

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <CheckCircle2 className="size-16 text-brand" />
      <h1 className="mt-4 text-2xl font-bold text-navy">Request Submitted</h1>
      <p className="mt-2 text-sm font-semibold text-action">{request.requestNumber}</p>
      <p className="mt-1 text-sm text-amber-700">Pending</p>
      <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
        Your request has been received. Our team will review your request and assign a suitable service provider.
      </p>
      <div className="mt-6 flex w-full flex-col gap-2">
        <Button render={<Link href={`/requests/${request.id}/track`} />} className="h-12 rounded-xl">
          Track request
        </Button>
        <Button render={<Link href={`/requests/${request.id}`} />} variant="outline" className="h-12 rounded-xl">
          View request
        </Button>
      </div>
    </div>
  );
}
