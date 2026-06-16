"use client";

import { useState } from "react";
import MobileNav from "@/components/mobile/mobile-nav";
import CreateProjectSheet from "@/components/project/create-project-sheet";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="relative h-dvh flex flex-col max-w-lg mx-auto">
      <main className="flex-1 overflow-hidden">{children}</main>
      <CreateProjectSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      <MobileNav onAddProject={() => setSheetOpen(true)} />
    </div>
  );
}
