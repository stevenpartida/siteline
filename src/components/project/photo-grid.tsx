"use client";

import { formatDate, groupPhotosByDate, userInitials } from "@/lib/helpers";
import { createClient } from "@/lib/supabase/client";
import { Photo } from "@/types/db";
import Image from "next/image";

type PhotoGridProps = {
  photos: Photo[] | null;
};

function PhotoGrid({ photos }: PhotoGridProps) {
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
                // return JSX for one photo cell here
                const photoUrl = supabase.storage
                  .from("photos")
                  .getPublicUrl(photo.storage_path).data.publicUrl;
                return (
                  <div
                    key={photo.id}
                    className="relative aspect-square rounded-md overflow-hidden"
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
