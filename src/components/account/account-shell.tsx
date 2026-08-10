"use client";

import { AccountData } from "@/types/account";
import AccountHeader from "./account-header";
import CompanyCard from "./company-card";
import ContactInfo from "./contact-info";

function AccountShell({ data }: { data: AccountData }) {
  const { profile, company, counts } = data;

  return (
    <main className="px-4">
      <h1 className="text-3xl font-bold tracking-tight py-6">Account</h1>
      <div>
        <AccountHeader profile={profile} />
      </div>
      <div>
        <CompanyCard
          company={company}
          role={profile.role}
          memberCount={counts.members}
          projectCount={counts.projects}
        />
      </div>
      <div>
        <ContactInfo profile={profile} />
      </div>
    </main>
  );
}

export default AccountShell;
