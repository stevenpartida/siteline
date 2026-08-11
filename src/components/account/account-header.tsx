import { userInitials } from "@/lib/helpers";
import { Profile } from "@/types/account";
import React from "react";
import { Button } from "../ui/button";
import { IconEdit } from "@tabler/icons-react";

function AccountHeader({
  profile,
  onEdit,
}: {
  profile: Profile;
  onEdit: () => void;
}) {
  return (
    <header className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center  gap-4">
        <div className="flex size-16 items-center justify-center rounded-full bg-foreground text-lg font-semibold text-background">
          {userInitials(profile.fullName)}
        </div>
        <div className="flex flex-col items-start justify-center">
          <div className="capitalize text-2xl font-bold tracking-tight shrink">
            {profile.fullName}
          </div>
          <div className="text-sm text-muted-foreground tracking-tight">
            {profile.email}
          </div>
        </div>
      </div>
      <Button
        variant="outline"
        className="rounded-full bg-card"
        onClick={onEdit}
      >
        <IconEdit stroke={2} />
        Edit
      </Button>
    </header>
  );
}

export default AccountHeader;
