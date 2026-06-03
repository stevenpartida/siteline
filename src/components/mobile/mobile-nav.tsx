"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconFolderOpen,
  IconFolderOpenFilled,
  IconCamera,
  IconUser,
  IconUserFilled,
} from "@tabler/icons-react";

export default function MobileNav() {
  const pathname = usePathname();

  const openCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // handle upload — wire this up in Week 3
        console.log("photo captured:", file.name);
      }
    };
    input.click();
  };

  return (
    <nav className="fixed bottom-8 left-4 right-4 z-50  max-w-lg mx-auto">
      {/* pill wrapper */}
      <div className="flex items-center justify-around bg-card border border-border rounded-full px-6 py-3 shadow-sm">
        {/* Projects tab */}
        <Link
          href="/projects"
          className="flex flex-col items-center gap-1 min-w-16"
        >
          {pathname === "/projects" ? (
            <IconFolderOpenFilled size={24} className="text-foreground" />
          ) : (
            <IconFolderOpen size={24} className="text-muted-foreground" />
          )}
          <span
            className={`text-xs font-medium ${
              pathname === "/projects"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Projects
          </span>
        </Link>

        {/* Camera FAB — center, elevated */}
        <button
          onClick={openCamera}
          className="flex flex-col items-center gap-1 min-w-16 -mt-6"
          aria-label="Open camera"
        >
          <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center">
            <IconCamera size={24} className="text-background" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            Camera
          </span>
        </button>

        {/* Account tab */}
        <Link
          href="/account"
          className="flex flex-col items-center gap-1 min-w-16"
        >
          {pathname === "/account" ? (
            <IconUserFilled size={24} className="text-foreground" />
          ) : (
            <IconUser size={24} className="text-muted-foreground" />
          )}
          <span
            className={`text-xs font-medium ${
              pathname === "/account"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Account
          </span>
        </Link>
      </div>
    </nav>
  );
}
