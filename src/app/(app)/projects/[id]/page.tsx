import ProjectHero from "@/components/project/project-hero";
import ProjectTabs from "@/components/project/project-tabs";
import { createClient } from "@/lib/supabase/server";
import { Photo } from "@/types/db";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type ProjectProps = {
  params: Promise<{ id: string }>;
};

async function ProjectPage({ params }: ProjectProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: project } = await supabase
    .from("projects")
    .select("*, photos(*), documents(*)")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  const sortProjectsByRecent = project.photos.sort((a: Photo, b: Photo) => {
    return b.created_at > a.created_at ? 1 : -1;
  });

  const coverPhoto = sortProjectsByRecent[0]?.storage_path ?? null;
  const coverPhotoUrl = coverPhoto
    ? supabase.storage.from("photos").getPublicUrl(coverPhoto).data.publicUrl
    : null;

  return (
    <div className="h-full flex flex-col">
      <div className="shrink-0">
        <ProjectHero coverPhotoUrl={coverPhotoUrl} />
      </div>
      <div className="flex-1 min-h-0 flex flex-col pt-4">
        <div className="flex flex-col shrink-0 px-4">
          <span className="text-2xl text-foreground font-bold">
            {project.name}
          </span>
          <span className="text-sm text-muted-foreground font-normal">
            {project.address}
          </span>
        </div>
        <div className="flex-1 min-h-0">
          <ProjectTabs
            projectId={id}
            photos={sortProjectsByRecent}
            documents={project.documents}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectPage;
