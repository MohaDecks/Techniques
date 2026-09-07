"use client";

import Link from "next/link";
import { ChevronRight, LogOut, Settings, Star } from "lucide-react";
import { formatPhone } from "@farsamo/core";
import { useStore } from "@farsamo/core";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { currentUser, logout, requests } = useStore();
  const mine = requests.filter((request) => request.customerId === currentUser?.id);

  return (
    <div className="space-y-5">
      <div className="app-card flex items-center gap-3 p-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
          {currentUser?.fullName.slice(0, 1)}
        </div>
        <div>
          <p className="text-lg font-bold text-navy">{currentUser?.fullName}</p>
          <p className="text-sm text-muted-foreground">{formatPhone(currentUser?.phone ?? "")}</p>
          <p className="text-xs text-muted-foreground">
            {currentUser?.city}, {currentUser?.region}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="app-card p-3">
          <p className="text-lg font-bold text-navy">{mine.length}</p>
          <p className="text-xs text-muted-foreground">Requests</p>
        </div>
        <div className="app-card p-3">
          <p className="text-lg font-bold text-navy">{mine.filter((item) => item.status === "completed").length}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="app-card p-3">
          <p className="text-lg font-bold text-navy">{mine.filter((item) => item.status === "pending").length}</p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
      </div>
      <div className="app-card divide-y">
        <Link href="/settings" className="flex items-center justify-between p-4">
          <span className="flex items-center gap-2 font-medium text-navy">
            <Settings className="size-4" /> Settings
          </span>
          <ChevronRight className="size-4 text-slate-400" />
        </Link>
        <Link href="/reviews" className="flex items-center justify-between p-4">
          <span className="flex items-center gap-2 font-medium text-navy">
            <Star className="size-4" /> Reviews
          </span>
          <ChevronRight className="size-4 text-slate-400" />
        </Link>
      </div>
      <Button variant="outline" className="h-12 w-full rounded-xl" onClick={logout}>
        <LogOut className="size-4" /> Sign out
      </Button>
    </div>
  );
}
