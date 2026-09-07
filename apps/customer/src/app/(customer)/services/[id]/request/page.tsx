"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronLeft, MapPin } from "lucide-react";
import { ImageUploader } from "@/components/shared/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ETHIOPIAN_CITIES } from "@farsamo/core";
import { useStore } from "@farsamo/core";
import { isServiceRequestable } from "@farsamo/core";

export default function RequestServicePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { services, categories, currentUser, submitRequest } = useStore();
  const service = services.find((item) => item.id === id);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [city, setCity] = useState(currentUser?.city ?? "Jigjiga");
  const [region, setRegion] = useState(currentUser?.region ?? "Somali");
  const [area, setArea] = useState(currentUser?.area ?? "");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("2026-09-06");
  const [preferredTime, setPreferredTime] = useState("10:00");
  const [phone, setPhone] = useState(currentUser?.phone ?? "");
  const [notes, setNotes] = useState("");

  if (!service) return null;
  const selected = service;
  if (!isServiceRequestable(selected, categories)) {
    return (
      <div className="pt-10 text-center">
        <p className="font-semibold text-navy">Currently Unavailable</p>
        <Link href="/home" className="mt-3 inline-block text-sm text-action">
          Back home
        </Link>
      </div>
    );
  }

  function useCurrentLocation() {
    const match = ETHIOPIAN_CITIES.find((item) => item.name === currentUser?.city) ?? ETHIOPIAN_CITIES[0];
    setCity(match.name);
    setRegion(match.region);
    setArea(currentUser?.area ?? "Current area");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => undefined);
    }
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const request = submitRequest({
      serviceId: selected.id,
      description,
      images,
      location: { region, city, area, address },
      preferredDate,
      preferredTime,
      phone,
      notes,
    });
    if (!request?.id) return;
    router.push(`/requests/${request.id}/confirmation`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-8">
      <header className="flex items-center gap-2">
        <Link href={`/services/${selected.id}`} className="rounded-full p-2 hover:bg-slate-100">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-bold text-navy">Request {selected.name}</h1>
      </header>
      <div className="space-y-2">
        <Label>Describe your problem</Label>
        <Textarea
          className="min-h-28 rounded-xl"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Example: Water leak under the kitchen sink."
          required
        />
      </div>
      <ImageUploader value={images} onChange={setImages} kind="request" label="Add photos" />
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Service address</Label>
          <button type="button" onClick={useCurrentLocation} className="text-xs font-medium text-action">
            Use current location
          </button>
        </div>
        <div className="relative">
          <MapPin className="absolute top-3.5 left-3 size-4 text-brand" />
          <Input className="app-input pl-9" value={address} onChange={(event) => setAddress(event.target.value)} placeholder="House, street or landmark" required />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Input className="app-input" value={city} onChange={(event) => setCity(event.target.value)} placeholder="City" />
          <Input className="app-input" value={area} onChange={(event) => setArea(event.target.value)} placeholder="Area" />
        </div>
        <Input className="app-input" value={region} onChange={(event) => setRegion(event.target.value)} placeholder="Region" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label>Preferred date</Label>
          <Input className="app-input" type="date" value={preferredDate} onChange={(event) => setPreferredDate(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Preferred time</Label>
          <Input className="app-input" type="time" value={preferredTime} onChange={(event) => setPreferredTime(event.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Phone number</Label>
        <Input className="app-input" value={phone} onChange={(event) => setPhone(event.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>Notes (optional)</Label>
        <Textarea className="rounded-xl" value={notes} onChange={(event) => setNotes(event.target.value)} />
      </div>
      <Button type="submit" className="h-12 w-full rounded-xl text-base">
        Submit Request
      </Button>
    </form>
  );
}
