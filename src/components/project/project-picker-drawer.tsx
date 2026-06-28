"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  IconMapPin,
  IconPlus,
  IconCheck,
  IconMapPinFilled,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { haversineDistance, formatRelativeTime } from "@/lib/helpers";
import type { Coordinates } from "@/types/location";

interface NearbyProject {
  id: string;
  name: string;
  address: string;
  thumbnailUrl: string | null;
  photoCount: number;
  lastPhotoAt: string | null;
  projectLat: number;
  projectLng: number;
}

type ProjectPickerDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: NearbyProject[];
  userCoords: Coordinates | null;
  capturedFile: File | null;
  onSelect: (projectId: string) => void;
  onCreateNew: () => void;
};

function ProjectPickerDrawer({
  open,
  onOpenChange,
  projects,
  userCoords,
  capturedFile,
  onSelect,
  onCreateNew,
}: ProjectPickerDrawerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleOpenChange = (open: boolean) => {
    if (!open) setSelectedId(null);
    onOpenChange(open);
  };

  const selectedProject =
    (selectedId ? projects.find((p) => p.id === selectedId) : null) ??
    projects[0];
  const otherProjects = projects.filter((p) => p.id !== selectedProject?.id);
  const isGpsMatch = selectedProject?.id === projects[0]?.id;

  const getDistance = (project: NearbyProject): string => {
    if (!userCoords || !project.projectLat || !project.projectLng) return "";
    const miles = haversineDistance(
      userCoords.lat,
      userCoords.lng,
      project.projectLat,
      project.projectLng,
    );
    return `${miles.toFixed(1)} mi`;
  };

  return (
    <Drawer open={open} onOpenChange={handleOpenChange} direction="bottom">
      <DrawerContent
        className="rounded-t-3xl bg-background"
        aria-describedby={undefined}
      >
        <DrawerHeader className="items-baseline">
          <DrawerTitle className="text-xl font-bold text-foreground">
            Save to project
          </DrawerTitle>
          <DrawerDescription>
            Nearby job sites based on your location
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-col px-4 pb-12 gap-4">
          {/* Captured photo preview */}
          <div className="flex items-center gap-3">
            {capturedFile ? (
              <Image
                src={URL.createObjectURL(capturedFile)}
                alt="Just captured"
                width={56}
                height={56}
                className="w-14 h-14 rounded-xl object-cover shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-muted shrink-0" />
            )}
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                Just captured ·{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-xs text-muted-foreground flex flex-row gap-1 items-center tracking-wider">
                <IconMapPin stroke={1.5} size={14} />
                {userCoords
                  ? `${userCoords.lat.toFixed(4)}, ${userCoords.lng.toFixed(4)}`
                  : "Locating..."}
              </span>
            </div>
          </div>

          {/* Primary / selected project */}
          {selectedProject && (
            <div className="flex flex-col gap-3 p-4 rounded-2xl border border-foreground bg-foreground/5">
              <div className="flex items-center justify-between">
                <Badge>
                  {isGpsMatch ? (
                    <>
                      <IconMapPinFilled data-icon="inline-start" />
                      <span className="text-xs"> You&apos;re Here</span>
                    </>
                  ) : (
                    <>
                      <IconCircleCheckFilled data-icon="inline-start" />
                      <span> Selected</span>
                    </>
                  )}
                </Badge>
                <span className="text-xs text-foreground">
                  {getDistance(selectedProject)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                {selectedProject.thumbnailUrl ? (
                  <Image
                    src={selectedProject.thumbnailUrl}
                    alt={selectedProject.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-muted shrink-0" />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="text-base font-semibold text-foreground">
                    {selectedProject.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedProject.photoCount}{" "}
                    {selectedProject.photoCount === 1 ? "photo" : "photos"} ·{" "}
                    {formatRelativeTime(selectedProject.lastPhotoAt)}
                  </span>
                </div>
              </div>
              <Button
                className="w-full h-12 rounded-full items-center"
                onClick={() => onSelect(selectedProject.id)}
              >
                <IconCheck />
                Add Photo
              </Button>
            </div>
          )}

          {/* Other nearby projects */}
          {otherProjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground tracking-wide px-1">
                OR ANOTHER NEARBY
              </span>
              {otherProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => setSelectedId(project.id)}
                  className="flex items-center justify-between p-4 rounded-xl bg-card border border-border text-left"
                >
                  <div className="flex items-center gap-3">
                    {project.thumbnailUrl ? (
                      <Image
                        src={project.thumbnailUrl}
                        alt={project.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-lg object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted shrink-0" />
                    )}
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {project.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {project.photoCount}{" "}
                        {project.photoCount === 1 ? "photo" : "photos"}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getDistance(project)}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Create new escape hatch */}
          <button
            onClick={onCreateNew}
            className="flex items-center justify-center gap-2 p-4 rounded-full border border-muted-foreground text-sm font-medium text-foreground"
          >
            <IconPlus size={16} />
            Create New Project
          </button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default ProjectPickerDrawer;
