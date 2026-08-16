import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import EditProjectForm from "./edit-project-form";
import type { EditProjectFormValues } from "@/lib/validators/project";

function parseStoredAddress(address: string): {
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  zip_code: string;
} {
  const empty = {
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    zip_code: "",
  };

  const parts = address.split(",").map((p) => p.trim());
  if (parts.length < 3) return { ...empty, address_line_1: address };

  // Format from createProjectAction:
  //   `${line1}[, ${line2}], ${city}, ${state} ${zip}`
  const stateZip = parts[parts.length - 1];
  const city = parts[parts.length - 2];
  const line1 = parts[0];
  const line2 = parts.length >= 4 ? parts.slice(1, parts.length - 2).join(", ") : "";

  const stateZipMatch = stateZip.match(/^(.+?)\s+(\d{5})$/);
  const state = stateZipMatch ? stateZipMatch[1] : stateZip;
  const zip_code = stateZipMatch ? stateZipMatch[2] : "";

  return {
    address_line_1: line1,
    address_line_2: line2,
    city,
    state,
    zip_code,
  };
}

function EditProjectDrawer({
  open,
  onOpenChange,
  projectId,
  name,
  address,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  name: string;
  address: string;
}) {
  const parsed = parseStoredAddress(address);
  const initialValues: EditProjectFormValues = {
    project_name: name,
    ...parsed,
  };

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
        <DrawerHeader className="flex-1 align-middle items-center">
          <DrawerTitle className="text-sm font-medium text-foreground">
            Edit Project
          </DrawerTitle>
        </DrawerHeader>
        <EditProjectForm
          projectId={projectId}
          initialValues={initialValues}
          onComplete={(result) => {
            if (!result.error) onOpenChange(false);
          }}
        />
      </DrawerContent>
    </Drawer>
  );
}

export default EditProjectDrawer;
