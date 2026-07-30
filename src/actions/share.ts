"use server";

import { createClient } from "@/lib/supabase/server";
import { ShareViewType } from "@/types/db";
import { randomBytes } from "crypto";
import { cookies } from "next/headers";

type GenerateShareLinkResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function generateShareLink(
  projectId: string,
  photoIds: string[],
  viewType: ShareViewType,
): Promise<GenerateShareLinkResult> {
  // Return false when photo id array is empty
  if (photoIds.length === 0) {
    return { ok: false, error: "No photos selected" };
  }

  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  // Check if its a valid user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "Not Authenticated" };
  }

  //Confirm the project is connect to the user
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .single();

  if (!project) {
    return { ok: false, error: "Project not found" };
  }

  if (projectError) {
    return { ok: false, error: projectError };
  }

  //Confirm every photo id belongs to this project
  const { data: validPhotos, error: photosError } = await supabase
    .from("photos")
    .select("id")
    .eq("project_id", projectId)
    .in("id", photoIds);

  if (photosError) {
    return { ok: false, error: "Could not verify photos." };
  }

  //Confirm every photo is valid by cross checking the length of valid photos with photo id array
  if (!validPhotos || validPhotos.length !== photoIds.length) {
    return { ok: false, error: "One or more photos are invalid" };
  }

  // Create the shareable token
  const token = randomBytes(24).toString("base64url");

  // Insert the token and view type into the table
  const { data: link, error: linkError } = await supabase
    .from("share_links")
    .insert({
      token,
      project_id: projectId,
      created_by: user.id,
      view_type: viewType,
    })
    .select("id")
    .single();

  if (linkError || !link) {
    return { ok: false, error: "Could not create share link." };
  }

  // Insert the join rows (connect the share links -> share photo -> photos)
  const joinRows = validPhotos.map((photo) => ({
    share_link_id: link.id,
    photo_id: photo.id,
  }));

  const { error: joinError } = await supabase
    .from("share_link_photos")
    .insert(joinRows);

  if (joinError) {
    console.error("JOIN INSERT ERROR:", joinError); // ← add this
    await supabase.from("share_links").delete().eq("id", link.id);
    return { ok: false, error: "Could not attach photos to link." };
  }

  return { ok: true, token };
}
