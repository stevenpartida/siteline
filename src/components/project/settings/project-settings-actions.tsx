"use client";

import React, { useState } from "react";
import {
  IconEdit,
  IconStar,
  IconStarFilled,
  IconShare2,
} from "@tabler/icons-react";
import { toggleProjectStarredAction } from "@/actions/projects";

type ProjectSettingsActionsProps = {
  id: string;
  isStarred: boolean;
};

function ProjectSettingsActions({
  id,
  isStarred,
}: ProjectSettingsActionsProps) {
  const [starred, setStarred] = useState(isStarred);
  const [isPending, setIsPending] = useState(false);

  async function handleStarClick() {
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
    <div className="flex flex-row items-center justify-center gap-6 p-4">
      {/* Edit */}
      <div className="flex flex-col items-center gap-1.5">
        <button className="flex items-center justify-center size-11 rounded-xl border border-border bg-card">
          <IconEdit stroke={1.5} size={20} />
        </button>
        <span className="text-xs font-medium text-foreground">Edit</span>
      </div>

      {/* Star */}
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={handleStarClick}
          disabled={isPending}
          className="flex items-center justify-center size-11 rounded-xl border border-border bg-card"
        >
          {starred ? (
            <IconStarFilled stroke={1.5} size={20} className="text-amber-400" />
          ) : (
            <IconStar stroke={1.5} size={20} />
          )}
        </button>
        <span className="text-xs font-medium text-foreground">
          {starred ? "Starred" : "Star"}
        </span>
      </div>

      {/* Share */}
      <div className="flex flex-col items-center gap-1.5">
        <button className="flex items-center justify-center size-11 rounded-xl border border-border bg-card">
          <IconShare2 stroke={1.5} size={20} />
        </button>
        <span className="text-xs font-medium text-foreground">Share</span>
      </div>
    </div>
  );
}

export default ProjectSettingsActions;
