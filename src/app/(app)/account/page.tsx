import { getAuthUser } from "@/actions/auth";
import AccountShell from "@/components/account/account-shell";
import { createClient } from "@/lib/supabase/server";
import { AccountData } from "@/types/account";
import { Company, User } from "@/types/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function AccountPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);

  const user = await getAuthUser();
  if (!user) redirect("/");

  // Fetch profile details
  const { data: userInfo, error } = await supabase
    .from("users")
    .select("full_name, role, created_at, gps_autofile, company_id, phone")
    .eq("id", user.id)
    .single<
      Pick<
        User,
        | "full_name"
        | "role"
        | "created_at"
        | "gps_autofile"
        | "company_id"
        | "phone"
      >
    >();

  if (error || !userInfo) redirect("/sign-in");
  if (!userInfo.company_id) redirect("/onboarding/company");

  // Fetch company details
  const { data: companyInfo } = await supabase
    .from("companies")
    .select("name, license_number")
    .eq("id", userInfo.company_id)
    .single<Pick<Company, "name" | "license_number">>();

  if (!companyInfo) redirect("/onboarding/company");

  // Fetch team members and project count for this company in parallel
  const [{ data: teamRows }, { count: projectCount }] = await Promise.all([
    supabase
      .from("users")
      .select("id, full_name, role")
      .eq("company_id", userInfo.company_id),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("company_id", userInfo.company_id),
  ]);

  const team = (teamRows ?? []).map((member) => ({
    id: member.id,
    fullName: member.full_name ?? "",
    role: member.role,
  }));

  const data: AccountData = {
    profile: {
      fullName: userInfo.full_name ?? "",
      role: userInfo.role,
      email: user.email ?? "",
      createdAt: userInfo.created_at,
      gpsAutofile: userInfo.gps_autofile,
      phone: userInfo.phone,
    },
    company: {
      name: companyInfo.name,
      license_number: companyInfo.license_number,
    },
    counts: {
      members: team.length,
      projects: projectCount ?? 0,
    },
    team,
  };

  return (
    <main>
      <AccountShell data={data} />
    </main>
  );
}

export default AccountPage;
