import { cn } from "@/lib/utils";

export function OnboardingProgress({
  step,
  total,
}: {
  step: number;
  total: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i < step ? "bg-foreground" : "bg-foreground/15",
            )}
          />
        ))}
      </div>
      <span className="text-sm text-muted-foreground tabular-nums">
        {step} / {total}
      </span>
    </div>
  );
}
