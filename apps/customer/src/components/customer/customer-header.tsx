"use client";

import Link from "next/link";
import { Bell, ChevronDown, MapPin, UserRound } from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { useStore } from "@farsamo/core";

export function CustomerHeader() {
  const { currentUser, notifications, settings } = useStore();
  const unread = notifications.filter(
    (item) => item.audience === "customer" && item.userId === currentUser?.id && !item.isRead,
  ).length;

  return (
    <header className="flex items-center justify-between gap-3 pt-safe">
      <Logo size="sm" />
      <Link href="/settings" className="flex min-w-0 items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-navy">
        <MapPin className="size-3.5 text-brand" />
        <span className="truncate">{currentUser?.city ?? settings.defaultCity}</span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </Link>
      <div className="flex items-center gap-1.5">
        <Link href="/notifications" className="relative rounded-full p-2 hover:bg-slate-100">
          <Bell className="size-5 text-navy" />
          {unread > 0 ? <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-red-500" /> : null}
        </Link>
        <Link href="/profile" className="rounded-full p-2 hover:bg-slate-100">
          <UserRound className="size-5 text-navy" />
        </Link>
      </div>
    </header>
  );
}
