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
        className="rounded-t-3xl bg-background"
        showCloseButton={false}
        aria-describedby={undefined}
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="flex-1  align-middle items-center">
          <button
            onClick={() => onOpenChange(false)}
            className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/40 mb-4 block"
            aria-label="Close sheet"
          />
          <SheetTitle className="text-sm font-medium text-foreground -mb-3">
            Enter Project Details
          </SheetTitle>
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
