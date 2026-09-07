export type UserRole = "customer" | "admin";
export type UserStatus = "active" | "inactive" | "blocked";

export type ProviderStatus = "pending" | "approved" | "suspended" | "rejected";
export type ProviderAvailability = "available" | "busy" | "offline";

export type RequestStatus =
  | "pending"
  | "under_review"
  | "provider_assigned"
  | "on_the_way"
  | "service_started"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type NotificationAudience = "customer" | "admin";
export type MediaKind = "service" | "category" | "provider" | "banner" | "request";
export type LocaleCode = "en" | "am" | "so" | "om";

export interface LocationInfo {
  region: string;
  city: string;
  area: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface User {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  city: string;
  region: string;
  area?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface ServiceProvider {
  id: string;
  fullName: string;
  phone: string;
  avatarUrl?: string;
  profession: string;
  skills: string[];
  description: string;
  experienceYears: number;
  city: string;
  region: string;
  address: string;
  serviceArea: string;
  status: ProviderStatus;
  availability: ProviderAvailability;
  rating: number;
  completedJobs: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  imageUrl?: string;
  isEnabled: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  startingPrice: number;
  estimatedTime: string;
  images: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  isPopular: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNote {
  id: string;
  requestId: string;
  authorId: string;
  message: string;
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  customerId: string;
  serviceId: string;
  description: string;
  images: string[];
  location: LocationInfo;
  preferredDate: string;
  preferredTime: string;
  phone: string;
  notes?: string;
  status: RequestStatus;
  assignedProviderId?: string;
  adminNotes: AdminNote[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  requestId: string;
  customerId: string;
  serviceId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  audience: NotificationAudience;
  userId?: string;
  title: string;
  message: string;
  requestId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  kind: MediaKind;
  name: string;
  url: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Payment {
  id: string;
  requestId: string;
  customerId: string;
  amount: number;
  currency: "ETB";
  status: PaymentStatus;
  method: string;
  createdAt: string;
}

export interface AppSettings {
  locale: LocaleCode;
  defaultCity: string;
  defaultRegion: string;
  notificationsEnabled: boolean;
}

export interface AppState {
  users: User[];
  providers: ServiceProvider[];
  categories: Category[];
  services: Service[];
  requests: ServiceRequest[];
  reviews: Review[];
  notifications: AppNotification[];
  media: MediaItem[];
  payments: Payment[];
  settings: AppSettings;
  currentUserId: string | null;
}

export interface SubmitRequestInput {
  serviceId: string;
  description: string;
  images: string[];
  location: LocationInfo;
  preferredDate: string;
  preferredTime: string;
  phone: string;
  notes?: string;
}

export interface ServiceInput {
  name: string;
  categoryId: string;
  description: string;
  shortDescription: string;
  startingPrice: number;
  estimatedTime: string;
  images: string[];
  isAvailable: boolean;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface ProviderInput {
  fullName: string;
  phone: string;
  avatarUrl?: string;
  profession: string;
  skills: string[];
  description: string;
  experienceYears: number;
  city: string;
  region: string;
  address: string;
  serviceArea: string;
  status: ProviderStatus;
  availability: ProviderAvailability;
}

export interface CategoryInput {
  name: string;
  description: string;
  icon: string;
  color: string;
  imageUrl?: string;
  isEnabled: boolean;
}
