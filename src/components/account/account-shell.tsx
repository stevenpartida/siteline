"use client";

import { AccountData } from "@/types/account";
import { useState } from "react";
import AccountHeader from "./account-header";
import CompanyCard from "./company-card";
import ContactInfo from "./contact-info";
import EditAccountDrawer from "./edit-account-drawer";
import EditCompanyDrawer from "./edit-company-drawer";

function AccountShell({ data }: { data: AccountData }) {
  const { profile, company, counts } = data;
  const [editAccountOpen, setEditAccountOpen] = useState(false);
  const [editCompanyOpen, setEditCompanyOpen] = useState(false);

  const openEditAccount = () => setEditAccountOpen(true);
  const openEditCompany = () => setEditCompanyOpen(true);

  return (
    <main className="px-4">
      <h1 className="text-3xl font-bold tracking-tight py-6">Account</h1>
      <div>
        <AccountHeader profile={profile} onEdit={openEditAccount} />
      </div>
      <div>
        <CompanyCard
          company={company}
          role={profile.role}
          memberCount={counts.members}
          projectCount={counts.projects}
          onEdit={openEditCompany}
        />
      </div>
      <div>
        <ContactInfo profile={profile} onEdit={openEditAccount} />
      </div>

      <EditAccountDrawer
        open={editAccountOpen}
        onOpenChange={setEditAccountOpen}
        profile={profile}
      />

      <EditCompanyDrawer
        open={editCompanyOpen}
        onOpenChange={setEditCompanyOpen}
        company={company}
      />
    </main>
  );
}

export default AccountShell;
