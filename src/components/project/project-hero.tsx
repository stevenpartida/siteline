import Image from "next/image";
import { Button } from "../ui/button";
import { IconChevronLeft, IconShare2, IconMenu2 } from "@tabler/icons-react";
import Link from "next/link";

type ProjectHeroProps = {
  coverPhotoUrl: string | null;
};

function ProjectHero({ coverPhotoUrl }: ProjectHeroProps) {
  const navPills = (
    <>
      <Link href="/projects">
        <Button variant="frosted" size="icon-lg" className="rounded-full">
          <IconChevronLeft stroke={1.5} className="size-4" />
        </Button>
      </Link>

      <div className="flex gap-2">
        <Button variant="frosted" size="icon-lg" className="rounded-full">
          <IconShare2 stroke={1.5} className="size-4" />
        </Button>
        <Button variant="frosted" size="icon-lg" className="rounded-full">
          <IconMenu2 stroke={1.5} className="size-4" />
        </Button>
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
