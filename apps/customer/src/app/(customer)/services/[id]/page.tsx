"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Clock, Star, Wallet } from "lucide-react";
import { ImageGallery } from "@/components/shared/image-gallery";
import { AvailabilityBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@farsamo/core";
import { isServiceRequestable } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function ServiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { services, categories, reviews } = useStore();
  const service = services.find((item) => item.id === id);
  if (!service) return <p className="pt-10 text-center text-sm text-muted-foreground">Service not found.</p>;

  const canRequest = isServiceRequestable(service, categories);
  const serviceReviews = reviews.filter((review) => review.serviceId === service.id);

  return (
    <div className="-mx-4 -mt-4">
      <div className="relative h-56 bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.images[0]} alt={service.name} className="h-full w-full object-cover" />
        <Link href="/services" className="absolute top-4 left-4 rounded-full bg-white/90 p-2 shadow">
          <ChevronLeft className="size-5" />
        </Link>
      </div>
      <div className="space-y-4 px-4 pt-4 pb-28">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-navy">{service.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              {service.rating} ({service.reviewCount} reviews)
            </p>
          </div>
          <AvailabilityBadge available={canRequest} />
        </div>
        <p className="text-sm leading-6 text-slate-600">{service.description}</p>
        <div className="app-card space-y-3 p-4 text-sm">
          <p className="flex items-center gap-2">
            <Wallet className="size-4 text-action" />
            Starting from {formatPrice(service.startingPrice)}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="size-4 text-action" />
            Service time: {service.estimatedTime}
          </p>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold text-navy">Photos</h2>
          </div>
          <ImageGallery images={service.images} />
        </div>
        {serviceReviews.length ? (
          <div className="space-y-2">
            <h2 className="font-semibold text-navy">Reviews</h2>
            {serviceReviews.map((review) => (
              <div key={review.id} className="app-card p-3 text-sm">
                <p className="font-medium text-navy">{review.rating} / 5</p>
                <p className="mt-1 text-slate-600">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="fixed right-0 bottom-16 left-0 mx-auto max-w-md px-4 pb-4 md:bottom-6">
        {canRequest ? (
          <Button render={<Link href={`/services/${service.id}/request`} />} className="h-12 w-full rounded-xl text-base">
            Request Service
          </Button>
        ) : (
          <Button disabled className="h-12 w-full rounded-xl text-base">
            Currently Unavailable
          </Button>
        )}
      </div>
    </div>
  );
}
