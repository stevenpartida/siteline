import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  IconUpload,
  IconCamera,
  IconScan,
  IconPaperclip,
} from "@tabler/icons-react";

type AddMediaDrawerProps = {
  activeTab: "photos" | "documents";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function AddMediaDrawer({
  activeTab,
  open,
  onOpenChange,
}: AddMediaDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent
        className="rounded-t-3xl bg-background "
        aria-describedby={undefined}
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader className="flex-1  align-middle ">
          <DrawerTitle className="text-sm font-medium text-foreground "></DrawerTitle>
        </DrawerHeader>
        <div className="w-full px-4 pb-12 flex flex-col gap-2 ">
          {activeTab === "photos" ? (
            <>
              <button className="flex flex-row border bg-white items-center gap-4 w-full rounded-2xl">
                <div className="p-4 flex items-center justify-center ">
                  <IconUpload
                    size={24}
                    stroke={1.5}
                    className="text-foreground"
                  />
                </div>
                <span className="text-base font-semibold text-foreground">
                  Upload Photo
                </span>
              </button>
              <button className="flex flex-row border bg-white items-center gap-4 w-full rounded-2xl">
                <div className="p-4 flex items-center justify-center ">
                  <IconCamera
                    size={24}
                    stroke={1.5}
                    className="text-foreground"
                  />
                </div>
                <span className="text-base font-semibold text-foreground">
                  Take Photo
                </span>
              </button>
            </>
          ) : (
            <>
              <button className="flex flex-row border bg-white items-center gap-4 w-full rounded-2xl">
                <div className="p-4 flex items-center justify-center ">
                  <IconPaperclip
                    size={24}
                    stroke={1.5}
                    className="text-foreground"
                  />
                </div>
                <span className="text-base font-semibold text-foreground">
                  Add Files
                </span>
              </button>
              <button className="flex flex-row border bg-white items-center gap-4 w-full rounded-2xl">
                <div className="p-4 flex items-center justify-center ">
                  <IconScan
                    size={24}
                    stroke={1.5}
                    className="text-foreground"
                  />
                </div>
                <span className="text-base font-semibold text-foreground">
                  Scan Document
                </span>
              </button>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default AddMediaDrawer;
