import ProjectsView from "@/components/project/projects-view";
import { createClient } from "@/lib/supabase/server";
import { ProjectWithThumbnail } from "@/types/project";
import { cookies } from "next/headers";
import React from "react";

type RawProjectRow = {
  id: string;
  company_id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number } | null;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
  thumbnail_storage_path: string | null;
};
async function ProjectsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const { data, error } = await supabase.rpc("get_projects_with_thumbnails");

  if (error) throw error;

  const projects: ProjectWithThumbnail[] = (
    (data ?? []) as RawProjectRow[]
  ).map((row) => ({
    id: row.id,
    company_id: row.company_id,
    name: row.name,
    address: row.address,
    location: row.location,
    is_starred: row.is_starred,
    created_at: row.created_at,
    updated_at: row.updated_at,
    thumbnail_url: row.thumbnail_storage_path
      ? supabase.storage.from("photos").getPublicUrl(row.thumbnail_storage_path)
          .data.publicUrl
      : null,
  }));

  return <ProjectsView projects={projects} />;
}

export default ProjectsPage;
