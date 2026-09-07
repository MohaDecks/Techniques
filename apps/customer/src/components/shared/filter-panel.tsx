import type { ReactNode } from "react";

export function FilterPanel({ children }: { children: ReactNode }) {
  return <div className="flex flex-wrap items-center gap-2">{children}</div>;
}

export function FilterChip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-action px-3.5 py-1.5 text-sm font-medium text-white"
          : "rounded-full bg-slate-100 px-3.5 py-1.5 text-sm font-medium text-slate-600"
      }
    >
      {children}
    </button>
  );
}
