import { ACTIVE_REQUEST_STATUSES } from "./constants";
import type { AppState, RequestStatus, Service } from "./types";

export function visibleServices(state: Pick<AppState, "services" | "categories">): Service[] {
  const enabled = new Set(state.categories.filter((category) => category.isEnabled).map((category) => category.id));
  return state.services.filter((service) => enabled.has(service.categoryId));
}

export function requestTab(status: RequestStatus): "active" | "completed" | "cancelled" {
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  if (ACTIVE_REQUEST_STATUSES.includes(status)) return "active";
  return "active";
}

export function isServiceRequestable(service: Service, categories: AppState["categories"]): boolean {
  const category = categories.find((item) => item.id === service.categoryId);
  return Boolean(service.isAvailable && category?.isEnabled);
}
