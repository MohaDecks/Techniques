import type { ServiceRequest } from "./types";

export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${random}`;
}

export function nextRequestNumber(requests: ServiceRequest[], date = new Date()): string {
  const stamp = date.toISOString().slice(0, 10).replaceAll("-", "");
  const prefix = `FS-${stamp}-`;
  const count = requests.filter((request) => request.requestNumber.startsWith(prefix)).length;
  return `${prefix}${String(count + 1).padStart(3, "0")}`;
}
