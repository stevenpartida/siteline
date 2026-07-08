"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  IconMapPin,
  IconPlus,
  IconCheck,
  IconMapPinFilled,
  IconCircleCheckFilled,
  IconPhoto,
  IconSearch,
} from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { haversineDistance, formatRelativeTime } from "@/lib/helpers";
import type { Coordinates } from "@/types/location";

const RECENT_LIMIT = 4;

interface NearbyProject {
  id: string;
  name: string;
  address: string;
  thumbnailUrl: string | null;
  photoCount: number;
  lastPhotoAt: string | null;
  projectLat: number | null;
  projectLng: number | null;
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setSelectedId(null);
      setSearchQuery("");
    }
    onOpenChange(open);
  };

  const selectedProject =
    (selectedId ? projects.find((p) => p.id === selectedId) : null) ??
    (userCoords ? projects[0] : null);

  const isGpsMatch =
    userCoords !== null && selectedProject?.id === projects[0]?.id;

  const isSearching = !userCoords && searchQuery.trim().length > 0;

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q),
    );
  }, [projects, searchQuery]);

  // GPS flow: show every proximity match (already a short list).
  // Fallback, no search yet: cap to the most recent N — this is what
  // keeps the list short enough that Create New Project never needs
  // its own scroll handling.
  // Fallback, actively searching: show filtered matches — could exceed
  // the cap, but that's a deliberate user action, not the default state.
  const baseList = userCoords
    ? projects
    : isSearching
      ? filteredProjects
      : projects.slice(0, RECENT_LIMIT);

  const listProjects = baseList.filter((p) => p.id !== selectedProject?.id);

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
            {userCoords
              ? "Nearby job sites based on your location"
              : "Couldn't detect your location — search or create new"}
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
                  : "Location unavailable"}
              </span>
            </div>
          </div>

          {/* Search — fallback flow only */}
          {!userCoords && (
            <div className="relative">
              <IconSearch
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects by name or address"
                className="pl-9 h-11 rounded-full"
              />
            </div>
          )}

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
                  <div className="w-12 h-12 flex rounded-lg bg-muted shrink-0 items-center justify-center">
                    <IconPhoto
                      stroke={2}
                      className="size-5 text-muted-foreground"
                    />
                  </div>
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

          {/* Other projects */}
          {listProjects.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-muted-foreground tracking-wide px-1">
                {userCoords
                  ? "OR ANOTHER NEARBY"
                  : isSearching
                    ? "SEARCH RESULTS"
                    : "RECENT PROJECTS"}
              </span>
              {listProjects.map((project) => (
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
                      <div className="w-10 h-10 flex rounded-lg bg-muted shrink-0 items-center justify-center">
                        <IconPhoto
                          stroke={2}
                          className="size-5 text-muted-foreground"
                        />
                      </div>
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

          {isSearching && filteredProjects.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No projects match &quot;{searchQuery}&quot;
            </p>
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
