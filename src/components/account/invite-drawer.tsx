"use client";

import {
  getOrCreateInviteAction,
  resetInviteAction,
} from "@/actions/company";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { userInitials } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import { TeamMember } from "@/types/account";
import { Role } from "@/types/db";
import {
  IconClock,
  IconCopy,
  IconLink,
  IconShare,
  IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type InviteDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName: string;
  team: TeamMember[];
};

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  project_manager: "PM",
  crew: "Crew",
};

const ROLE_ORDER: Record<Role, number> = {
  owner: 0,
  project_manager: 1,
  crew: 2,
};

function computeDaysUntil(expiresAt: string): number {
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function InviteDrawer({
  open,
  onOpenChange,
  companyName,
  team,
}: InviteDrawerProps) {
  const [role, setRole] = useState<"crew" | "project_manager">("crew");
  const [invite, setInvite] = useState<{
    token: string;
    expiresAt: string;
    daysUntilExpiry: number;
  } | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    getOrCreateInviteAction(role).then((result) => {
      if (cancelled) return;
      if (result.error) {
        toast.error(result.error);
        setInvite(null);
        return;
      }
      if (result.token && result.expiresAt) {
        setInvite({
          token: result.token,
          expiresAt: result.expiresAt,
          daysUntilExpiry: computeDaysUntil(result.expiresAt),
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [open, role]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setInvite(null);
    onOpenChange(nextOpen);
  }

  const isLoading = invite === null;
  const inviteUrl =
    invite && typeof window !== "undefined"
      ? `${window.location.origin}/join/${invite.token}`
      : "";
  const daysUntilExpiry = invite?.daysUntilExpiry ?? null;

  const sortedTeam = [...team].sort(
    (a, b) => ROLE_ORDER[a.role] - ROLE_ORDER[b.role],
  );

  async function handleCopy() {
    if (!inviteUrl) return;
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  }

  async function handleShare() {
    if (!inviteUrl) return;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `Join ${companyName} on Siteline`,
          text: `You've been invited to join ${companyName} on Siteline.`,
          url: inviteUrl,
        });
      } catch {
        // User cancelled or share failed silently — no toast needed
      }
    } else {
      await handleCopy();
    }
  }

  async function handleReset() {
    setIsResetting(true);
    const result = await resetInviteAction(role);
    setIsResetting(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }
    if (result.token && result.expiresAt) {
      setInvite({
        token: result.token,
        expiresAt: result.expiresAt,
        daysUntilExpiry: computeDaysUntil(result.expiresAt),
      });
      toast.success("Link reset", {
        description: "The old link is no longer valid.",
        duration: 5000,
      });
    }
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      direction="bottom"
      repositionInputs={false}
    >
      <DrawerContent
        className="rounded-t-3xl bg-background data-[vaul-drawer-direction=bottom]:max-h-[92vh]"
        aria-describedby={undefined}
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader className="flex flex-row items-center justify-between px-4 pb-0">
          <DrawerTitle className="text-2xl font-bold tracking-tight">
            Invite Teammates
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full bg-muted text-foreground hover:bg-muted/80"
              aria-label="Close"
            >
              <IconX className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="flex flex-col gap-5 px-4 pt-2 pb-[max(3rem,calc(env(safe-area-inset-bottom)+1.5rem))]">
          <p className="text-base text-muted-foreground">
            Anyone with this link can join{" "}
            <span className="font-semibold text-foreground">{companyName}</span>{" "}
            and start filing photos by GPS.
          </p>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">They join as</label>
            <div className="flex w-full rounded-full bg-neutral-200 py-0.5 overflow-visible">
              <button
                type="button"
                onClick={() => setRole("crew")}
                className={cn(
                  "flex-1 rounded-full py-1.5 text-sm font-medium transition-all",
                  role === "crew"
                    ? "bg-foreground text-background shadow-xl"
                    : "text-muted-foreground",
                )}
              >
                Member
              </button>
              <button
                type="button"
                onClick={() => setRole("project_manager")}
                className={cn(
                  "flex-1 rounded-full py-1.5 text-sm font-medium transition-all",
                  role === "project_manager"
                    ? "bg-foreground text-background shadow-xl"
                    : "text-muted-foreground",
                )}
              >
                Admin
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Invite link</label>
            <InputGroup key={role}>
              <InputGroupAddon>
                <IconLink className="size-4" />
              </InputGroupAddon>
              <InputGroupInput
                readOnly
                value={isLoading ? "Loading…" : inviteUrl}
                className="font-mono text-sm"
              />
              <InputGroupAddon align="inline-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopy}
                  disabled={isLoading}
                  className="rounded-full h-8 gap-1"
                >
                  <IconCopy className="size-3.5" />
                  Copy
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </div>

          <Button
            type="button"
            size="lg"
            onClick={handleShare}
            disabled={isLoading}
            className="w-full rounded-full py-6 text-base font-semibold gap-2"
          >
            <IconShare className="size-5" />
            Share Link
          </Button>

          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <IconClock className="size-3.5" />
            {daysUntilExpiry !== null ? (
              <span>
                Expires in {daysUntilExpiry}{" "}
                {daysUntilExpiry === 1 ? "day" : "days"}
              </span>
            ) : (
              <span>Loading…</span>
            )}
            <span>·</span>
            <button
              type="button"
              onClick={handleReset}
              disabled={isLoading || isResetting}
              className="font-semibold text-foreground disabled:opacity-50"
            >
              {isResetting ? "Resetting…" : "Reset link"}
            </button>
          </div>

          <div className="flex flex-col gap-2 mt-2 mb-4">
            <p className="text-xs font-medium uppercase text-muted-foreground tracking-wider">
              Team · {team.length}
            </p>
            <div
              data-vaul-no-drag
              className={cn(
                "flex flex-col overflow-y-auto overscroll-contain bg-card border border-muted-foreground/20 rounded-3xl px-4 py-1 divide-y divide-muted-foreground/20",
                sortedTeam.length > 4 && "max-h-[248px]",
              )}
            >
              {sortedTeam.map((member) => (
                <div
                  key={member.id}
                  className="flex flex-row items-center justify-between gap-3 py-3"
                >
                  <div className="flex flex-row items-center gap-3 min-w-0">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                      {userInitials(member.fullName)}
                    </div>
                    <p className="text-sm font-medium capitalize truncate">
                      {member.fullName}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {ROLE_LABELS[member.role]}
                  </Badge>
                </div>
              ))}
            </div>
            {sortedTeam.length === 1 && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                You&apos;re the only one here. Share the link above to invite
                teammates.
              </p>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export default InviteDrawer;
