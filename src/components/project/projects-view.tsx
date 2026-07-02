"use client";
import {
  searchProject,
  getCurrentPosition,
  haversineDistance,
} from "@/lib/helpers";
import React, { useState, useEffect, useMemo } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { ProjectWithThumbnail } from "@/types/project";
import ProjectsList from "./projects-list";
import ProjectFilterTabs, { type FilterTab } from "./project-filter-tabs";
import { ScrollArea } from "../ui/scroll-area";
import type { Coordinates } from "@/types/location";

type ProjectsViewProps = {
  projects: ProjectWithThumbnail[];
  firstName: string;
};

const NEARBY_RADIUS_MILES = 1;

function ProjectsView({ projects, firstName }: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    getCurrentPosition()
      .then(setUserCoords)
      .catch(() => null);
  }, []);

  // Step 1: apply the active tab filter to the full project list
  const tabFilteredProjects = useMemo(() => {
    switch (activeTab) {
      case "starred":
        return projects.filter((p) => p.is_starred);

      case "recent":
        return [...projects].sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );

      case "nearby":
        if (!userCoords) return [];
        return projects.filter((p) => {
          if (!p.project_lat || !p.project_lng) return false;
          const distance = haversineDistance(
            userCoords.lat,
            userCoords.lng,
            p.project_lat,
            p.project_lng,
          );
          return distance <= NEARBY_RADIUS_MILES;
        });

      case "all":
      default:
        return projects;
    }
  }, [projects, activeTab, userCoords]);

  // Step 2: search narrows within whatever the tab already filtered to
  const visibleProjects = searchProject(tabFilteredProjects, searchQuery);

  return (
    <div className="h-full flex flex-col">
      {/* Sticky header + search + filters */}
      <div className="bg-background pt-6 pb-2 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5 px-4">
          <h1 className="text-2xl font-bold text-foreground">
            Hey{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">Where are we working?</p>
        </div>
        <div className="px-4">
          <InputGroup>
            <InputGroupInput
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search projects"
            />
            <InputGroupAddon>
              <IconSearch aria-hidden="true" />
            </InputGroupAddon>
          </InputGroup>
        </div>
        <ProjectFilterTabs activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div
        className={`flex-1 h-full ${isSearchFocused ? "overflow-hidden" : ""}`}
      >
        <ScrollArea className="flex-1 h-full">
          <div className="p-4 pb-48">
            <ProjectsList
              projects={visibleProjects}
              isSearching={searchQuery.trim() !== ""}
              userCoords={userCoords}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default ProjectsView;
