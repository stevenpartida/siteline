"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getAuthUser } from "./auth";
import { createProjectSchema } from "@/lib/validators/project";
import { redirect } from "next/navigation";

export async function createProjectAction(
  formData: FormData,
): Promise<{ error: string | null; projectId: string | null }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch auth user
  const user = await getAuthUser();
  if (!user) {
    return { error: "Not authenticated ", projectId: null };
  }

  // Fetch company_id from user table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (userError || !userData) {
    return { error: "Failed to fetch user data", projectId: null };
  }

  // Parse raw data
  const rawData = {
    project_name: formData.get("project_name") ?? "",
    address_line_1: formData.get("address_line_1") ?? "",
    address_line_2: formData.get("address_line_2") ?? "",
    city: formData.get("city") ?? "",
    state: formData.get("state") ?? "",
    zip_code: formData.get("zip_code") ?? "",
  };

  const parseData = createProjectSchema.safeParse(rawData);
  if (!parseData.success) {
    return { error: parseData.error.issues[0].message, projectId: null };
  }

  const projectName =
    parseData.data.project_name || parseData.data.address_line_1;

  const { address_line_1, address_line_2, city, state, zip_code } =
    parseData.data;

  const lat = formData.get("lat");
  const lng = formData.get("lng");
  const location = lat && lng ? `POINT(${lng} ${lat})` : null;

  const address = `${address_line_1}${address_line_2 ? `, ${address_line_2}` : ""}, ${city}, ${state} ${zip_code}`;

  // Insert project into the project table
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      name: projectName,
      company_id: userData.company_id,
      address: address,
      ...(location ? { location } : {}),
    })
    .select()
    .single();
  if (projectError) {
    return { error: "Failed to create project", projectId: null };
  }
  return { error: null, projectId: project.id };
}

export async function deleteProjectAction(
  id: string,
): Promise<{ error: string } | void> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: project, error } = await supabase
    .from("projects")
    .select("company_id")
    .eq("id", id)
    .single();

  if (error) {
    return { error: `Database: ${error.message}` };
  }

  if (!project) {
    return { error: "Project not found" };
  }

  const folderPath = `${project.company_id}/${id}`;

  // List and delete photos
  const { data: photos, error: listPhotoError } = await supabase.storage
    .from("photos")
    .list(folderPath);

  if (listPhotoError) {
    return { error: `Failed to list photos: ${listPhotoError.message}` };
  }

  if (photos && photos.length > 0) {
    const photoPaths = photos.map((file) => `${folderPath}/${file.name}`);

    const { error: photoError } = await supabase.storage
      .from("photos")
      .remove(photoPaths);

    if (photoError) {
      return { error: `Failed to delete photos: ${photoError.message}` };
    }
  }
  // List and delete documents
  const { data: documents, error: listDocError } = await supabase.storage
    .from("documents")
    .list(folderPath);

  if (listDocError) {
    return { error: `Failed to list documents: ${listDocError.message}` };
  }

  if (documents && documents.length > 0) {
    const documentPaths = documents.map((file) => `${folderPath}/${file.name}`);

    const { error: documentError } = await supabase.storage
      .from("documents")
      .remove(documentPaths);

    if (documentError) {
      return { error: `Failed to delete documents: ${documentError.message}` };
    }
  }

  // Delete project row
  const { error: deleteError } = await supabase
    .from("projects")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return { error: `Failed to delete project: ${deleteError.message}` };
  }

  redirect("/projects");
}
