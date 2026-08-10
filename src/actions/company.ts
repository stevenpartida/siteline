"use server";

import { createClient } from "@/lib/supabase/server";
import { createCompanySchema } from "@/lib/validators/company";
import { cookies } from "next/headers";
import { getAuthUser } from "./auth";

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
    company_name: formData.get("company_name"),
  };

  const parseData = createCompanySchema.safeParse(rawData);
  if (!parseData.success) {
    return { error: parseData.error.issues[0].message };
  }

  const { company_name } = parseData.data;

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
    .update({ company_id: company.id, role: "owner" })
    .eq("id", user.id);

  if (userError) {
    return { error: "Failed to update users table" };
  }

  return { error: null };
}

export async function createInviteAction(
  role: "crew" | "project_manager",
): Promise<{ error: string | null; token?: string }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const user = await getAuthUser();
  if (!user) return { error: "Not authenticated" };

  // Only owners can create invites (matches your RLS: invites insert owner only)
  const { data: userData } = await supabase
    .from("users")
    .select("company_id, role")
    .eq("id", user.id)
    .single();

  if (!userData?.company_id) return { error: "No company found" };
  if (userData.role !== "owner") return { error: "Only owners can invite" };

  const token = crypto.randomUUID(); // or a shorter nanoid if you prefer prettier links
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours

  const { error } = await supabase.from("invites").insert({
    company_id: userData.company_id,
    sender_id: user.id,
    role, // 'crew' or 'project_manager' from the toggle
    token,
    status: "pending",
    expires_at: expiresAt.toISOString(),
  });

  if (error) return { error: "Failed to create invite" };
  return { error: null, token };
}

export async function revokeInviteAction(
  token: string,
): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get Authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Not authenticated" };
  }

  // Confirm user owner role
  const { data: userData } = await supabase
    .from("users")
    .select("company_id, role")
    .eq("id", user.id)
    .single();

  if (!userData) {
    return { error: "Failed to fetch user" };
  }

  if (userData.role !== "owner") {
    return { error: "Only owners can revoke invites" };
  }

  const { error } = await supabase
    .from("invites")
    .update({ status: "revoked" })
    .eq("token", token)
    .eq("company_id", userData.company_id);

  if (error) {
    return { error: "Failed to revoke invite" };
  }

  return { error: null };
}
