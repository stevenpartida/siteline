import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import CreateProjectForm from "./create-project-form";

function CreateProjectSheet({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-3xl"
        showCloseButton={false}
        aria-describedby={undefined}
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle>Enter Project Details</SheetTitle>
        </SheetHeader>
        <CreateProjectForm
          onComplete={(result) => {
            if (!result.error) {
              onOpenChange(false);
            }
          }}
        />
      </SheetContent>
    </Sheet>
  );
}

export default CreateProjectSheet;
