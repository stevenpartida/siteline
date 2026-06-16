"use client";
import { searchProject } from "@/lib/helpers";
import React, { useState } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { ProjectWithThumbnail } from "@/types/project";
import ProjectsList from "./projects-list";
import { ScrollArea } from "../ui/scroll-area";

type ProjectsViewProps = {
  projects: ProjectWithThumbnail[];
};

function ProjectsView({ projects }: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const visibleProjects = searchProject(projects, searchQuery);

  return (
    <div className=" h-full flex flex-col">
      <div className="bg-background p-4">
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
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default ProjectsView;
