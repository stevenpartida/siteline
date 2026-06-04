"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getAuthUser } from "./auth";
import { createProjectSchema } from "@/lib/validators/project";

export async function createProjectAction(
  formData: FormData,
): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Fetch auth user
  const user = await getAuthUser();
  if (!user) {
    return { error: "Not authenticated " };
  }

  console.log("user", user);

  // Fetch company_id from user table
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (userError || !userData) {
    return { error: "Failed to fetch user data" };
  }

  // Parse raw data
  const rawData = {
    project_name: formData.get("project_name"),
    address_line_1: formData.get("address_line_1"),
    address_line_2: formData.get("address_line_2"),
    city: formData.get("city"),
    state: formData.get("state"),
    zip_code: formData.get("zip_code"),
  };

  const parseData = createProjectSchema.safeParse(rawData);
  if (!parseData.success) {
    return { error: parseData.error.issues[0].message };
  }

  const projectName =
    parseData.data.project_name || parseData.data.address_line_1;

  const { address_line_1, address_line_2, city, state, zip_code } =
    parseData.data;

  const address = `${address_line_1}${address_line_2 ? `, ${address_line_2}` : ""}, ${city}, ${state} ${zip_code}`;

  // Insert project into the project table
  const { error: projectError } = await supabase.from("projects").insert({
    name: projectName,
    company_id: userData.company_id,
    address: address,
  });
  if (projectError) {
    return { error: "Failed to create project" };
  }
  return { error: null };
}
