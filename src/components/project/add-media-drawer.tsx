import { uploadMediaAction } from "@/actions/upload";
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

import { useRouter } from "next/navigation";
import { useRef } from "react";

type AddMediaDrawerProps = {
  projectId: string;
  activeTab: "photos" | "documents";
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function AddMediaDrawer({
  projectId,
  activeTab,
  open,
  onOpenChange,
}: AddMediaDrawerProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const scanInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleFileChange =
    (bucket: "photos" | "documents") =>
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const { error } = await uploadMediaAction(file, bucket, projectId);

      if (error) {
        console.error(error);
        return;
      }

      onOpenChange(false);
      router.refresh();
    };

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="bottom">
      <DrawerContent
        className="rounded-t-3xl bg-background"
        aria-describedby={undefined}
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader className="flex-1 align-middle">
          <DrawerTitle className="text-sm font-medium text-foreground"></DrawerTitle>
        </DrawerHeader>
        <div className="w-full px-4 pb-12 flex flex-col gap-2">
          {activeTab === "photos" ? (
            <>
              <button
                onClick={() => photoInputRef.current?.click()}
                className="flex flex-row border bg-white items-center gap-4 w-full rounded-2xl"
              >
                <div className="p-4 flex items-center justify-center">
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
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange("photos")}
              />

              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-row border bg-white items-center gap-4 w-full rounded-2xl"
              >
                <div className="p-4 flex items-center justify-center">
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
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange("photos")}
              />
            </>
          ) : (
            <>
              <button
                onClick={() => documentInputRef.current?.click()}
                className="flex flex-row border bg-white items-center gap-4 w-full rounded-2xl"
              >
                <div className="p-4 flex items-center justify-center">
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
              <input
                ref={documentInputRef}
                type="file"
                accept=".pdf,image/*,.doc,.docx,.xls,.xlsx"
                className="hidden"
                onChange={handleFileChange("documents")}
              />

              <button
                onClick={() => scanInputRef.current?.click()}
                className="flex flex-row border bg-white items-center gap-4 w-full rounded-2xl"
              >
                <div className="p-4 flex items-center justify-center">
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
              <input
                ref={scanInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange("documents")}
              />
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default AddMediaDrawer;
