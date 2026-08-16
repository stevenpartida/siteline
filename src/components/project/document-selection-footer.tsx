// document-selection-footer.tsx
"use client";

import { useState } from "react";
import { IconX, IconDownload, IconTrash } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

type DocumentSelectionFooterProps = {
  selectedCount: number;
  onCancel: () => void;
  onDownload: () => Promise<void>;
  onDelete: () => Promise<void>;
};

function DocumentSelectionFooter({
  selectedCount,
  onCancel,
  onDownload,
  onDelete,
}: DocumentSelectionFooterProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const hasSelection = selectedCount > 0;
  const isBusy = isDownloading || isDeleting;

  async function handleDownload() {
    if (!hasSelection || isBusy) return;
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  }

  async function handleDelete() {
    if (!hasSelection || isBusy) return;
    setIsDeleting(true);
    try {
      await onDelete();
    } finally {
      setIsDeleting(false);
    }
  }

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
          onClick={handleDownload}
          disabled={!hasSelection || isBusy}
          className="flex flex-col items-center gap-1 min-w-16 disabled:opacity-60"
          aria-label="Download selected documents"
        >
          <div
            className={cn(
              "w-14 h-14 rounded-full flex items-center justify-center",
              hasSelection ? "bg-[#2563eb]" : "bg-[#2563eb]",
            )}
          >
            {isDownloading ? (
              <Spinner className="size-5 text-card" />
            ) : (
              <IconDownload
                size={22}
                className={hasSelection ? "text-card" : "text-card"}
              />
            )}
          </div>
        </button>

        <button
          onClick={handleDelete}
          disabled={!hasSelection || isBusy}
          className="flex flex-col items-center gap-1 min-w-16 disabled:opacity-60"
          aria-label="Delete selected documents"
        >
          <div className="w-12 h-12 rounded-full bg-[#2F6FEB]/10 flex items-center justify-center">
            {isDeleting ? (
              <Spinner className="size-5 text-[#2563eb]" />
            ) : (
              <IconTrash
                size={22}
                className={hasSelection ? "text-[#2563eb]" : "text-[#2563eb]"}
              />
            )}
          </div>
        </button>
      </div>
    </nav>
  );
}

export default DocumentSelectionFooter;
