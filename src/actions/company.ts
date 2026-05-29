"use server";

import { createClient } from "@/lib/supabase/server";
import { createCompanySchema } from "@/lib/validators/company";
import { cookies } from "next/headers";

export async function createCompanyAction(
  formData: FormData,
): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get Authenticated User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  console.log("user id:", user.id);

  // Parse raw data
  const rawData = {
    full_name: formData.get("full_name"),
    company_name: formData.get("company_name"),
  };

  const parseData = createCompanySchema.safeParse(rawData);
  if (!parseData.success) {
    return { error: parseData.error.issues[0].message };
  }

  const { full_name, company_name } = parseData.data;

  // Insert new company into database
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({ name: company_name, owner_id: user.id })
    .select("id")
    .single();

  if (companyError || !company) {
    return { error: "Failed to create company" };
  }

  // Update User Table
  const { error: userError } = await supabase
    .from("users")
    .update({ full_name: full_name, company_id: company.id, role: "owner" })
    .eq("id", user.id);

  if (userError) {
    return { error: "Failed to update users table" };
  }

  return { error: null };
}
