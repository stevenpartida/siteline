"use client";

import { Document, Photo } from "@/types/db";
import { useState } from "react";

import { cn } from "@/lib/utils";
import EmptyState from "@/components/project/empty-state";
import {
  IconCamera,
  IconFileText,
  IconSquareCheck,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import AddMediaDrawer from "./add-media-drawer";

type ProjectTabsProps = {
  projectId: string;
  photos: Photo[] | null;
  documents: Document[] | null;
};

function ProjectTabs({ photos, documents, projectId }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "documents">("photos");
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const countBar = (
    <div className="flex flex-row items-center justify-between">
      <span className="text-muted-foreground text-sm">
        {activeTab === "photos"
          ? `Photos · ${photos?.length ?? 0}`
          : `Documents · ${documents?.length ?? 0}`}
      </span>
      <div className="flex flex-row gap-2">
        <Button
          size="icon"
          className="rounded-full bg-neutral-200 hover:bg-neutral-300 text-foreground"
        >
          <IconSquareCheck />
        </Button>
        <Button
          size="icon"
          className="rounded-full "
          onClick={() => setAddDrawerOpen(true)}
        >
          <IconPlus />
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      {/*Tab Controls */}
      <div className="flex w-full rounded-full bg-neutral-200 py-0.5 mt-6 overflow-visible ">
        <button
          onClick={() => setActiveTab("photos")}
          className={cn(
            "flex-1 rounded-full py-1.5 text-sm font-medium transition-all ",
            activeTab === "photos"
              ? "bg-foreground text-background shadow-xl"
              : "text-muted-foreground",
          )}
        >
          Photos
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={cn(
            "flex-1 rounded-full py-1.5 text-sm font-medium transition-all ",
            activeTab === "documents"
              ? "bg-foreground text-background shadow-xl"
              : "text-muted-foreground",
          )}
        >
          Documents
        </button>
      </div>
      {/*Count Bar + Multi Select & Add Button */}
      <div className="w-full py-4">{countBar}</div>
      {/*Photo Grid and Document List w/ Empty State */}
      <div className="flex flex-col align-middle items-center justify-center">
        {activeTab === "photos" ? (
          photos && photos.length > 0 ? (
            <div></div>
          ) : (
            <>
              <EmptyState
                icon={IconCamera}
                title="No Photos Yet"
                subtext="Tap the camera to log progress. Each photo auto-files to this project."
              />
              <Button
                variant="default"
                size="lg"
                className="rounded-3xl font-semibold"
                onClick={() => setAddDrawerOpen(true)}
              >
                <IconPlus />
                Add Photo
              </Button>
            </>
          )
        ) : documents && documents.length > 0 ? (
          <div></div>
        ) : (
          <>
            <EmptyState
              icon={IconFileText}
              title="No Documents Yet"
              subtext="Store permits, plans, and contracts for this project."
            />
            <Button
              variant="default"
              size="lg"
              className="rounded-3xl font-semibold"
              onClick={() => setAddDrawerOpen(true)}
            >
              <IconUpload />
              Upload Document
            </Button>
          </>
        )}
      </div>
      <AddMediaDrawer
        projectId={projectId}
        activeTab={activeTab}
        open={addDrawerOpen}
        onOpenChange={setAddDrawerOpen}
      />
    </div>
  );
}

export default ProjectTabs;
