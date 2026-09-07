import { cn } from "@/lib/utils";

export function ImageGallery({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) {
  if (!images.length) return null;
  return (
    <div className={cn("flex gap-2 overflow-x-auto hide-scrollbar", className)}>
      {images.map((image) => (
        <div key={image} className="h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}
