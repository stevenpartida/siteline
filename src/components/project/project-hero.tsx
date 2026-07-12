"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import { IconChevronLeft, IconShare2, IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";

type ProjectHeroProps = {
  coverPhotoUrl: string | null;
  projectId: string;
  disabled: boolean;
  onShareClick: () => void;
};

function ProjectHero({
  coverPhotoUrl,
  projectId,
  disabled,
  onShareClick,
}: ProjectHeroProps) {
  const backButton = disabled ? (
    <Button variant="frosted" size="icon-lg" className="rounded-full" disabled>
      <IconChevronLeft stroke={1.5} className="size-4" />
    </Button>
  ) : (
    <Link href="/projects">
      <Button variant="frosted" size="icon-lg" className="rounded-full">
        <IconChevronLeft stroke={1.5} className="size-4" />
      </Button>
    </Link>
  );

  const menuButton = disabled ? (
    <Button variant="frosted" size="icon-lg" className="rounded-full" disabled>
      <IconMenu2 stroke={1.5} className="size-4" />
    </Button>
  ) : (
    <Link href={`/projects/${projectId}/settings`}>
      <Button variant="frosted" size="icon-lg" className="rounded-full">
        <IconMenu2 stroke={1.5} className="size-4" />
      </Button>
    </Link>
  );

  const navPills = (
    <>
      {backButton}
      <div className="flex gap-2">
        <Button
          variant="frosted"
          size="icon-lg"
          className="rounded-full"
          disabled={disabled}
          onClick={onShareClick}
        >
          <IconShare2 stroke={1.5} className="size-4" />
        </Button>
        {menuButton}
      </div>
    </>
  );

  return (
    <div>
      {coverPhotoUrl ? (
        <div className="relative h-52 w-full">
          <Image
            src={coverPhotoUrl}
            alt="Project cover photo"
            fill
            className="object-cover"
            loading="eager"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 top-0 flex justify-between p-4">
            {navPills}
          </div>
        </div>
      ) : (
        <div className="flex justify-between p-4">{navPills}</div>
      )}
    </div>
  );
}

export default ProjectHero;
