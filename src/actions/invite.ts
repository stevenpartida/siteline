"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
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

  // Get invite — now also selecting role
  const { data: invite } = await supabase
    .from("invites")
    .select("company_id, status, expires_at, role")
    .eq("token", token)
    .single();

  if (!invite) {
    return { error: "Invalid invite link" };
  }

  // Validate status: must be pending (not revoked, not already accepted)
  if (invite.status !== "pending") {
    return { error: "This invite is no longer valid" };
  }

  if (new Date(invite.expires_at) < new Date()) {
    return { error: "Invite has expired" };
  }

  // Assign the role the invite specifies (project_manager or crew) — never owner
  const role = invite.role === "project_manager" ? "project_manager" : "crew";

  const { error: updateError } = await supabase
    .from("users")
    .update({ company_id: invite.company_id, role })
    .eq("id", user.id);

  if (updateError) {
    return { error: "Failed to join company" };
  }

  revalidatePath("/account");
  return { error: null };
}
