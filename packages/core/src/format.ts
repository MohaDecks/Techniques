import { format, parseISO } from "date-fns";
import { CURRENCY } from "./constants";

export function formatPrice(amount: number): string {
  return `${amount.toLocaleString("en-ET")} ${CURRENCY}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("251") && digits.length >= 12) {
    return `+251 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return `+251 ${digits.slice(1, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  }
  if (digits.length === 9) {
    return `+251 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`;
  }
  return phone.startsWith("+") ? phone : `+251 ${phone}`;
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("251")) return digits;
  if (digits.startsWith("0")) return `251${digits.slice(1)}`;
  return `251${digits}`;
}

export function formatDate(value: string): string {
  try {
    return format(parseISO(value), "d MMM yyyy");
  } catch {
    return value;
  }
}

export function formatDateTime(value: string): string {
  try {
    return format(parseISO(value), "d MMM yyyy, HH:mm");
  } catch {
    return value;
  }
}

export function formatTimeLabel(value: string): string {
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  try {
    return format(parseISO(value), "HH:mm");
  } catch {
    return value;
  }
}
