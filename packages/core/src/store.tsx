"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { seedState } from "./mock-data";
import { createId, nextRequestNumber } from "./ids";
import { normalizePhone } from "./format";
import type {
  AppSettings,
  AppState,
  Category,
  CategoryInput,
  LocaleCode,
  MediaItem,
  MediaKind,
  ProviderInput,
  ProviderStatus,
  RequestStatus,
  Review,
  Service,
  ServiceInput,
  ServiceProvider,
  ServiceRequest,
  SubmitRequestInput,
  User,
  UserStatus,
} from "./types";

type StoreContextValue = AppState & {
  hydrated: boolean;
  currentUser: User | null;
  locale: LocaleCode;
  login: (identifier: string, password: string) => User | null;
  register: (input: {
    fullName: string;
    phone: string;
    password: string;
    city: string;
    region: string;
  }) => User;
  logout: () => void;
  submitRequest: (input: SubmitRequestInput) => ServiceRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus) => void;
  assignProvider: (requestId: string, providerId: string) => void;
  addAdminNote: (requestId: string, message: string) => void;
  upsertService: (input: ServiceInput, id?: string) => Service;
  deleteService: (id: string) => void;
  setServiceAvailability: (id: string, isAvailable: boolean) => void;
  upsertCategory: (input: CategoryInput, id?: string) => Category;
  deleteCategory: (id: string) => void;
  upsertProvider: (input: ProviderInput, id?: string) => ServiceProvider;
  setProviderStatus: (id: string, status: ProviderStatus) => void;
  setUserStatus: (id: string, status: UserStatus) => void;
  addReview: (input: Omit<Review, "id" | "createdAt">) => Review;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (audience: "customer" | "admin", userId?: string) => void;
  addMedia: (input: Omit<MediaItem, "id" | "createdAt"> & { id?: string; createdAt?: string }) => MediaItem;
  setMediaActive: (id: string, isActive: boolean) => void;
  deleteMedia: (id: string) => void;
  indexLooseImages: () => void;
  updateSettings: (patch: Partial<AppSettings>) => void;
  updateProfile: (patch: Partial<Pick<User, "fullName" | "city" | "region" | "area" | "avatarUrl">>) => void;
  resetSharedData: () => Promise<void>;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function sharedPayload(state: AppState): AppState {
  return { ...state, currentUserId: null };
}

async function fetchShared(): Promise<AppState> {
  const response = await fetch("/api/store", { cache: "no-store" });
  if (!response.ok) throw new Error("store");
  return response.json() as Promise<AppState>;
}

function persistShared(state: AppState) {
  void fetch("/api/store", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sharedPayload(state)),
  });
}

