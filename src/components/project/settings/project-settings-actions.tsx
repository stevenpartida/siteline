"use client";

import React, { useState } from "react";
import {
  IconEdit,
  IconStar,
  IconStarFilled,
  IconShare2,
} from "@tabler/icons-react";
import { toggleProjectStarredAction } from "@/actions/projects";
import EditProjectDrawer from "../edit-project-drawer";

type ProjectSettingsActionsProps = {
  id: string;
  name: string;
  address: string;
  isStarred: boolean;
  canEdit: boolean;
};

function ProjectSettingsActions({
  id,
  name,
  address,
  isStarred,
  canEdit,
}: ProjectSettingsActionsProps) {
  const [starred, setStarred] = useState(isStarred);
  const [isPending, setIsPending] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

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
      {/* Edit — owners and PMs only; editProjectAction rejects anyone else */}
      {canEdit && (
        <div className="flex flex-col items-center gap-1.5">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center justify-center size-11 rounded-xl border border-border bg-card"
          >
            <IconEdit stroke={1.5} size={20} />
          </button>
          <span className="text-xs font-medium text-foreground">Edit</span>
        </div>
      )}

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

      <EditProjectDrawer
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        projectId={id}
        name={name}
        address={address}
      />
    </div>
  );
}

export default ProjectSettingsActions;
