"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploader } from "@/components/shared/image-uploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@farsamo/core";
import type { Service } from "@farsamo/core";

export function ServiceForm({ service }: { service?: Service }) {
  const { categories, upsertService } = useStore();
  const router = useRouter();
  const [name, setName] = useState(service?.name ?? "");
  const [categoryId, setCategoryId] = useState(service?.categoryId ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(service?.description ?? "");
  const [shortDescription, setShortDescription] = useState(service?.shortDescription ?? "");
  const [startingPrice, setStartingPrice] = useState(String(service?.startingPrice ?? 300));
  const [estimatedTime, setEstimatedTime] = useState(service?.estimatedTime ?? "1-2 hours");
  const [isAvailable, setIsAvailable] = useState(service?.isAvailable ?? true);
  const [images, setImages] = useState<string[]>(service?.images ?? []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    upsertService(
      {
        name,
        categoryId,
        description,
        shortDescription: shortDescription || description.slice(0, 80),
        startingPrice: Number(startingPrice) || 0,
        estimatedTime,
        images,
        isAvailable,
        isPopular: service?.isPopular,
        isFeatured: service?.isFeatured,
      },
      service?.id,
    );
    router.push("/services");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Tabs defaultValue="basic">
        <TabsList>
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="media">Media & Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="app-card mt-4 space-y-4 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Service name</Label>
              <Input className="app-input" value={name} onChange={(event) => setName(event.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={(value) => setCategoryId(String(value ?? ""))}>
                <SelectTrigger className="app-input w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Short description</Label>
            <Input className="app-input" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea className="min-h-28 rounded-xl" value={description} onChange={(event) => setDescription(event.target.value)} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Starting price (ETB)</Label>
              <Input className="app-input" type="number" min={0} value={startingPrice} onChange={(event) => setStartingPrice(event.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Estimated time</Label>
              <Input className="app-input" value={estimatedTime} onChange={(event) => setEstimatedTime(event.target.value)} />
            </div>
          </div>
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
            <div>
              <p className="font-medium text-navy">Available in app</p>
              <p className="text-xs text-muted-foreground">Disabled services cannot be requested.</p>
            </div>
            <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
        </TabsContent>
        <TabsContent value="media" className="app-card mt-4 p-5">
          <ImageUploader value={images} onChange={setImages} kind="service" label="Service images" />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.push("/services")}>
          Cancel
        </Button>
        <Button type="submit">{service ? "Save service" : "Create service"}</Button>
      </div>
    </form>
  );
}
