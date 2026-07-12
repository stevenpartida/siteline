// photo-selection-footer.tsx
"use client";

import { useState } from "react";
import { IconX, IconShare2, IconDots } from "@tabler/icons-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { cn } from "@/lib/utils";

type PhotoSelectionFooterProps = {
  selectedCount: number;
  onCancel: () => void;
  onShareClick: () => void;
};

function PhotoSelectionFooter({
  selectedCount,
  onCancel,
  onShareClick,
}: PhotoSelectionFooterProps) {
  const [moreDrawerOpen, setMoreDrawerOpen] = useState(false);
  const hasSelection = selectedCount > 0;

  return (
    <>
      <nav className="fixed bottom-8 left-4 right-4 z-50 max-w-xs mx-auto">
        <div className="flex items-center justify-around bg-card border border-border rounded-full px-6 py-3 shadow-sm">
          <button
            onClick={onCancel}
            className="flex flex-col items-center gap-1 min-w-16"
            aria-label="Cancel selection"
          >
            <div className="w-12 h-12 rounded-full bg-[#2F6FEB]/10 flex items-center justify-center">
              <IconX size={22} className="text-[#2563eb]" />
            </div>
          </button>

          <button
            onClick={onShareClick}
            disabled={!hasSelection}
            className="flex flex-col items-center gap-1 min-w-16"
            aria-label="Share selected photos"
          >
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center",
                hasSelection ? "bg-[#2563eb]" : "bg-[#2563eb]",
              )}
            >
              <IconShare2
                size={22}
                className={hasSelection ? "text-card" : "text-card"}
              />
            </div>
          </button>

          <button
            onClick={() => setMoreDrawerOpen(true)}
            disabled={!hasSelection}
            className="flex flex-col items-center gap-1 min-w-16"
            aria-label="More options"
          >
            <div className="w-12 h-12 rounded-full bg-[#2F6FEB]/10 flex items-center justify-center">
              <IconDots
                size={22}
                className={hasSelection ? "text-foreground" : "text-[#2563eb]"}
              />
            </div>
          </button>
        </div>
      </nav>

      <Drawer open={moreDrawerOpen} onOpenChange={setMoreDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {selectedCount} photo{selectedCount === 1 ? "" : "s"} selected
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col gap-2 px-4 pb-6">
            <button
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-left hover:bg-muted"
              onClick={() => {
                // download handler — batch download lands next week
                setMoreDrawerOpen(false);
              }}
            >
              <span className="font-medium">Download to device</span>
            </button>
            <button
              className="flex items-center gap-3 rounded-lg px-3 py-3 text-left text-red-600 hover:bg-red-50"
              onClick={() => {
                // delete handler — batch delete lands next week
                setMoreDrawerOpen(false);
              }}
            >
              <span className="font-medium">Delete</span>
            </button>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default PhotoSelectionFooter;
