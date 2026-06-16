"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { toggleProjectStarredAction } from "@/actions/projects";

type ProjectCardProps = {
  id: string;
  name: string;
  address: string;
  isStarred: boolean;
  thumbnailUrl: string | null;
};

export function ProjectCard({
  id,
  name,
  address,
  isStarred,
  thumbnailUrl,
}: ProjectCardProps) {
  const [starred, setStarred] = useState(isStarred);
  const [isPending, setIsPending] = useState(false);

  async function handleStarClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    const flip = !starred;
    setStarred(flip);
    setIsPending(true);

    try {
      await toggleProjectStarredAction(id, flip);
    } catch {
      setStarred(!flip);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Link
      href={`/projects/${id}`}
      className="relative block aspect-2/1 rounded-xl border overflow-hidden"
    >
      {/* Background image */}
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#E5E5EA]" />
      )}

      {/* Gradient scrim — dark at bottom, transparent at top */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

      {/* Star button */}
      <button
        onClick={handleStarClick}
        disabled={isPending}
        aria-label={starred ? "Unstar project" : "Star project"}
        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-sm "
      >
        {starred ? (
          <IconStarFilled size={18} className="text-amber-400" />
        ) : (
          <IconStar size={18} className="text-[#1C1C1E] " />
        )}
      </button>

      {/* Info overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1 ">
        <h3 className="font-semibold text-white text-sm">{name}</h3>
        <div className="flex flex-row justify-between items-center gap-1 text-xs text-white/80">
          <span>{address}</span>
          <span>0.4 mi</span>
        </div>
      </div>
    </Link>
  );
}
