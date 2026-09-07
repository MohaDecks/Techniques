"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CategoryCard } from "@/components/customer/category-card";
import { useStore } from "@farsamo/core";

export default function CategoriesPage() {
  const { categories } = useStore();

  return (
    <div className="space-y-4">
      <header className="flex items-center gap-2">
        <Link href="/home" className="rounded-full p-2 hover:bg-slate-100">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-bold text-navy">Service categories</h1>
      </header>
      <div className="grid grid-cols-2 gap-3">
        {categories.filter((category) => category.isEnabled).map((category) => (
          <CategoryCard
            key={category.id}
            name={category.name}
            color={category.color}
            href={`/services?category=${category.id}`}
          />
        ))}
      </div>
    </div>
  );
}
