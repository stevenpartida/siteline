"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Digest is the only handle on the server-side stack in production logs.
    console.error("Unhandled route error:", error.digest, error.message);
  }, [error]);

  return (
    <main className="flex h-dvh flex-col items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-card">
          <IconAlertTriangle stroke={1.5} className="size-7" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Something went wrong
          </h1>
          <p className="mx-auto max-w-xs text-pretty text-sm text-muted-foreground">
            This one is on us, not you. Try again — if it keeps happening, your
            connection may be the culprit.
          </p>
        </div>
      </div>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-2">
        <Button
          onClick={reset}
          size="lg"
          className="w-full rounded-full py-6 text-base"
        >
          <IconRefresh stroke={2} />
          Try Again
        </Button>
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="w-full rounded-full py-6 text-base"
        >
          <Link href="/projects">Back to Projects</Link>
        </Button>
      </div>

      {error.digest && (
        <p className="mt-6 font-mono text-[11px] text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
    </main>
  );
}
