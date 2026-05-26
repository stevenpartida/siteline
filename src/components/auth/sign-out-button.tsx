"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { SignOutAction } from "@/actions/auth";

function SignOutButton() {
  const [isPending, setIsPending] = useState(false);

  async function onClick() {
    setIsPending(true);
    await SignOutAction();
  }
  return (
    <Button variant="destructive" onClick={onClick} disabled={isPending}>
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}

export default SignOutButton;
