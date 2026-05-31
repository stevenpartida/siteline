import SignOutButton from "@/components/auth/sign-out-button";
import InviteButton from "@/components/company/invite-button";
import React from "react";

function page() {
  return (
    <div>
      dashboard
      <SignOutButton />
      <InviteButton />
    </div>
  );
}

export default page;
