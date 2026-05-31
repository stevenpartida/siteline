"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { getAuthUser } from "./auth";

export async function validateInviteAction(token: string): Promise<{
  invite: { company_id: string; company_name: string } | null;
  error: string | null;
}> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Grab the invite entity using the token param
  const { data } = await supabase
    .from("invites")
    .select("company_id, status, expires_at, companies(name)")
    .eq("token", token)
    .single();

  if (!data) {
    return { invite: null, error: "Failed to get invite data" };
  }

  if (data.status === "revoked") {
    return { invite: null, error: "Invite has been revoked" };
  }

  if (new Date(data.expires_at) < new Date()) {
    return { invite: null, error: "Invite has expired" };
  }

  const companies = Array.isArray(data.companies)
    ? data.companies[0]
    : data.companies;

  const invite = {
    company_id: data.company_id,
    company_name: companies?.name ?? "Unknown Company",
  };

  return { invite, error: null };
}

export async function joinCompanyAction(
  token: string,
): Promise<{ error: string | null }> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  // Chech user auth
  const user = await getAuthUser();
  if (!user) {
    return { error: "Not Authenticated" };
  }

  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.id)
    .single();

  if (userData?.company_id) {
    return { error: "Already belongs to a company" };
  }

  // Get invite from invites table by token
  const { data } = await supabase
    .from("invites")
    .select("company_id, status, expires_at")
    .eq("token", token)
    .single();

  if (!data) {
    return { error: "Failed to get invite data" };
  }

  // Validate invite with status and expiry checks
  if (data.status === "revoked") {
    return { error: "Invite has been revoked" };
  }

  if (new Date(data.expires_at) < new Date()) {
    return { error: "Invite has expired" };
  }

  // Update user table with company_id and role
  const { error } = await supabase
    .from("users")
    .update({ company_id: data.company_id, role: "crew" })
    .eq("id", user.id);

  if (error) {
    return { error: "failed to update user" };
  }

  return { error: null };
}
