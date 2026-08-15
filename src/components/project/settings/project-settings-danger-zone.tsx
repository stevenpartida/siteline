"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { IconTrash } from "@tabler/icons-react";
import { deleteProjectAction } from "@/actions/project";

type ProjectSettingsDangerZoneProps = {
  id: string;
};

function ProjectSettingsDangerZone({ id }: ProjectSettingsDangerZoneProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const result = await deleteProjectAction(id);

    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className="px-4 py-2 w-full flex flex-col gap-2">
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <AlertDialog
        open={open}
        onOpenChange={(value) => {
          if (!isLoading) setOpen(value);
        }}
      >
        <AlertDialogTrigger asChild>
          <Button
            className="w-full rounded-full text-base py-6 mt-6"
            size="lg"
            variant="destructive"
            onClick={() => setOpen(true)}
          >
            <IconTrash stroke={2} />
            Delete Project
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <IconTrash />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              All photos and documents will be permanently deleted. This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline" disabled={isLoading}>
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ProjectSettingsDangerZone;
