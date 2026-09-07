import type { LocaleCode, RequestStatus } from "./types";

export const APP_NAME = "Farsamo";
export const APP_TAGLINE = "All Services in One Place";
export const CURRENCY = "ETB";
export const PHONE_PREFIX = "+251";
export const STORAGE_KEY = "farsamo-store-v1";
export const CUSTOMER_SESSION_KEY = "farsamo-customer-session";
export const ADMIN_SESSION_KEY = "farsamo-admin-session";
export const CUSTOMER_APP_URL = process.env.NEXT_PUBLIC_CUSTOMER_URL ?? "http://localhost:1010";
export const ADMIN_APP_URL = process.env.NEXT_PUBLIC_ADMIN_URL ?? "http://localhost:2020";
export const MONGO_DB_NAME = process.env.MONGODB_DB_NAME ?? "techni";

export const ETHIOPIAN_CITIES = [
  { id: "jigjiga", name: "Jigjiga", region: "Somali" },
  { id: "addis-ababa", name: "Addis Ababa", region: "Addis Ababa" },
  { id: "dire-dawa", name: "Dire Dawa", region: "Dire Dawa" },
  { id: "harar", name: "Harar", region: "Harari" },
  { id: "hawassa", name: "Hawassa", region: "Sidama" },
  { id: "bahir-dar", name: "Bahir Dar", region: "Amhara" },
  { id: "mekelle", name: "Mekelle", region: "Tigray" },
  { id: "adama", name: "Adama", region: "Oromia" },
  { id: "jimma", name: "Jimma", region: "Oromia" },
  { id: "gode", name: "Gode", region: "Somali" },
] as const;

export const LOCALES: { code: LocaleCode; label: string }[] = [
  { code: "en", label: "English" },
  { code: "am", label: "አማርኛ" },
  { code: "so", label: "Soomaali" },
  { code: "om", label: "Afaan Oromo" },
];

export const REQUEST_STATUSES: RequestStatus[] = [
  "pending",
  "under_review",
  "provider_assigned",
  "on_the_way",
  "service_started",
  "completed",
  "cancelled",
];

export const TRACKING_STEPS: RequestStatus[] = [
  "pending",
  "under_review",
  "provider_assigned",
  "on_the_way",
  "service_started",
  "completed",
];

export const ACTIVE_REQUEST_STATUSES: RequestStatus[] = [
  "pending",
  "under_review",
  "provider_assigned",
  "on_the_way",
  "service_started",
];

export const DEMO_CUSTOMER = {
  phone: "912345678",
  password: "farsamo123",
};

export const DEMO_ADMIN = {
  email: "admin@farsamo.et",
  password: "admin123",
};
