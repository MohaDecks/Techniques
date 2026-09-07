"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStore } from "@farsamo/core";

export function AdminHeader({ title }: { title?: string }) {
  const { currentUser, notifications, logout } = useStore();
  const unread = notifications.filter((item) => item.audience === "admin" && !item.isRead).length;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="lg:hidden" />}>
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="w-72 bg-navy p-0 text-white">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <h1 className="text-lg font-semibold text-navy">{title ?? "Admin Portal"}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/notifications" className="relative rounded-full p-2 hover:bg-slate-100">
          <Bell className="size-5 text-navy" />
          {unread > 0 ? (
            <span className="absolute top-1 right-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unread}
            </span>
          ) : null}
        </Link>
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-navy">{currentUser?.fullName}</p>
          <p className="text-xs text-muted-foreground">Administrator</p>
        </div>
        <Button variant="outline" size="sm" onClick={logout}>
          Sign out
        </Button>
      </div>
    </header>
  );
}
