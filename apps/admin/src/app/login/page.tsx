"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEMO_ADMIN } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function AdminLoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [identifier, setIdentifier] = useState(DEMO_ADMIN.email);
  const [password, setPassword] = useState(DEMO_ADMIN.password);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const user = login(identifier, password);
    if (!user || user.role !== "admin") {
      toast.error("Admin credentials were not recognized.");
      return;
    }
    router.replace("/");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-navy p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold text-navy">Admin Portal</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review requests, assign providers, and manage the marketplace.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input className="app-input" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input className="app-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <Button type="submit" className="h-12 w-full rounded-xl">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
