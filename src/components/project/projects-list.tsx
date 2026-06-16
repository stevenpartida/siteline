import { ProjectWithThumbnail } from "@/types/project";
import EmptyState from "./empty-state";
import { IconFolderOff, IconFolderPlus } from "@tabler/icons-react";
import { ProjectCard } from "./project-card";

type ProjectsListProps = {
  projects: ProjectWithThumbnail[];
  isSearching: boolean;
};
function ProjectsList({ projects, isSearching }: ProjectsListProps) {
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
        />
      ))}
    </div>
  );
}

export default ProjectsList;
