import { Company } from "@/types/account";
import { Role } from "@/types/db";
import {
  IconBuilding,
  IconEdit,
  IconLicense,
  IconPlus,
  IconUserPlus,
} from "@tabler/icons-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

type CompanyCardProps = {
  company: Company;
  role: Role;
  memberCount: number;
  projectCount: number;
  onEdit: () => void;
};

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  project_manager: "PM",
  crew: "Crew",
};

function CompanyCard({
  company,
  role,
  memberCount,
  projectCount,
  onEdit,
}: CompanyCardProps) {
  const canEdit = role === "owner";
  return (
    <main className="flex flex-col bg-card border border-muted-foreground/20 rounded-3xl p-4 mt-8">
      <div className="flex flex-row items-start justify-between gap-3 ">
        <div className="flex flex-row items-center gap-3 min-w-0">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background">
            <IconBuilding className="size-6" />
          </div>
          <div className="flex flex-col items-start justify-center min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-base tracking-tight font-bold truncate capitalize">
                {company.name}
              </p>
              <Badge variant="secondary" className="shrink-0">
                {ROLE_LABELS[role]}
              </Badge>
            </div>
            {company.license_number ? (
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <IconLicense className="size-4" />
                <span>{company.license_number}</span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="xs"
                className="rounded-full bg-card border-dashed border-foreground/30 mt-1 h-5 px-1.5 gap-1 text-[10px] [&_svg]:size-2.5"
                onClick={onEdit}
                disabled={!canEdit}
              >
                <IconPlus />
                Add license number
              </Button>
            )}
          </div>
        </div>

        {canEdit && (
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shrink-0"
            onClick={onEdit}
            aria-label="Edit company"
          >
            <IconEdit className="size-4" />
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      <div className="flex flex-row items-stretch">
        <div className="flex-1 flex flex-col items-start justify-center">
          <span className="text-2xl font-semibold tracking-tight">
            {memberCount}
          </span>
          <p className="text-xs font-medium text-muted-foreground">Members</p>
        </div>
        <Separator orientation="vertical" className="mx-4" />
        <div className="flex-1 flex flex-col items-start justify-center">
          <span className="text-2xl font-semibold tracking-tight">
            {projectCount}
          </span>
          <p className="text-xs font-medium text-muted-foreground">Projects</p>
        </div>
      </div>
      <Button
        className="w-full rounded-full text-base py-6 mt-6 font-semibold tracking-tight gap-2"
        size="lg"
      >
        <IconUserPlus stroke={2} className="size-5" data-icon="inline-start" />
        Invite Teammates
      </Button>
    </main>
  );
}

export default CompanyCard;
