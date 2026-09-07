"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ETHIOPIAN_CITIES, LOCALES } from "@farsamo/core";
import { useStore } from "@farsamo/core";
import type { LocaleCode } from "@farsamo/core";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { currentUser, settings, updateSettings, updateProfile } = useStore();
  const [fullName, setFullName] = useState(currentUser?.fullName ?? "");
  const [city, setCity] = useState(currentUser?.city ?? settings.defaultCity);
  const [area, setArea] = useState(currentUser?.area ?? "");

  return (
    <div className="space-y-5">
      <header className="flex items-center gap-2">
        <Link href="/profile" className="rounded-full p-2 hover:bg-slate-100">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-lg font-bold text-navy">Settings</h1>
      </header>
      <div className="space-y-3">
        <div className="space-y-2">
          <Label>Full name</Label>
          <Input className="app-input" value={fullName} onChange={(event) => setFullName(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>City</Label>
          <Select
            value={ETHIOPIAN_CITIES.find((item) => item.name === city)?.id ?? "jigjiga"}
            onValueChange={(value) => {
              const match = ETHIOPIAN_CITIES.find((item) => item.id === value);
              if (match) {
                setCity(match.name);
                updateProfile({ city: match.name, region: match.region });
              }
            }}
          >
            <SelectTrigger className="app-input w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ETHIOPIAN_CITIES.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Area</Label>
          <Input className="app-input" value={area} onChange={(event) => setArea(event.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Language</Label>
          <Select value={settings.locale} onValueChange={(value) => updateSettings({ locale: value as LocaleCode })}>
            <SelectTrigger className="app-input w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LOCALES.map((locale) => (
                <SelectItem key={locale.code} value={locale.code}>
                  {locale.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
          <div>
            <p className="font-medium text-navy">Notifications</p>
            <p className="text-xs text-muted-foreground">Request updates and reminders</p>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
          />
        </div>
        <Button
          className="h-12 w-full rounded-xl"
          onClick={() => {
            updateProfile({ fullName, city, area });
            toast.success("Settings saved");
          }}
        >
          Save changes
        </Button>
      </div>
    </div>
  );
}
