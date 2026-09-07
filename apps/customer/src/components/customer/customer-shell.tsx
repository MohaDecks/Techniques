"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { MobileBottomNav } from "@/components/customer/mobile-bottom-nav";
import { LoadingState } from "@/components/shared/loading-state";
import { ADMIN_APP_URL, useStore } from "@farsamo/core";

const AUTH_PATHS = ["/login", "/register"];

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, hydrated } = useStore();
  const isAuth = AUTH_PATHS.includes(pathname);
  const showNav = !isAuth && pathname !== "/";

  useEffect(() => {
    if (!hydrated || isAuth || pathname === "/") return;
    if (!currentUser) {
      router.replace("/login");
      return;
    }
    if (currentUser.role === "admin") {
      window.location.href = ADMIN_APP_URL;
    }
  }, [currentUser, hydrated, isAuth, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <LoadingState label="Opening Farsamo" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#dce3ea] md:flex md:items-start md:justify-center md:py-6">
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-white shadow-xl md:min-h-[860px] md:overflow-hidden md:rounded-[28px]">
        <div className="flex-1 px-4 pt-4 pb-6">{children}</div>
        {showNav ? <MobileBottomNav /> : null}
      </div>
    </div>
  );
}
