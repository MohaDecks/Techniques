"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { CUSTOMER_SESSION_KEY, StoreProvider } from "@farsamo/core";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider sessionKey={CUSTOMER_SESSION_KEY}>
      <TooltipProvider>
        {children}
        <Toaster position="top-center" richColors />
      </TooltipProvider>
    </StoreProvider>
  );
}
