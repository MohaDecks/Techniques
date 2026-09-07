import {
  Car,
  Droplets,
  Hammer,
  HardHat,
  House,
  MoreHorizontal,
  Paintbrush,
  Refrigerator,
  Smartphone,
  Sparkles,
  Snowflake,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Plumbing: Droplets,
  Electrical: Zap,
  "AC Repair": Snowflake,
  "Refrigerator Repair": Refrigerator,
  "Phone Repair": Smartphone,
  "Computer Repair": Wrench,
  Computer: Wrench,
  "Car Repair": Car,
  Cleaning: Sparkles,
  Painting: Paintbrush,
  Carpentry: Hammer,
  Construction: HardHat,
  "Home Services": House,
  Electronics: Smartphone,
  Vehicle: Car,
  More: MoreHorizontal,
};

export function CategoryCard({
  name,
  color,
  href,
}: {
  name: string;
  color: string;
  href: string;
}) {
  const Icon = ICONS[name] ?? House;
  return (
    <Link href={href} className="app-card flex flex-col items-center gap-2 p-3 text-center transition hover:-translate-y-0.5">
      <div
        className={cn("flex size-12 items-center justify-center rounded-2xl text-white")}
        style={{ backgroundColor: color }}
      >
        <Icon className="size-5" />
      </div>
      <p className="text-[12px] leading-tight font-semibold text-navy">{name}</p>
    </Link>
  );
}

export const categoryIconMap = ICONS;
