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
import PhotoGrid from "./photo-grid";
import DocumentList from "./document-list";
import { ScrollArea } from "../ui/scroll-area";

type ProjectTabsProps = {
  projectId: string;
  photos: Photo[] | null;
  documents: Document[] | null;
};

function ProjectTabs({ photos, documents, projectId }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "documents">("photos");
  const [addDrawerOpen, setAddDrawerOpen] = useState(false);

  const countBar = (
    <div className="flex flex-row items-center justify-between ">
      <span className="text-foreground font-semibold text-sm">
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
    <div className="h-full flex flex-col">
      {/*Tab Controls */}
      <div className="px-4 mt-6 shrink-0">
        <div className="flex w-full rounded-full bg-neutral-200 py-0.5 overflow-visible">
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
      </div>
      {/*Count Bar + Multi Select & Add Button */}
      <div className="w-full py-4 shrink-0 rounded-b-lg px-4">{countBar}</div>
      {/*Photo Grid and Document List w/ Empty State */}
      <div className="flex-1 min-h-0 ">
        {activeTab === "photos" ? (
          photos && photos.length > 0 ? (
            <ScrollArea className="h-full w-full ">
              <div className="w-full px-4 pb-32">
                <PhotoGrid photos={photos} />
              </div>
            </ScrollArea>
          ) : (
            <div className="px-4 py-2 flex flex-col items-center justify-center ">
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
            </div>
          )
        ) : documents && documents.length > 0 ? (
          <ScrollArea className="h-full w-full ">
            <div className="w-full mt-4 px-4 pb-32">
              <DocumentList documents={documents} />
            </div>
          </ScrollArea>
        ) : (
          <div className="px-4 py-2 flex flex-col items-center justify-center ">
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
          </div>
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
