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
  project_lat: number | null;
  project_lng: number | null;
};
async function ProjectsPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const [{ data, error }, { data: userData }] = await Promise.all([
    supabase.rpc("get_projects_with_thumbnails"),
    supabase.from("users").select("full_name").single(),
  ]);

  if (error) throw error;

  const firstName = userData?.full_name?.split(" ")[0] ?? "";

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
    project_lat: row.project_lat,
    project_lng: row.project_lng,
  }));

  return <ProjectsView projects={projects} firstName={firstName} />;
}

export default ProjectsPage;
