"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import { LoadingState } from "@/components/shared/loading-state";
import { ChevronLeft } from "lucide-react";
import { ServiceCard } from "@/components/customer/service-card";
import { FilterChip, FilterPanel } from "@/components/shared/filter-panel";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { useStore } from "@farsamo/core";
import { visibleServices } from "@farsamo/core";

export default function ServicesPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ServicesPageContent />
    </Suspense>
  );
}

function ServicesPageContent() {
  const store = useStore();
  const params = useSearchParams();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(params.get("category") ?? "all");
  const filter = params.get("filter");

  const services = useMemo(() => {
    let items = visibleServices(store);
    if (filter === "popular") items = items.filter((item) => item.isPopular);
    if (filter === "featured") items = items.filter((item) => item.isFeatured);
    if (categoryId !== "all") items = items.filter((item) => item.categoryId === categoryId);
    if (query) items = items.filter((item) => `${item.name} ${item.shortDescription}`.toLowerCase().includes(query.toLowerCase()));
    return items;
  }, [store, filter, categoryId, query]);

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <Link href="/home" className="rounded-full p-2 hover:bg-slate-100">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-bold text-navy">Services</h1>
      </header>
      <SearchInput value={query} onChange={setQuery} placeholder="Search services" />
      <FilterPanel>
        <FilterChip active={categoryId === "all"} onClick={() => setCategoryId("all")}>
          All
        </FilterChip>
        {store.categories.filter((category) => category.isEnabled).map((category) => (
          <FilterChip key={category.id} active={categoryId === category.id} onClick={() => setCategoryId(category.id)}>
            {category.name}
          </FilterChip>
        ))}
      </FilterPanel>
      <div className="space-y-3">
        {services.length ? (
          services.map((service) => <ServiceCard key={service.id} service={service} variant="row" />)
        ) : (
          <EmptyState title="No services match this search" />
        )}
      </div>
    </div>
  );
}
