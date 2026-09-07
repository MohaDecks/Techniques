"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/branding/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ETHIOPIAN_CITIES, PHONE_PREFIX } from "@farsamo/core";
import { useStore } from "@farsamo/core";

export default function RegisterPage() {
  const { register } = useStore();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [cityId, setCityId] = useState("jigjiga");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const city = ETHIOPIAN_CITIES.find((item) => item.id === cityId) ?? ETHIOPIAN_CITIES[0];
    register({ fullName, phone, password, city: city.name, region: city.region });
    router.replace("/home");
  }

  return (
    <div className="flex min-h-[80vh] flex-col justify-center">
      <Logo />
      <h1 className="mt-6 text-2xl font-bold text-navy">Create your account</h1>
      <p className="mt-1 text-sm text-muted-foreground">A few details and you can request a service.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input className="app-input" value={fullName} onChange={(event) => setFullName(event.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label>Phone number</Label>
          <div className="flex gap-2">
            <div className="flex h-12 items-center rounded-xl bg-slate-100 px-3 text-sm font-medium">{PHONE_PREFIX}</div>
            <Input className="app-input" value={phone} onChange={(event) => setPhone(event.target.value)} required />
          </div>
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Select value={cityId} onValueChange={(value) => setCityId(String(value ?? "jigjiga"))}>
            <SelectTrigger className="app-input w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ETHIOPIAN_CITIES.map((city) => (
                <SelectItem key={city.id} value={city.id}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Password</Label>
          <Input className="app-input" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <Button type="submit" className="h-12 w-full rounded-xl text-base">
          Create account
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-action">
          Sign in
        </Link>
      </p>
    </div>
  );
}
