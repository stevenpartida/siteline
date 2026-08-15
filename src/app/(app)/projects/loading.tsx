import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectsLoading() {
  return (
    <div
      className="h-full flex flex-col"
      aria-busy="true"
      aria-live="polite"
    >
      {/* Header (greeting + count) */}
      <div className="flex flex-col gap-3 pt-6 pb-2 bg-background">
        <div className="flex flex-col gap-2 px-4">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Search input */}
        <div className="px-4">
          <Skeleton className="h-11 w-full rounded-full" />
        </div>

        {/* Filter tabs */}
        <div className="px-4 flex flex-row gap-2">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
      </div>

      {/* Project card grid */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="p-4 mb-30 flex flex-col gap-4">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-2/1 w-full rounded-xl" />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading projects…</span>
    </div>
  );
}
