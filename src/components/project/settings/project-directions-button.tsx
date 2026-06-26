import React from "react";
import { IconLocationPin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

type ProjectDirectionButtonProps = {
  address: string;
};

function ProjectDirectionButton({ address }: ProjectDirectionButtonProps) {
  const directionUrl = encodeURIComponent(address);
  return (
    <div className=" px-4 py-2 w-full flex flex-row gap-2">
      <a
        href={`https://maps.apple.com/?q=${directionUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <Button className="w-full py-5 rounded-full">
          <IconLocationPin stroke={2} />
          <span className="text-sm font-semibold">Get Directions</span>
        </Button>
      </a>
    </div>
  );
}

export default ProjectDirectionButton;