export function StoreProvider({
  children,
  sessionKey,
}: {
  children: React.ReactNode;
  sessionKey: string;
}) {
  const [state, setState] = useState<AppState>(seedState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sessionId = window.localStorage.getItem(sessionKey);
    void fetchShared()
      .then((shared) => {
        setState({ ...shared, currentUserId: sessionId });
      })
      .catch(() => {
        setState((prev) => ({ ...prev, currentUserId: sessionId }));
      })
      .finally(() => setHydrated(true));

    const refresh = () => {
      void fetchShared()
        .then((shared) => {
          setState((prev) => ({ ...shared, currentUserId: prev.currentUserId }));
        })
        .catch(() => undefined);
    };
    const timer = window.setInterval(refresh, 4000);
    window.addEventListener("focus", refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
    };
  }, [sessionKey]);

  const commit = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      persistShared(next);
      return next;
    });
  }, []);

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  );

  const login = useCallback(
    (identifier: string, password: string) => {
      const normalized = identifier.includes("@")
        ? identifier.trim().toLowerCase()
        : normalizePhone(identifier);
      const user = state.users.find((item) => {
        const phoneMatch = normalizePhone(item.phone) === normalized;
        const emailMatch = item.email?.toLowerCase() === normalized;
        return (phoneMatch || emailMatch) && item.password === password && item.status === "active";
      });
      if (!user) return null;
      window.localStorage.setItem(sessionKey, user.id);
      commit((prev) => ({ ...prev, currentUserId: user.id }));
      return user;
    },
    [commit, sessionKey, state.users],
  );

  const register = useCallback(
    (input: { fullName: string; phone: string; password: string; city: string; region: string }) => {
      const user: User = {
        id: createId("user"),
        fullName: input.fullName,
        phone: normalizePhone(input.phone),
        password: input.password,
        role: "customer",
        status: "active",
        city: input.city,
        region: input.region,
        createdAt: new Date().toISOString(),
      };
      window.localStorage.setItem(sessionKey, user.id);
      commit((prev) => ({
        ...prev,
        users: [user, ...prev.users],
        currentUserId: user.id,
      }));
      return user;
    },
    [commit, sessionKey],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(sessionKey);
    commit((prev) => ({ ...prev, currentUserId: null }));
  }, [commit, sessionKey]);

  const resetSharedData = useCallback(async () => {
    const response = await fetch("/api/store", { method: "DELETE" });
    const shared = (await response.json()) as AppState;
    setState((prev) => ({ ...shared, currentUserId: prev.currentUserId }));
  }, []);

  const submitRequest = useCallback(
    (input: SubmitRequestInput) => {
      const createdAt = new Date().toISOString();
      const created: ServiceRequest = {
        id: createId("req"),
        requestNumber: nextRequestNumber(state.requests),
        customerId: state.currentUserId ?? "user_guest",
        serviceId: input.serviceId,
        description: input.description,
        images: input.images,
        location: input.location,
        preferredDate: input.preferredDate,
        preferredTime: input.preferredTime,
        phone: normalizePhone(input.phone),
        notes: input.notes,
        status: "pending",
        adminNotes: [],
        createdAt,
        updatedAt: createdAt,
      };
      const customer = state.users.find((user) => user.id === state.currentUserId);
      const service = state.services.find((item) => item.id === input.serviceId);
      commit((prev) => ({
        ...prev,
        requests: [created, ...prev.requests],
        notifications: [
          {
            id: createId("ntf"),
            audience: "customer",
            userId: prev.currentUserId ?? undefined,
            title: "Request received",
            message: `${created.requestNumber} is pending review. We will assign a provider shortly.`,
            requestId: created.id,
            isRead: false,
            createdAt,
          },
          {
            id: createId("ntf"),
            audience: "admin",
            title: "New service request",
            message: `${customer?.fullName ?? "A customer"} submitted a ${service?.name ?? "service"} request in ${input.location.city}.`,
            requestId: created.id,
            isRead: false,
            createdAt,
          },
          ...prev.notifications,
        ],
      }));
      return created;
    },
    [commit, state.currentUserId, state.requests, state.services, state.users],
  );

  const updateRequestStatus = useCallback(
    (requestId: string, status: RequestStatus) => {
      const updatedAt = new Date().toISOString();
      commit((prev) => {
        const request = prev.requests.find((item) => item.id === requestId);
        if (!request) return prev;
        const payments =
          status === "completed" && !prev.payments.some((payment) => payment.requestId === requestId)
            ? [
                {
                  id: createId("pay"),
                  requestId,
                  customerId: request.customerId,
                  amount: prev.services.find((service) => service.id === request.serviceId)?.startingPrice ?? 0,
                  currency: "ETB" as const,
                  status: "paid" as const,
                  method: "Cash",
                  createdAt: updatedAt,
                },
                ...prev.payments,
              ]
            : prev.payments;
        return {
          ...prev,
          requests: prev.requests.map((item) =>
            item.id === requestId ? { ...item, status, updatedAt } : item,
          ),
          payments,
          notifications: [
            {
              id: createId("ntf"),
              audience: "customer" as const,
              userId: request.customerId,
              title: "Request updated",
              message: `${request.requestNumber} is now ${status.replaceAll("_", " ")}.`,
              requestId,
              isRead: false,
              createdAt: updatedAt,
            },
            ...prev.notifications,
          ],
        };
      });
    },
    [commit],
  );

  const assignProvider = useCallback(
    (requestId: string, providerId: string) => {
      const updatedAt = new Date().toISOString();
      commit((prev) => {
        const request = prev.requests.find((item) => item.id === requestId);
        const provider = prev.providers.find((item) => item.id === providerId);
        if (!request || !provider) return prev;
        return {
          ...prev,
          requests: prev.requests.map((item) =>
            item.id === requestId
              ? { ...item, assignedProviderId: providerId, status: "provider_assigned", updatedAt }
              : item,
          ),
          notifications: [
            {
              id: createId("ntf"),
              audience: "customer" as const,
              userId: request.customerId,
              title: "Provider assigned",
              message: `A service provider has been assigned to ${request.requestNumber}.`,
              requestId,
              isRead: false,
              createdAt: updatedAt,
            },
            ...prev.notifications,
          ],
        };
      });
    },
    [commit],
  );

  const addAdminNote = useCallback(
    (requestId: string, message: string) => {
      const createdAt = new Date().toISOString();
      commit((prev) => ({
        ...prev,
        requests: prev.requests.map((item) =>
          item.id === requestId
            ? {
                ...item,
                updatedAt: createdAt,
                adminNotes: [
                  ...item.adminNotes,
                  {
                    id: createId("note"),
                    requestId,
                    authorId: prev.currentUserId ?? "user_admin",
                    message,
                    createdAt,
                  },
                ],
              }
            : item,
        ),
      }));
    },
    [commit],
  );

  const upsertService = useCallback(
    (input: ServiceInput, id?: string) => {
      const updatedAt = new Date().toISOString();
      const existing = id ? state.services.find((item) => item.id === id) : undefined;
      const saved: Service = existing
        ? { ...existing, ...input, id: existing.id, updatedAt }
        : {
            id: createId("svc"),
            rating: 0,
            reviewCount: 0,
            isPopular: Boolean(input.isPopular),
            isFeatured: Boolean(input.isFeatured),
            createdAt: updatedAt,
            updatedAt,
            ...input,
          };
      commit((prev) => ({
        ...prev,
        services: existing
          ? prev.services.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...prev.services],
      }));
      return saved;
    },
    [commit, state.services],
  );

  const deleteService = useCallback(
    (id: string) => {
      commit((prev) => ({ ...prev, services: prev.services.filter((item) => item.id !== id) }));
    },
    [commit],
  );

  const setServiceAvailability = useCallback(
    (id: string, isAvailable: boolean) => {
      commit((prev) => ({
        ...prev,
        services: prev.services.map((item) =>
          item.id === id ? { ...item, isAvailable, updatedAt: new Date().toISOString() } : item,
        ),
      }));
    },
    [commit],
  );

  const upsertCategory = useCallback(
    (input: CategoryInput, id?: string) => {
      const createdAt = new Date().toISOString();
      const existing = id ? state.categories.find((item) => item.id === id) : undefined;
      const saved: Category = existing
        ? { ...existing, ...input, id: existing.id }
        : {
            id: createId("cat"),
            slug: input.name.toLowerCase().replace(/\s+/g, "-"),
            sortOrder: state.categories.length + 1,
            createdAt,
            ...input,
          };
      commit((prev) => ({
        ...prev,
        categories: existing
          ? prev.categories.map((item) => (item.id === saved.id ? saved : item))
          : [...prev.categories, saved],
      }));
      return saved;
    },
    [commit, state.categories],
  );

  const deleteCategory = useCallback(
    (id: string) => {
      commit((prev) => ({ ...prev, categories: prev.categories.filter((item) => item.id !== id) }));
    },
    [commit],
  );

  const upsertProvider = useCallback(
    (input: ProviderInput, id?: string) => {
      const createdAt = new Date().toISOString();
      const existing = id ? state.providers.find((item) => item.id === id) : undefined;
      const saved: ServiceProvider = existing
        ? { ...existing, ...input, id: existing.id }
        : {
            id: createId("prov"),
            rating: 0,
            completedJobs: 0,
            createdAt,
            ...input,
          };
      commit((prev) => ({
        ...prev,
        providers: existing
          ? prev.providers.map((item) => (item.id === saved.id ? saved : item))
          : [saved, ...prev.providers],
      }));
      return saved;
    },
    [commit, state.providers],
  );

  const setProviderStatus = useCallback(
    (id: string, status: ProviderStatus) => {
      commit((prev) => ({
        ...prev,
        providers: prev.providers.map((item) => (item.id === id ? { ...item, status } : item)),
      }));
    },
    [commit],
  );

  const setUserStatus = useCallback(
    (id: string, status: UserStatus) => {
      commit((prev) => ({
        ...prev,
        users: prev.users.map((item) => (item.id === id ? { ...item, status } : item)),
      }));
    },
    [commit],
  );

  const addReview = useCallback(
    (input: Omit<Review, "id" | "createdAt">) => {
      const createdAt = new Date().toISOString();
      const review: Review = { ...input, id: createId("rev"), createdAt };
      commit((prev) => {
        const serviceReviews = [...prev.reviews.filter((item) => item.serviceId === input.serviceId), review];
        const rating =
          serviceReviews.reduce((sum, item) => sum + item.rating, 0) / serviceReviews.length;
        return {
          ...prev,
          reviews: [review, ...prev.reviews],
          services: prev.services.map((service) =>
            service.id === input.serviceId
              ? { ...service, rating: Number(rating.toFixed(1)), reviewCount: serviceReviews.length }
              : service,
          ),
        };
      });
      return review;
    },
    [commit],
  );

  const markNotificationRead = useCallback(
    (id: string) => {
      commit((prev) => ({
        ...prev,
        notifications: prev.notifications.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
      }));
    },
    [commit],
  );

  const markAllNotificationsRead = useCallback(
    (audience: "customer" | "admin", userId?: string) => {
      commit((prev) => ({
        ...prev,
        notifications: prev.notifications.map((item) => {
          if (item.audience !== audience) return item;
          if (audience === "customer" && item.userId !== userId) return item;
          return { ...item, isRead: true };
        }),
      }));
    },
    [commit],
  );

  const addMedia = useCallback(
    (input: Omit<MediaItem, "id" | "createdAt"> & { id?: string; createdAt?: string }) => {
      const item: MediaItem = {
        ...input,
        id: input.id || createId("media"),
        isActive: input.isActive ?? true,
        createdAt: input.createdAt ?? new Date().toISOString(),
      };
      commit((prev) => {
        if (prev.media.some((media) => media.id === item.id || media.url === item.url)) return prev;
        return { ...prev, media: [item, ...prev.media] };
      });
      return item;
    },
    [commit],
  );

  const setMediaActive = useCallback(
    (id: string, isActive: boolean) => {
      commit((prev) => ({
        ...prev,
        media: prev.media.map((item) => (item.id === id ? { ...item, isActive } : item)),
      }));
    },
    [commit],
  );

  const deleteMedia = useCallback(
    (id: string) => {
      commit((prev) => ({ ...prev, media: prev.media.filter((item) => item.id !== id) }));
    },
    [commit],
  );

  const indexLooseImages = useCallback(() => {
    commit((prev) => {
      const existing = new Set(prev.media.map((item) => item.url));
      const extras: MediaItem[] = [];
      const push = (url: string | undefined, kind: MediaKind, name: string) => {
        if (!url || existing.has(url)) return;
        existing.add(url);
        extras.push({
          id: createId("media"),
          kind,
          name,
          url,
          isActive: true,
          createdAt: new Date().toISOString(),
        });
      };
      prev.services.forEach((service) => {
        service.images.forEach((url, index) => push(url, "service", `${service.name} ${index + 1}`));
      });
      prev.requests.forEach((request) => {
        request.images.forEach((url, index) => push(url, "request", `${request.requestNumber} ${index + 1}`));
      });
      prev.providers.forEach((provider) => push(provider.avatarUrl, "provider", provider.fullName));
      prev.categories.forEach((category) => push(category.imageUrl, "category", category.name));
      if (!extras.length) return prev;
      return { ...prev, media: [...extras, ...prev.media] };
    });
  }, [commit]);

  const updateSettings = useCallback(
    (patch: Partial<AppSettings>) => {
      commit((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } }));
    },
    [commit],
  );

  const updateProfile = useCallback(
    (patch: Partial<Pick<User, "fullName" | "city" | "region" | "area" | "avatarUrl">>) => {
      commit((prev) => ({
        ...prev,
        users: prev.users.map((user) =>
          user.id === prev.currentUserId ? { ...user, ...patch } : user,
        ),
      }));
    },
    [commit],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      ...state,
      hydrated,
      currentUser,
      locale: state.settings.locale,
      login,
      register,
      logout,
      submitRequest,
      updateRequestStatus,
      assignProvider,
      addAdminNote,
      upsertService,
      deleteService,
      setServiceAvailability,
      upsertCategory,
      deleteCategory,
      upsertProvider,
      setProviderStatus,
      setUserStatus,
      addReview,
      markNotificationRead,
      markAllNotificationsRead,
      addMedia,
      setMediaActive,
      deleteMedia,
      indexLooseImages,
      updateSettings,
      updateProfile,
      resetSharedData,
    }),
    [
      state,
      hydrated,
      currentUser,
      login,
      register,
      logout,
      submitRequest,
      updateRequestStatus,
      assignProvider,
      addAdminNote,
      upsertService,
      deleteService,
      setServiceAvailability,
      upsertCategory,
      deleteCategory,
      upsertProvider,
      setProviderStatus,
      setUserStatus,
      addReview,
      markNotificationRead,
      markAllNotificationsRead,
      addMedia,
      setMediaActive,
      deleteMedia,
      indexLooseImages,
      updateSettings,
      updateProfile,
      resetSharedData,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
}

export function useOptionalStore() {
  return useContext(StoreContext);
}
