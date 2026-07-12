"use client";

import { formatDate, groupPhotosByDate, userInitials } from "@/lib/helpers";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Photo } from "@/types/db";
import { IconCheck } from "@tabler/icons-react";
import Image from "next/image";

type PhotoGridProps = {
  photos: Photo[] | null;
  selectionMode: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
};

function PhotoGrid({
  photos,
  selectionMode,
  selectedIds,
  onToggleSelect,
}: PhotoGridProps) {
  const groups = groupPhotosByDate(photos ?? []);
  const supabase = createClient();

  return (
    <div className="">
      {Object.entries(groups).map(([label, groupPhotos]) => {
        const dateLabel = formatDate(new Date(groupPhotos[0].created_at));
        const showDateLabel = label === "Today" || label === "Yesterday";
        return (
          <div key={label}>
            {/* header */}
            <h2 className="text-sm text-muted-foreground my-2 font-normal">
              {label}
              {showDateLabel && ` · ${dateLabel}`}
            </h2>
            {/* grid */}
            <div className="grid grid-cols-4 gap-2">
              {groupPhotos.map((photo) => {
                const photoUrl = supabase.storage
                  .from("photos")
                  .getPublicUrl(photo.storage_path).data.publicUrl;
                const isSelected = selectedIds.has(photo.id);
                return (
                  <div
                    key={photo.id}
                    onClick={
                      selectionMode ? () => onToggleSelect(photo.id) : undefined
                    }
                    className={cn(
                      "relative aspect-square rounded-md overflow-hidden",
                      selectionMode && "cursor-pointer",
                      isSelected && "ring-2 ring-blue-600",
                    )}
                  >
                    <Image
                      src={photoUrl}
                      alt={`Photo uploaded by ${photo.uploaded_by_name}`}
                      fill
                      sizes="25vw"
                    />
                    <div className="absolute bottom-2 left-2 flex items-center justify-center size-6 rounded-full bg-white text-foreground text-xs font-normal shadow-sm">
                      {userInitials(photo.uploaded_by_name)}
                    </div>
                    {selectionMode && (
                      <div
                        className={cn(
                          "absolute top-2 right-2 flex items-center justify-center size-5 rounded-full border-2",
                          isSelected
                            ? "bg-blue-600 border-blue-600"
                            : "bg-white/80 border-white",
                        )}
                      >
                        {isSelected && (
                          <IconCheck
                            size={14}
                            stroke={3}
                            className="text-white"
                          />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PhotoGrid;
