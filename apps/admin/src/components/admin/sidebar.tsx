"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  ClipboardList,
  CreditCard,
  FolderTree,
  ImageIcon,
  LayoutDashboard,
  MessageSquareText,
  Package,
  Settings,
  Star,
  Users,
  UserCog,
  BarChart3,
  Wrench,
} from "lucide-react";
import { Logo } from "@/components/branding/logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/providers", label: "Service Providers", icon: UserCog },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/requests", label: "Service Requests", icon: ClipboardList },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/media", label: "Media Library", icon: ImageIcon },
  { href: "/reviews", label: "Reviews", icon: Star },
  { href: "/payments", label: "Payments", icon: CreditCard },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex h-full w-64 shrink-0 flex-col bg-navy text-white", className)}>
      <div className="px-5 py-6">
        <Logo inverted />
      </div>
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {nav.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active ? "bg-action text-white" : "text-slate-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="shrink-0 border-t border-white/10 px-5 py-3 text-xs text-slate-400">
        <MessageSquareText className="mb-1 size-4" />
        Admin-managed marketplace
      </div>
    </aside>
  );
}
