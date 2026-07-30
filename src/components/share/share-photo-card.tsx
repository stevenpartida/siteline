"use client";

import Image from "next/image";
import { SharedPhoto } from "@/types/db";
import { formatTime } from "@/lib/helpers";

type SharePhotoCardProps = {
  photo: SharedPhoto;
};

function SharePhotoCard({ photo }: SharePhotoCardProps) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
      <Image src={photo.url} alt="" fill className="object-cover" />
      <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        {formatTime(new Date(photo.created_at))}
      </span>
    </div>
  );
}

export default SharePhotoCard;
