"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CustomerHeader } from "@/components/customer/customer-header";
import { CategoryCard } from "@/components/customer/category-card";
import { ServiceCard } from "@/components/customer/service-card";
import { SearchInput } from "@/components/shared/search-input";
import { useStore } from "@farsamo/core";
import { isServiceRequestable, visibleServices } from "@farsamo/core";

const HOME_CATEGORIES = [
  { name: "Plumbing", color: "#F59E0B", service: "svc_plumbing" },
  { name: "Electrical", color: "#F97316", service: "svc_electrical" },
  { name: "AC Repair", color: "#EF4444", service: "svc_ac" },
  { name: "Car Repair", color: "#2563EB", service: "svc_car" },
  { name: "Phone Repair", color: "#8B5CF6", service: "svc_phone" },
  { name: "Computer", color: "#0EA5E9", service: "svc_computer" },
  { name: "Cleaning", color: "#10B981", service: "svc_cleaning" },
  { name: "Painting", color: "#EC4899", service: "svc_painting" },
];

export default function HomePage() {
  const store = useStore();
  const [query, setQuery] = useState("");
  const services = useMemo(() => visibleServices(store), [store]);
  const filtered = services.filter(
    (service) =>
      isServiceRequestable(service, store.categories) &&
      `${service.name} ${service.shortDescription}`.toLowerCase().includes(query.toLowerCase()),
  );
  const popular = filtered.filter((service) => service.isPopular);
  const featured = filtered.filter((service) => service.isFeatured);
  const recentIds = [...store.requests]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((request) => request.serviceId);
  const recent = filtered.filter((service) => recentIds.includes(service.id)).slice(0, 4);

  return (
    <div className="space-y-5">
      <CustomerHeader />
      <SearchInput value={query} onChange={setQuery} placeholder="What service do you need?" />
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#60a5fa] p-5 text-white">
        <p className="max-w-[70%] text-lg font-semibold leading-snug">Trusted help, right at your door.</p>
        <p className="mt-1 max-w-[75%] text-xs text-white/80">Request a service. Our team assigns the right provider.</p>
        <div className="absolute right-3 bottom-0 text-6xl opacity-30">🛠️</div>
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-bold text-navy">Categories</h2>
          <Link href="/categories" className="text-sm font-medium text-action">
            See all
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {HOME_CATEGORIES.map((category) => (
            <CategoryCard
              key={category.name}
              name={category.name}
              color={category.color}
              href={`/services/${category.service}`}
            />
          ))}
          <CategoryCard name="More" color="#64748B" href="/categories" />
        </div>
      </section>
      <ServiceRow title="Popular Services" href="/services?filter=popular" items={popular} />
      <ServiceRow title="Featured Services" href="/services?filter=featured" items={featured} />
      <ServiceRow title="Recently Requested" href="/services" items={recent} />
    </div>
  );
}

function ServiceRow({
  title,
  href,
  items,
}: {
  title: string;
  href: string;
  items: ReturnType<typeof visibleServices>;
}) {
  if (!items.length) return null;
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-bold text-navy">{title}</h2>
        <Link href={href} className="text-sm font-medium text-action">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.slice(0, 4).map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
