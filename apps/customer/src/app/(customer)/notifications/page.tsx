"use client";

import Link from "next/link";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function NotificationsPage() {
  const { notifications, currentUser, markNotificationRead, markAllNotificationsRead } = useStore();
  const items = notifications.filter((item) => item.audience === "customer" && item.userId === currentUser?.id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-navy">Notifications</h1>
        <Button variant="ghost" size="sm" onClick={() => markAllNotificationsRead("customer", currentUser?.id)}>
          Mark all read
        </Button>
      </div>
      {items.length ? (
        <div className="space-y-2">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.requestId ? `/requests/${item.requestId}` : "/notifications"}
              onClick={() => markNotificationRead(item.id)}
              className={`app-card block p-4 ${item.isRead ? "opacity-70" : ""}`}
            >
              <p className="font-semibold text-navy">{item.title}</p>
              <p className="mt-1 text-sm text-slate-600">{item.message}</p>
              <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No notifications yet" description="Updates about your requests will appear here." />
      )}
    </div>
  );
}
