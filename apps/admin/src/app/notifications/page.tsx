"use client";

import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function AdminNotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const items = notifications.filter((item) => item.audience === "admin");

  return (
    <div className="space-y-3">
      <PageHeader
        title="Notifications"
        actions={
          <Button variant="outline" onClick={() => markAllNotificationsRead("admin")}>
            Mark all read
          </Button>
        }
      />
      {items.length ? (
        <div className="space-y-1.5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.requestId ? `/requests/${item.requestId}` : "/notifications"}
              onClick={() => markNotificationRead(item.id)}
              className={`app-card block px-3 py-2.5 ${item.isRead ? "opacity-70" : ""}`}
            >
              <p className="text-sm font-semibold text-navy">{item.title}</p>
              <p className="mt-0.5 text-sm text-slate-600">{item.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(item.createdAt)}</p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="No admin notifications" />
      )}
    </div>
  );
}
