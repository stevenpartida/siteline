"use client";

import { Document, Photo } from "@/types/db";
import { useState } from "react";
import { ButtonGroup } from "../ui/button-group";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

type ProjectTabsProps = {
  photos: Photo[] | null;
  documents: Document[] | null;
};

function ProjectTabs({ photos, documents }: ProjectTabsProps) {
  const [activeTab, setActiveTab] = useState<"photos" | "documents">("photos");

  return (
    <div className="flex w-full rounded-full bg-neutral-200 p-0.5 mt-6 overflow-visible ">
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
  );
}

export default ProjectTabs;
