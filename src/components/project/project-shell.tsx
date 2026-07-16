"use client";

import { useState, useCallback, useEffect } from "react";
import { Photo, Document } from "@/types/db";
import ProjectHero from "@/components/project/project-hero";
import ProjectTabs from "@/components/project/project-tabs";
import { useNavVisibility } from "@/lib/nav-visibility-context";
import ShareDrawer from "./share-drawer";

type ProjectShellProps = {
  projectId: string;
  projectName: string;
  projectAddress: string;
  coverPhotoUrl: string | null;
  photos: Photo[] | null;
  documents: Document[] | null;
};

function ProjectShell({
  projectId,
  projectName,
  projectAddress,
  coverPhotoUrl,
  photos,
  documents,
}: ProjectShellProps) {
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [shareDrawerOpen, setShareDrawerOpen] = useState(false);

  const { setHidden } = useNavVisibility();

  useEffect(() => {
    setHidden(selectionMode);
    return () => setHidden(false);
  }, [selectionMode, setHidden]);

  const onEnterSelection = useCallback(() => {
    setSelectionMode(true);
  }, []);

  const onExitSelection = useCallback(() => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }, []);

  const onToggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const onSelectAll = useCallback((ids: string[]) => {
    setSelectedIds(new Set(ids));
  }, []);

  const handleShareTypeSelect = useCallback(
    (type: "gallery" | "timeline") => {
      setShareDrawerOpen(false);
      if (selectedIds.size === 0) {
        setSelectionMode(true);
        return;
      }
      console.log("would generate link:", type, [...selectedIds]); // temporary
    },
    [selectedIds],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0">
        <ProjectHero
          coverPhotoUrl={coverPhotoUrl}
          projectId={projectId}
          disabled={selectionMode}
          onShareClick={() => setShareDrawerOpen(true)}
        />
      </div>
      <div className="flex-1 min-h-0 flex flex-col pt-4">
        <div className="flex flex-col shrink-0 px-4">
          <span className="text-2xl text-foreground font-bold">
            {projectName}
          </span>
          <span className="text-sm text-muted-foreground font-normal">
            {projectAddress}
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <ProjectTabs
            projectId={projectId}
            photos={photos}
            documents={documents}
            selectionMode={selectionMode}
            selectedIds={selectedIds}
            onEnterSelection={onEnterSelection}
            onExitSelection={onExitSelection}
            onToggleSelect={onToggleSelect}
            onSelectAll={onSelectAll}
            onShareClick={() => setShareDrawerOpen(true)}
          />
        </div>
      </div>
      {/* share drawer component goes here once built */}
      <ShareDrawer
        open={shareDrawerOpen}
        onOpenChange={setShareDrawerOpen}
        onTypeSelect={handleShareTypeSelect}
      />
    </div>
  );
}

export default ProjectShell;
