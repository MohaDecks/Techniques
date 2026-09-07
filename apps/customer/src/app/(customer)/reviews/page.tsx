"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { StarRating } from "@/components/shared/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useStore } from "@farsamo/core";
import { toast } from "sonner";

export default function ReviewsPage() {
  const { reviews, requests, services, currentUser, addReview } = useStore();
  const mine = reviews.filter((review) => review.customerId === currentUser?.id);
  const completed = requests.filter(
    (request) =>
      request.customerId === currentUser?.id &&
      request.status === "completed" &&
      !reviews.some((review) => review.requestId === request.id),
  );
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [requestId, setRequestId] = useState(completed[0]?.id ?? "");

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-2">
        <Link href="/profile" className="rounded-full p-2 hover:bg-slate-100">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-bold text-navy">Reviews</h1>
      </header>
      {completed.length ? (
        <div className="app-card space-y-3 p-4">
          <p className="font-semibold text-navy">Leave a review</p>
          <select
            className="app-input w-full px-3"
            value={requestId}
            onChange={(event) => setRequestId(event.target.value)}
          >
            {completed.map((request) => (
              <option key={request.id} value={request.id}>
                {services.find((service) => service.id === request.serviceId)?.name} · {request.requestNumber}
              </option>
            ))}
          </select>
          <StarRating value={rating} onChange={setRating} size="md" />
          <Textarea
            className="rounded-xl"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="How was the service?"
          />
          <Button
            className="w-full rounded-xl"
            onClick={() => {
              const request = completed.find((item) => item.id === requestId);
              if (!request || !currentUser) return;
              addReview({
                requestId: request.id,
                customerId: currentUser.id,
                serviceId: request.serviceId,
                rating,
                comment,
              });
              setComment("");
              toast.success("Review submitted");
            }}
          >
            Submit review
          </Button>
        </div>
      ) : null}
      {mine.length ? (
        <div className="space-y-2">
          {mine.map((review) => (
            <div key={review.id} className="app-card p-4">
              <p className="font-semibold text-navy">{services.find((service) => service.id === review.serviceId)?.name}</p>
              <StarRating value={review.rating} />
              <p className="mt-2 text-sm text-slate-600">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState title="You have not reviewed a service yet." />
      )}
    </div>
  );
}
