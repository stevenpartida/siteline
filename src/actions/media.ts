"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "./auth";

type Bucket = "photos" | "documents";

export async function deleteMediaAction(
  bucket: Bucket,
  ids: string[],
  projectId: string,
): Promise<{ error: string | null }> {
  if (ids.length === 0) return { error: null };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const user = await getAuthUser();
  if (!user) return { error: "Not authenticated" };

  const { data: rows, error: fetchError } = await supabase
    .from(bucket)
    .select("id, storage_path")
    .eq("project_id", projectId)
    .in("id", ids);

  if (fetchError) return { error: `Lookup failed: ${fetchError.message}` };
  if (!rows || rows.length !== ids.length) {
    return { error: "One or more items not found for this project" };
  }

  const paths = rows.map((row) => row.storage_path);
  const { error: storageError } = await supabase.storage
    .from(bucket)
    .remove(paths);
  if (storageError) return { error: `Storage: ${storageError.message}` };

  const { error: deleteError } = await supabase
    .from(bucket)
    .delete()
    .in("id", ids);
  if (deleteError) return { error: `Database: ${deleteError.message}` };

  revalidatePath(`/projects/${projectId}`);
  return { error: null };
}

export async function getMediaDownloadsAction(
  bucket: Bucket,
  ids: string[],
  projectId: string,
): Promise<{
  error: string | null;
  files: { url: string; name: string }[];
}> {
  if (ids.length === 0) return { error: null, files: [] };

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const user = await getAuthUser();
  if (!user) return { error: "Not authenticated", files: [] };

  const { data: rows, error: fetchError } =
    bucket === "documents"
      ? await supabase
          .from("documents")
          .select("id, storage_path, name")
          .eq("project_id", projectId)
          .in("id", ids)
      : await supabase
          .from("photos")
          .select("id, storage_path")
          .eq("project_id", projectId)
          .in("id", ids);

  if (fetchError)
    return { error: `Lookup failed: ${fetchError.message}`, files: [] };
  if (!rows || rows.length !== ids.length)
    return { error: "One or more items not found for this project", files: [] };

  const paths = rows.map((row) => row.storage_path);
  const { data: signed, error: signedError } = await supabase.storage
    .from(bucket)
    .createSignedUrls(paths, 60);

  if (signedError || !signed)
    return { error: `Storage: ${signedError?.message ?? "unknown"}`, files: [] };

  const files: { url: string; name: string }[] = [];
  signed.forEach((entry, i) => {
    if (!entry.signedUrl) return;
    const row = rows[i];
    const fallbackName = row.storage_path.split("/").pop() ?? "download";
    const name =
      "name" in row && row.name ? row.name : fallbackName;
    files.push({ url: entry.signedUrl, name });
  });

  return { error: null, files };
}
