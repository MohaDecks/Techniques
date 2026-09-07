"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AdminFooter } from "@/components/admin/admin-footer";
import { LoadingState } from "@/components/shared/loading-state";
import { useStore } from "@farsamo/core";

export function AdminShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const { currentUser, hydrated } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  useEffect(() => {
    if (!hydrated || isLogin) return;
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (currentUser.role !== "admin") {
      router.replace("/login");
    }
  }, [currentUser, hydrated, isLogin, router]);

  if (isLogin) return <>{children}</>;

  if (!hydrated || !currentUser || currentUser.role !== "admin") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoadingState label="Opening admin portal" />
      </div>
    );
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-surface">
      <AdminSidebar className="hidden h-dvh lg:flex" />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <AdminHeader title={title} />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>
        <AdminFooter />
      </div>
    </div>
  );
}
