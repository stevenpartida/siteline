"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function toggleProjectStarredAction(
  projectId: string,
  isStarred: boolean,
) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase
    .from("projects")
    .update({ is_starred: isStarred })
    .eq("id", projectId);

  if (error) throw new Error(error.message);

  revalidatePath("/projects");
}
