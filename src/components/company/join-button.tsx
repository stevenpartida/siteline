"use client";

import { joinCompanyAction } from "@/actions/invite";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

type JoinCompanyButtonProps = {
  token: string;
};

function JoinCompanyButton({ token }: JoinCompanyButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    try {
      setIsLoading(true);
      const { error } = await joinCompanyAction(token);
      if (error) {
        setError(error);
        return;
      }
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div>
      <Button onClick={onClick} disabled={isLoading}>
        {isLoading ? "Joining..." : "Confirm"}
      </Button>
      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}

export default JoinCompanyButton;
