"use client";

import { cn } from "@/lib/utils";
import { ShareViewType } from "@/types/db";

type ShareViewToggleProps = {
  viewMode: ShareViewType;
  onViewChange: (view: ShareViewType) => void;
};

function ShareViewToggle({ viewMode, onViewChange }: ShareViewToggleProps) {
  return (
    <div className="flex w-full rounded-full bg-neutral-200 py-0.5 overflow-visible ">
      <button
        onClick={() => onViewChange("gallery")}
        className={cn(
          "flex-1 rounded-full py-1.5 text-sm font-medium transition-all",
          viewMode === "gallery"
            ? "bg-foreground text-background shadow-xl"
            : "text-muted-foreground",
        )}
      >
        Gallery
      </button>
      <button
        onClick={() => onViewChange("timeline")}
        className={cn(
          "flex-1 rounded-full py-1.5 text-sm font-medium transition-all",
          viewMode === "timeline"
            ? "bg-foreground text-background shadow-xl"
            : "text-muted-foreground",
        )}
      >
        Timeline
      </button>
    </div>
  );
}

export default ShareViewToggle;
