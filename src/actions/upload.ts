"use server";

import { cookies } from "next/headers";
import { getAuthUser } from "./auth";
import { createClient } from "@/lib/supabase/server";

export async function uploadMediaAction(
  file: File,
  bucket: "photos" | "documents",
  projectId: string,
  location: { lat: number; lng: number } | null = null,
): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Check if user is authticated
  const user = await getAuthUser();
  if (!user) {
    return { error: "User is not authenticated." };
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("full_name, company_id")
    .eq("id", user.id)
    .single();
  if (!profile) {
    return { error: "User doesnt exit in user table." };
  }
  if (!profile.company_id) {
    return { error: "User has no company." };
  }

  // Construct file path
  const fileId = crypto.randomUUID();
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const filePath = `${profile.company_id}/${projectId}/${fileId}.${ext}`;

  // Upload file to storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (storageError) {
    return { error: `Storage: ${storageError.message}` };
  }

  // Insert file into table row
  const { error: tableError } = await supabase.from(bucket).insert({
    id: fileId,
    project_id: projectId,
    uploaded_by: user.id,
    uploaded_by_name: profile.full_name,
    storage_path: storageData.path,
    size_bytes: file.size,
    ...(bucket === "photos" &&
      location && { location: `POINT(${location.lng} ${location.lat})` }),
    ...(bucket === "documents" && { name: file.name }),
  });
  if (tableError) {
    return { error: `Table: ${tableError.message}` };
  }

  return { error: null };
}
