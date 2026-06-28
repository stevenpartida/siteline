import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import CreateProjectForm from "./create-project-form";

function CreateProjectSheet({
  open,
  onOpenChange,
  onProjectCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: (projectId: string) => void;
}) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction="bottom"
      repositionInputs={false}
    >
      <DrawerContent
        className="rounded-t-3xl bg-background "
        aria-describedby={undefined}
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader className="flex-1  align-middle items-center">
          <DrawerTitle className="text-sm font-medium text-foreground ">
            Enter Project Details
          </DrawerTitle>
        </DrawerHeader>
        <CreateProjectForm
          isOpen={open}
          onComplete={(result) => {
            if (!result.error) {
              onOpenChange(false);
              if (result.projectId) {
                onProjectCreated?.(result.projectId);
              }
            }
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default CreateProjectSheet;
