"use client";

import { AccountData } from "@/types/account";
import { useState } from "react";
import AccountHeader from "./account-header";
import CompanyCard from "./company-card";
import ContactInfo from "./contact-info";
import EditAccountDrawer from "./edit-account-drawer";

function AccountShell({ data }: { data: AccountData }) {
  const { profile, company, counts } = data;
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = () => setEditOpen(true);

  return (
    <main className="px-4">
      <h1 className="text-3xl font-bold tracking-tight py-6">Account</h1>
      <div>
        <AccountHeader profile={profile} onEdit={openEdit} />
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
        <ContactInfo profile={profile} onEdit={openEdit} />
      </div>

      <EditAccountDrawer
        open={editOpen}
        onOpenChange={setEditOpen}
        profile={profile}
      />
    </main>
  );
}

export default AccountShell;
