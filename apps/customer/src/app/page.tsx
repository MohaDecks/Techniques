"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Logo } from "@/components/branding/logo";
import { ADMIN_APP_URL, useStore } from "@farsamo/core";

export default function SplashPage() {
  const router = useRouter();
  const { currentUser, hydrated } = useStore();

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setTimeout(() => {
      if (currentUser?.role === "admin") window.location.href = ADMIN_APP_URL;
      else if (currentUser) router.replace("/home");
      else router.replace("/login");
    }, 1400);
    return () => window.clearTimeout(timer);
  }, [currentUser, hydrated, router]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-white">
      <Logo size="lg" />
      <div className="mt-8 h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-brand" />
      </div>
    </div>
  );
}
