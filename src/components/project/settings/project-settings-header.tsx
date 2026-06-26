import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import React from "react";

type ProjectSettingsHeaderProps = {
  id: string;
  name: string;
  address: string;
};

function ProjectSettingsHeader({
  id,
  name,
  address,
}: ProjectSettingsHeaderProps) {
  return (
    <div className="text-foreground flex flex-col ">
      <div className="relative flex items-center p-4">
        <Link href={`/projects/${id}`}>
          <Button variant="frosted" size="icon-lg" className="rounded-full">
            <IconChevronLeft stroke={1.5} className="size-4" />
          </Button>
        </Link>
        <span className="absolute inset-x-0 text-center text-xs font-medium">
          Project Settings
        </span>
      </div>
      <div className="flex flex-col p-4 text-center">
        <h2 className="text-2xl font-bold">{name}</h2>
        <span className="text-sm text-muted-foreground">{address}</span>
      </div>
    </div>
  );
}

export default ProjectSettingsHeader;
