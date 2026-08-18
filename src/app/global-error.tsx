"use client";

// Replaces the root layout entirely when the layout itself fails, so it must
// render its own <html>/<body> and pull in globals.css for the theme tokens.
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased">
        <main className="flex h-dvh flex-col items-center justify-center px-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Siteline hit an unexpected error
          </h1>
          <p className="mt-2 max-w-xs text-pretty text-sm text-muted-foreground">
            Reload to try again.
          </p>
          <button
            onClick={reset}
            className="mt-8 w-full max-w-sm rounded-full bg-foreground py-4 text-base font-semibold text-background"
          >
            Reload
          </button>
          {error.digest && (
            <p className="mt-6 font-mono text-[11px] text-muted-foreground">
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
