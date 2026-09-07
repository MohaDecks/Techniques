"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Check, MoreVertical, ImageOff } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { FilterChip, FilterPanel } from "@/components/shared/filter-panel";
import { ImageUploader } from "@/components/shared/image-uploader";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, useStore } from "@farsamo/core";
import type { MediaItem, MediaKind } from "@farsamo/core";
import { toast } from "sonner";

const kinds: Array<MediaKind | "all"> = ["all", "service", "category", "provider", "banner", "request"];

function CopyCell({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex max-w-[220px] items-center gap-1.5 font-mono text-xs text-slate-600 hover:text-navy"
      title="Copy"
    >
      <span className={`truncate ${className ?? ""}`}>{value}</span>
      {copied ? <Check className="size-3.5 shrink-0 text-brand" /> : <Copy className="size-3.5 shrink-0 text-slate-400" />}
    </button>
  );
}

export default function AdminMediaPage() {
  const { media, deleteMedia, setMediaActive, indexLooseImages } = useStore();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<MediaKind | "all">("all");
  const [uploadKind, setUploadKind] = useState<MediaKind>("service");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<MediaItem | null>(null);

  useEffect(() => {
    indexLooseImages();
  }, [indexLooseImages]);

  const rows = useMemo(
    () =>
      media.filter((item) => {
        const haystack = `${item.name} ${item.id} ${item.url} ${item.fileName ?? ""}`.toLowerCase();
        const matchesKind = kind === "all" || item.kind === kind;
        return matchesKind && haystack.includes(query.toLowerCase());
      }),
    [media, kind, query],
  );

  async function removeItem(item: MediaItem) {
    await fetch(`/api/media/${item.id}`, { method: "DELETE" });
    deleteMedia(item.id);
    toast.success("Image removed from the library.");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Media Library" description="Uploaded images are stored on disk and listed here so they can be previewed." />
      <div className="app-card space-y-3 p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Upload as</p>
            <Select value={uploadKind} onValueChange={(value) => setUploadKind(value as MediaKind)}>
              <SelectTrigger className="h-9 min-w-36 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kinds
                  .filter((item) => item !== "all")
                  .map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <ImageUploader value={[]} onChange={() => undefined} kind={uploadKind} label="Upload images" />
      </div>
      <SearchInput value={query} onChange={setQuery} placeholder="Search media" className="max-w-sm" />
      <FilterPanel>
        {kinds.map((item) => (
          <FilterChip key={item} active={kind === item} onClick={() => setKind(item)}>
            {item}
          </FilterChip>
        ))}
      </FilterPanel>
      <DataTable
        rows={rows}
        emptyTitle="No media found"
        emptyDescription="Upload an image or photos already used on services and requests will appear here."
        columns={[
          {
            key: "name",
            header: "Name",
            render: (row) => (
              <div className="flex min-w-[220px] items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPreview(row)}
                  className="size-12 shrink-0 overflow-hidden rounded-lg bg-slate-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={row.url} alt={row.name} className="size-full object-cover" />
                </button>
                <div className="min-w-0">
                  <p className="truncate font-medium text-navy">{row.name}</p>
                  <Badge variant="secondary" className="mt-1 capitalize">
                    {row.kind}
                  </Badge>
                </div>
              </div>
            ),
          },
          {
            key: "date",
            header: "Date",
            render: (row) => <span className="whitespace-nowrap text-sm text-slate-600">{formatDate(row.createdAt)}</span>,
          },
          {
            key: "id",
            header: "ID",
            render: (row) => <CopyCell value={row.id} />,
          },
          {
            key: "path",
            header: "Path",
            render: (row) => <CopyCell value={row.fileName || row.url} />,
          },
          {
            key: "status",
            header: "Status",
            render: (row) => (
              <div className="flex items-center gap-2" onClick={(event) => event.stopPropagation()}>
                <Switch
                  checked={row.isActive !== false}
                  onCheckedChange={(checked) => setMediaActive(row.id, checked)}
                  className="data-checked:bg-brand"
                />
                <span className="text-sm text-slate-600">{row.isActive !== false ? "Active" : "Inactive"}</span>
              </div>
            ),
          },
          {
            key: "actions",
            header: "",
            className: "w-12",
            render: (row) => (
              <div onClick={(event) => event.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon-xs" aria-label="Media actions" />}
                  >
                    <MoreVertical className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setPreview(row)}>View image</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        await navigator.clipboard.writeText(row.url);
                        toast.success("Image path copied.");
                      }}
                    >
                      Copy path
                    </DropdownMenuItem>
                    <DropdownMenuItem variant="destructive" onClick={() => setPendingDelete(row)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={Boolean(preview)} onOpenChange={(open) => !open && setPreview(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{preview?.name ?? "Image"}</DialogTitle>
          </DialogHeader>
          {preview ? (
            preview.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview.url} alt={preview.name} className="max-h-[70vh] w-full rounded-xl object-contain" />
            ) : (
              <div className="flex h-48 items-center justify-center text-muted-foreground">
                <ImageOff className="size-8" />
              </div>
            )
          ) : null}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete image?"
        description="This removes the file from the media library and from disk."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (pendingDelete) void removeItem(pendingDelete);
          setPendingDelete(null);
        }}
      />
    </div>
  );
}
