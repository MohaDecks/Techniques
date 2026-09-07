import { CustomerShell } from "@/components/customer/customer-shell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}
