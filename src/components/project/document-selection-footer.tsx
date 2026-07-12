// document-selection-footer.tsx
"use client";

import { IconX, IconDownload, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type DocumentSelectionFooterProps = {
  selectedCount: number;
  onCancel: () => void;
};

function DocumentSelectionFooter({
  selectedCount,
  onCancel,
}: DocumentSelectionFooterProps) {
  const hasSelection = selectedCount > 0;

  return (
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
          onClick={() => {
            // download handler — batch download lands next week
          }}
          disabled={!hasSelection}
          className="flex flex-col items-center gap-1 min-w-16"
          aria-label="Download selected documents"
        >
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              hasSelection ? "bg-[#2563eb]" : "bg-[#2563eb]",
            )}
          >
            <IconDownload
              size={22}
              className={hasSelection ? "text-card" : "text-card"}
            />
          </div>
        </button>

        <button
          onClick={() => {
            // delete handler — batch delete lands next week
          }}
          disabled={!hasSelection}
          className="flex flex-col items-center gap-1 min-w-16"
          aria-label="Delete selected documents"
        >
          <div className="w-12 h-12 rounded-full bg-[#2F6FEB]/10 flex items-center justify-center">
            <IconTrash
              size={22}
              className={hasSelection ? "text-[#2563eb]" : "text-[#2563eb]"}
            />
          </div>
        </button>
      </div>
    </nav>
  );
}

export default DocumentSelectionFooter;
