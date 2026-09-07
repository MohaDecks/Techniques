import type {
  Category,
  CategoryInput,
  ProviderInput,
  RequestStatus,
  Service,
  ServiceInput,
  ServiceProvider,
  ServiceRequest,
  SubmitRequestInput,
} from "./types";

/**
 * API-shaped client for a future Node.js / MongoDB backend.
 * The UI currently talks to the local store with the same method names.
 */
export interface MarketplaceApi {
  listServices: () => Promise<Service[]>;
  getService: (id: string) => Promise<Service | null>;
  createService: (input: ServiceInput) => Promise<Service>;
  updateService: (id: string, input: ServiceInput) => Promise<Service>;
  listCategories: () => Promise<Category[]>;
  upsertCategory: (input: CategoryInput, id?: string) => Promise<Category>;
  listProviders: () => Promise<ServiceProvider[]>;
  upsertProvider: (input: ProviderInput, id?: string) => Promise<ServiceProvider>;
  submitRequest: (input: SubmitRequestInput) => Promise<ServiceRequest>;
  listRequests: () => Promise<ServiceRequest[]>;
  assignProvider: (requestId: string, providerId: string) => Promise<ServiceRequest>;
  updateRequestStatus: (requestId: string, status: RequestStatus) => Promise<ServiceRequest>;
}

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "/api";
