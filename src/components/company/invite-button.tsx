"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { IconCopy } from "@tabler/icons-react";
import { createInviteAction } from "@/actions/company";

function InviteButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function onClick() {
    try {
      setIsLoading(true);
      const { token, error } = await createInviteAction();
      if (error || !token) return;

      const link = `${window.location.origin}/join/${token}`;
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Button onClick={onClick} disabled={isLoading}>
      {isLoading ? (
        "Copying..."
      ) : copied ? (
        "Copied!"
      ) : (
        <>
          Invite <IconCopy />
        </>
      )}
    </Button>
  );
}

export default InviteButton;
