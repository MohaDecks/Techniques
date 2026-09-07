import type { LocaleCode, RequestStatus } from "./types";

const en = {
  brand: {
    name: "Farsamo",
    tagline: "All Services in One Place",
  },
  common: {
    search: "Search",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    back: "Back",
    next: "Next",
    confirm: "Confirm",
    loading: "Loading",
    empty: "Nothing to show yet",
    error: "Something went wrong",
    retry: "Try again",
    available: "Available",
    unavailable: "Currently Unavailable",
    etb: "ETB",
    more: "More",
    all: "All",
    today: "Today",
    optional: "Optional",
  },
  nav: {
    home: "Home",
    requests: "Requests",
    notifications: "Notifications",
    profile: "Profile",
  },
  auth: {
    login: "Sign in",
    register: "Create account",
    phone: "Phone number",
    password: "Password",
    fullName: "Full name",
    alreadyHaveAccount: "Already have an account?",
    noAccount: "New to Farsamo?",
    customerHint: "Customers sign in with a +251 phone number.",
    adminHint: "Admin access is managed separately.",
    demoCustomer: "Use demo customer",
    demoAdmin: "Use demo admin",
  },
  home: {
    searchPlaceholder: "What service do you need?",
    heroTitle: "Trusted help, right at your door.",
    heroSubtitle: "Request a service. Our team assigns the right provider.",
    categories: "Categories",
    popular: "Popular Services",
    featured: "Featured Services",
    recent: "Recently Requested",
    seeAll: "See all",
  },
  services: {
    title: "Services",
    details: "Service details",
    startingFrom: "Starting from",
    estimatedTime: "Service time",
    requestService: "Request Service",
    photos: "Photos",
    viewAll: "View all",
    rating: "Rating",
    reviews: "reviews",
  },
  request: {
    title: "Request Service",
    describe: "Describe your problem",
    describePlaceholder: "Example: Water leak under the kitchen sink.",
    addPhotos: "Add photos",
    location: "Location",
    useCurrent: "Use current location",
    address: "Address",
    date: "Preferred date",
    time: "Preferred time",
    phone: "Phone number",
    notes: "Notes",
    submit: "Submit Request",
    submitted: "Request Submitted",
    submittedBody:
      "Your request has been received. Our team will review it and assign a suitable service provider.",
    requestNumber: "Request number",
    track: "Track request",
    viewRequest: "View request",
  },
  requests: {
    title: "My Requests",
    active: "Active",
    completed: "Completed",
    cancelled: "Cancelled",
    emptyActive: "You have no active requests.",
    emptyCompleted: "No completed services yet.",
    emptyCancelled: "No cancelled requests.",
  },
  tracking: {
    title: "Tracking",
    serviceInfo: "Service information",
    assignedProvider: "Assigned provider",
    waitingAssignment: "A provider will appear here after our team assigns one.",
  },
  status: {
    pending: "Pending",
    under_review: "Under Review",
    provider_assigned: "Provider Assigned",
    on_the_way: "On the Way",
    service_started: "Service Started",
    completed: "Completed",
    cancelled: "Cancelled",
  } satisfies Record<RequestStatus, string>,
  timeline: {
    pending: "Request Submitted",
    under_review: "Being Processed",
    provider_assigned: "Provider Assigned",
    on_the_way: "On the Way",
    service_started: "Service Started",
    completed: "Completed",
    cancelled: "Cancelled",
  } satisfies Record<RequestStatus, string>,
  profile: {
    title: "Profile",
    settings: "Settings",
    reviews: "Reviews",
    language: "Language",
    logout: "Sign out",
    adminPortal: "Admin Portal",
  },
  reviews: {
    title: "Reviews",
    leave: "Leave a review",
    empty: "You have not reviewed a service yet.",
    commentPlaceholder: "How was the service?",
    submit: "Submit review",
  },
  admin: {
    dashboard: "Dashboard",
    users: "Users",
    providers: "Service Providers",
    categories: "Categories",
    services: "Services",
    requests: "Service Requests",
    orders: "Orders",
    media: "Media Library",
    reviews: "Reviews",
    payments: "Payments",
    notifications: "Notifications",
    reports: "Reports",
    settings: "Settings",
    addService: "Add Service",
    addCategory: "Add Category",
    addProvider: "Add Provider",
    assignProvider: "Assign Provider",
    basicInfo: "Basic Information",
    mediaGallery: "Media & Gallery",
  },
};

export type MessageDict = typeof en;

const dictionaries: Record<LocaleCode, MessageDict> = {
  en,
  am: en,
  so: en,
  om: en,
};

export function t(locale: LocaleCode, path: string): string {
  const parts = path.split(".");
  let current: unknown = dictionaries[locale] ?? dictionaries.en;
  for (const part of parts) {
    if (typeof current !== "object" || current === null || !(part in current)) {
      current = dictionaries.en;
      for (const fallbackPart of parts) {
        if (typeof current !== "object" || current === null || !(fallbackPart in current)) {
          return path;
        }
        current = (current as Record<string, unknown>)[fallbackPart];
      }
      break;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}
