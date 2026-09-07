"use client";

import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@farsamo/core";
import type { MediaKind } from "@farsamo/core";

export function ImageUploader({
  value,
  onChange,
  label = "Add photos",
  multiple = true,
  kind = "request",
  className,
}: {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  multiple?: boolean;
  kind?: MediaKind;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const { addMedia } = useStore();

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    const urls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        form.append("kind", kind);
        form.append("name", file.name);
        let uploaded: {
          id: string;
          kind: MediaKind;
          name: string;
          url: string;
          fileName?: string;
          mimeType?: string;
          size?: number;
          isActive: boolean;
          createdAt: string;
        } | null = null;
        try {
          const response = await fetch("/api/media", { method: "POST", body: form });
          if (response.ok) uploaded = await response.json();
        } catch {
          uploaded = null;
        }
        if (uploaded) {
          addMedia(uploaded);
          urls.push(uploaded.url);
          continue;
        }
        const dataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(file);
        });
        const item = addMedia({
          kind,
          name: file.name,
          url: dataUrl,
          mimeType: file.type,
          size: file.size,
          isActive: true,
        });
        urls.push(item.url);
      }
      if (urls.length) {
        onChange(multiple ? [...value, ...urls] : urls.slice(0, 1));
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          void addFiles(event.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition",
          dragging ? "border-action bg-blue-50" : "border-black/10 bg-slate-50",
        )}
      >
        <ImagePlus className="mb-2 size-6 text-action" />
        <p className="text-sm font-medium text-navy">{busy ? "Saving images..." : label}</p>
        <p className="mt-1 text-xs text-muted-foreground">Drag and drop or tap to upload</p>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          void addFiles(event.target.files);
          event.target.value = "";
        }}
      />
      {value.length ? (
        <div className="grid grid-cols-3 gap-2">
          {value.map((url) => (
            <div key={url} className="relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-24 w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((item) => item !== url))}
                className="absolute top-1.5 right-1.5 rounded-full bg-navy/80 p-1 text-white"
                aria-label="Remove image"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
