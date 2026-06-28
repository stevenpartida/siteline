"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/mobile/mobile-nav";
import CreateProjectSheet from "@/components/project/create-project-sheet";
import ProjectPickerDrawer from "@/components/project/project-picker-drawer";
import { getCurrentPosition } from "@/lib/helpers";
import { findProjectsNearAction } from "@/actions/location";
import { uploadMediaAction } from "@/actions/upload";
import type { Coordinates } from "@/types/location";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerProjects, setPickerProjects] = useState<
    Array<{
      id: string;
      name: string;
      address: string;
      thumbnailUrl: string | null;
      photoCount: number;
      lastPhotoAt: string | null;
      projectLat: number;
      projectLng: number;
    }>
  >([]);
  const [pickerCoords, setPickerCoords] = useState<Coordinates | null>(null);
  const [capturedFile, setCapturedFile] = useState<File | null>(null);

  const pendingFileRef = useRef<File | null>(null);
  const pendingCoordsRef = useRef<Coordinates | null>(null);
  const gpsRef = useRef<Promise<Coordinates | null> | null>(null);

  const handleCameraButtonPress = () => {
    gpsRef.current = getCurrentPosition().catch(() => null);
  };

  const handleCameraCapture = async (file: File) => {
    const coords = await (gpsRef.current ?? Promise.resolve(null));
    gpsRef.current = null;

    if (!coords) {
      pendingFileRef.current = file;
      setSheetOpen(true);
      return;
    }

    const { data: matches, error } = await findProjectsNearAction(coords);

    if (error || !matches) {
      pendingFileRef.current = file;
      pendingCoordsRef.current = coords;
      setSheetOpen(true);
      return;
    }

    if (matches.length === 0) {
      pendingFileRef.current = file;
      pendingCoordsRef.current = coords;
      setSheetOpen(true);
    } else {
      pendingFileRef.current = file;
      pendingCoordsRef.current = coords;
      setPickerProjects(matches);
      setPickerCoords(coords);
      setCapturedFile(file);
      setPickerOpen(true);
    }
  };

  const handleProjectPicked = async (projectId: string) => {
    setPickerOpen(false);
    const file = pendingFileRef.current;
    const coords = pendingCoordsRef.current;
    if (!file) return;
    await uploadMediaAction(file, "photos", projectId, coords);
    pendingFileRef.current = null;
    pendingCoordsRef.current = null;
    router.push(`/projects/${projectId}`);
  };

  const handleCreateNew = () => {
    setPickerOpen(false);
    setSheetOpen(true);
  };

  const handleProjectCreated = async (projectId: string) => {
    const file = pendingFileRef.current;
    const coords = pendingCoordsRef.current;
    if (file) {
      await uploadMediaAction(file, "photos", projectId, coords);
      pendingFileRef.current = null;
      pendingCoordsRef.current = null;
      router.push(`/projects/${projectId}`);
    }
  };

  return (
    <div className="relative h-dvh flex flex-col max-w-lg mx-auto">
      <main className="flex-1 overflow-hidden">{children}</main>
      <CreateProjectSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onProjectCreated={handleProjectCreated}
      />
      <ProjectPickerDrawer
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        projects={pickerProjects}
        userCoords={pickerCoords}
        capturedFile={capturedFile}
        onSelect={handleProjectPicked}
        onCreateNew={handleCreateNew}
      />
      <MobileNav
        onAddProject={() => setSheetOpen(true)}
        onCameraCapture={handleCameraCapture}
        onCameraButtonPress={handleCameraButtonPress}
      />
    </div>
  );
}
