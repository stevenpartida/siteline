import ProjectDirectionButton from "@/components/project/settings/project-directions-button";
import ProjectSettingsActions from "@/components/project/settings/project-settings-actions";
import ProjectSettingsDangerZone from "@/components/project/settings/project-settings-danger-zone";
import ProjectSettingsHeader from "@/components/project/settings/project-settings-header";
import ProjectSettingsStats from "@/components/project/settings/project-settings-stats";
import { createClient } from "@/lib/supabase/server";
import { ProjectSettings } from "@/types/project";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

type ProjectSettingsProps = {
  params: Promise<{ id: string }>;
};

async function ProjectSettingsPage({ params }: ProjectSettingsProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase
    .from("projects")
    .select(
      `id, name, address, created_at, is_starred, photos(count) , documents(count)`,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    return <div>Error loading project</div>;
  }

  if (!data) {
    notFound();
  }

  const projectSettings: ProjectSettings = {
    id: data.id,
    name: data.name,
    address: data.address,
    created_at: data.created_at,
    is_starred: data.is_starred,
    photoCount: data.photos[0].count,
    docCount: data.documents[0].count,
  };

  return (
    <div>
      <div>
        <ProjectSettingsHeader
          id={projectSettings.id}
          name={projectSettings.name}
          address={projectSettings.address}
        />
      </div>
      <div>
        <ProjectSettingsActions
          id={projectSettings.id}
          name={projectSettings.name}
          address={projectSettings.address}
          isStarred={projectSettings.is_starred}
        />
      </div>
      <div>
        <ProjectDirectionButton address={projectSettings.address} />
      </div>
      <div>
        <ProjectSettingsStats
          photoCount={projectSettings.photoCount}
          docCount={projectSettings.docCount}
          created_at={projectSettings.created_at}
        />
      </div>
      <div className="mt-6">
        <ProjectSettingsDangerZone id={projectSettings.id} />
      </div>
    </div>
  );
}

export default ProjectSettingsPage;
