"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ETHIOPIAN_CITIES, LOCALES } from "@farsamo/core";
import { useStore } from "@farsamo/core";
import type { LocaleCode } from "@farsamo/core";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { settings, updateSettings, resetSharedData } = useStore();

  return (
    <div className="max-w-xl space-y-5">
      <PageHeader title="Settings" description="Marketplace defaults. Localization can later support English, Amharic, Somali and Afaan Oromo." />
      <div className="app-card space-y-4 p-5">
        <div className="space-y-2">
          <Label>Default city</Label>
          <Select
            value={ETHIOPIAN_CITIES.find((item) => item.name === settings.defaultCity)?.id ?? "jigjiga"}
            onValueChange={(value) => {
              const city = ETHIOPIAN_CITIES.find((item) => item.id === value);
              if (city) updateSettings({ defaultCity: city.name, defaultRegion: city.region });
            }}
          >
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
          <Label>Default language</Label>
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
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-navy">Customer notifications</p>
            <p className="text-xs text-muted-foreground">Send request status updates</p>
          </div>
          <Switch
            checked={settings.notificationsEnabled}
            onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
          />
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={async () => {
            await resetSharedData();
            toast.success("Shared demo data reset.");
          }}
        >
          Reset demo data
        </Button>
      </div>
    </div>
  );
}
