import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CreateProjectForm from "./create-project-form";

function CreateProjectSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
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
          onComplete={(result) => {
            if (!result.error) {
              onOpenChange(false);
            }
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default CreateProjectSheet;
