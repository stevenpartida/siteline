"use client";
import { searchProject, getCurrentPosition } from "@/lib/helpers";
import React, { useState, useEffect } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { ProjectWithThumbnail } from "@/types/project";
import ProjectsList from "./projects-list";
import { ScrollArea } from "../ui/scroll-area";
import type { Coordinates } from "@/types/location";

type ProjectsViewProps = {
  projects: ProjectWithThumbnail[];
  firstName: string;
};

function ProjectsView({ projects, firstName }: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    getCurrentPosition()
      .then(setUserCoords)
      .catch(() => null);
  }, []);

  const visibleProjects = searchProject(projects, searchQuery);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-background px-4 pt-6 pb-4 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-foreground">
            Welcome{firstName ? `, ${firstName}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Where are we working today?
          </p>
        </div>
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
