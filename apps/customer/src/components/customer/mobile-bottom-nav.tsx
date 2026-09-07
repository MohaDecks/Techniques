"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ClipboardList, Home, UserRound } from "lucide-react";
import { useStore } from "@farsamo/core";
import { cn } from "@/lib/utils";

const items = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/requests", label: "Requests", icon: ClipboardList },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { notifications, currentUser } = useStore();
  const unread = notifications.filter(
    (item) => item.audience === "customer" && item.userId === currentUser?.id && !item.isRead,
  ).length;

  return (
    <nav className="sticky bottom-0 z-20 border-t border-black/5 bg-white/95 pb-safe backdrop-blur">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium",
                active ? "text-action" : "text-slate-400",
              )}
            >
              <Icon className="size-5" />
              {item.href === "/notifications" && unread > 0 ? (
                <span className="absolute top-1.5 right-[28%] size-2 rounded-full bg-red-500" />
              ) : null}
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
