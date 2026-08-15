import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectLoading() {
  return (
    <div
      className="h-full overflow-hidden"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Sticky top bar (back / share / menu) */}
      <div className="sticky top-0 z-40 flex justify-between p-4">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="size-10 rounded-full" />
        </div>
      </div>

      {/* Hero image */}
      <Skeleton className="h-52 w-full rounded-none -mt-17" />

      {/* Title + address */}
      <div className="flex flex-col gap-2 px-4 pt-4">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Tabs (Photos / Docs) */}
      <div className="px-4 pt-6 flex flex-row gap-2 border-b border-muted-foreground/10 pb-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>

      {/* Photo grid */}
      <div className="p-2 grid grid-cols-3 gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full rounded-md" />
        ))}
      </div>

      <span className="sr-only">Loading project…</span>
    </div>
  );
}
