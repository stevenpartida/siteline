"use client";

import { useTransition } from "react";
import { signOutAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { IconLogout } from "@tabler/icons-react";

function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  function onClick() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      className="w-full rounded-full text-base py-6 mt-6 bg-card border border-border text-foreground"
      size="lg"
    >
      <IconLogout stroke={2} className="size-6" data-icon="inline-start" />
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

export default SignOutButton;
