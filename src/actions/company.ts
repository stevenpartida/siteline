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

export async function createInviteAction(): Promise<{
  token: string | null;
  error: string | null;
}> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { token: null, error: "Not authenticated " };
  }

  // Get user's company_id and confirm owner role
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("company_id, role")
    .eq("id", user.id)
    .single();

  if (!userData) {
    return { token: null, error: "Failed to fetch user" };
  }
  if (userError || !userData.company_id) {
    return { token: null, error: "No company found" };
  }

  if (userData.role !== "owner") {
    return { token: null, error: "Only owners can invite crew" };
  }

  //Generate token and expiroy
  const token = crypto.randomUUID();
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 7);

  // Insert invite row
  const { error: inviteError } = await supabase.from("invites").insert({
    company_id: userData.company_id,
    token,
    status: "pending",
    expires_at: expires_at.toISOString(),
  });
  if (inviteError) {
    return { token: null, error: "Failed to create invite" };
  }

  return { token, error: null };
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
