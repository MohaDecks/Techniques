"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ADMIN_APP_URL, DEMO_CUSTOMER, PHONE_PREFIX } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [identifier, setIdentifier] = useState(DEMO_CUSTOMER.phone);
  const [password, setPassword] = useState(DEMO_CUSTOMER.password);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const user = login(identifier, password);
    if (!user) {
      toast.error("Check your phone or password.");
      return;
    }
    if (user.role === "admin") {
      window.location.href = ADMIN_APP_URL;
      return;
    }
    router.replace("/home");
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center">
      <Logo size="lg" />
      <h1 className="mt-8 text-2xl font-bold text-navy">Welcome back</h1>
      <p className="mt-1 text-sm text-muted-foreground">Sign in with your +251 phone number to request a service.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label>Phone or email</Label>
          <div className="flex gap-2">
            <div className="flex h-12 items-center rounded-xl bg-slate-100 px-3 text-sm font-medium text-slate-600">
              {PHONE_PREFIX}
            </div>
            <Input className="app-input" value={identifier} onChange={(event) => setIdentifier(event.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input className="app-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </div>
        <Button type="submit" className="h-12 w-full rounded-xl text-base">
          Sign in
        </Button>
      </form>
      <Button
        type="button"
        variant="outline"
        className="mt-4 h-10 w-full rounded-xl"
        onClick={() => {
          setIdentifier(DEMO_CUSTOMER.phone);
          setPassword(DEMO_CUSTOMER.password);
        }}
      >
        Demo customer
      </Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Farsamo?{" "}
        <Link href="/register" className="font-semibold text-action">
          Create account
        </Link>
      </p>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Admin portal:{" "}
        <a href={ADMIN_APP_URL} className="underline">
          {ADMIN_APP_URL}
        </a>
      </p>
    </div>
  );
}
