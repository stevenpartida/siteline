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
import ProjectsHeader from "./projects-header";

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

  const nearbyCount = useMemo(() => {
    if (!userCoords) return null;
    return projects.filter((project) => {
      if (!project.project_lat || !project.project_lng) return false;
      const distance = haversineDistance(
        userCoords.lat,
        userCoords.lng,
        project.project_lat,
        project.project_lng,
      );
      return distance < +NEARBY_RADIUS_MILES;
    }).length;
  }, [projects, userCoords]);

  // Step 2: search narrows within whatever the tab already filtered to
  const visibleProjects = searchProject(tabFilteredProjects, searchQuery);

  const isEmpty = visibleProjects.length === 0;

  return (
    <div className="h-full flex flex-col">
      {/* Sticky header + search + filters */}
      <div className="flex flex-col gap-3 pt-6 pb-2 bg-background">
        <ProjectsHeader
          firstName={firstName}
          nearbyCount={nearbyCount}
          totalCount={projects.length}
        />
        <div className="px-4">
          <InputGroup className="py-5 rounded-full">
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

      {isEmpty ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center pb-60">
          <ProjectsList
            projects={visibleProjects}
            isSearching={searchQuery.trim() !== ""}
            userCoords={userCoords}
          />
        </div>
      ) : (
        <div
          className={`flex-1 min-h-0 ${isSearchFocused ? "overflow-hidden" : ""}`}
        >
          <ScrollArea className="h-full">
            <div className="p-4 mb-30">
              <ProjectsList
                projects={visibleProjects}
                isSearching={searchQuery.trim() !== ""}
                userCoords={userCoords}
              />
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

export default ProjectsView;
