"use client";

import { getDateRange, groupPhotosByDate } from "@/lib/helpers";
import { SharedPhoto, ShareViewType } from "@/types/db";
import ShareHeader from "./share-header";
import { useMemo, useState } from "react";
import ShareViewToggle from "./share-view-toggle";
import ShareGalleryView from "./share-gallery-view";
import ShareTimelineView from "./share-timeline-view";

type SharePageClientProps = {
  companyName: string;
  projectName: string;
  projectAddress: string;
  viewType: ShareViewType;
  sharedPhotos: SharedPhoto[];
  token: string;
};

function SharePageClient({
  companyName,
  projectName,
  projectAddress,
  viewType,
  sharedPhotos,
  token,
}: SharePageClientProps) {
  const dateRange = useMemo(() => getDateRange(sharedPhotos), [sharedPhotos]);
  const [viewMode, setViewMode] = useState<ShareViewType>(viewType);

  const groupPhotos = useMemo(
    () => groupPhotosByDate(sharedPhotos),
    [sharedPhotos],
  );
  return (
    <div>
      <ShareHeader
        companyName={companyName}
        projectName={projectName}
        projectAddress={projectAddress}
        dateRange={dateRange}
        photoCount={sharedPhotos.length}
        token={token}
      />
      <div className="px-4">
        <ShareViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      </div>
      <div>
        {viewMode === "gallery" ? (
          <ShareGalleryView groups={groupPhotos} />
        ) : (
          <ShareTimelineView groups={groupPhotos} />
        )}
      </div>
    </div>
  );
}

export default SharePageClient;
