export function AdminFooter() {
  return (
    <footer className="shrink-0 border-t border-black/5 bg-white px-4 py-2.5 text-center lg:px-6">
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} Farsamo. All rights reserved.
      </p>
    </footer>
  );
}
