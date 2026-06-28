import { ProjectWithThumbnail } from "@/types/project";
import EmptyState from "./empty-state";
import { IconFolderOff, IconFolderPlus } from "@tabler/icons-react";
import { ProjectCard } from "./project-card";
import type { Coordinates } from "@/types/location";

type ProjectsListProps = {
  projects: ProjectWithThumbnail[];
  isSearching: boolean;
  userCoords: Coordinates | null;
};

function ProjectsList({
  projects,
  isSearching,
  userCoords,
}: ProjectsListProps) {
  if (projects.length === 0 && !isSearching) {
    return (
      <EmptyState
        icon={IconFolderPlus}
        title="No Projects Yet"
        subtext="Add a job site to start. Photos auto-file by GPS. Documents stay right alongside them."
      />
    );
  }

  if (projects.length === 0 && isSearching) {
    return (
      <EmptyState
        icon={IconFolderOff}
        title="No Results Found"
        subtext="Try searching different keywords."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          name={project.name}
          address={project.address}
          isStarred={project.is_starred}
          thumbnailUrl={project.thumbnail_url}
          projectLat={project.project_lat}
          projectLng={project.project_lng}
          userCoords={userCoords}
        />
      ))}
    </div>
  );
}

export default ProjectsList;
