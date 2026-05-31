"use client";

import SignOutButton from "@/components/auth/sign-out-button";
import CreateCompanyForm from "@/components/onboarding/create-company-form";
import JoinCompanyForm from "@/components/onboarding/join-company-form";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type OnboardingView = "choice" | "create" | "join";

function OnboardingPage() {
  const [view, setView] = useState<OnboardingView>("choice");

  const views: Record<OnboardingView, React.ReactNode> = {
    choice: (
      <div>
        <h1>Welcome to Siteline</h1>
        <Button onClick={() => setView("create")}>Create Company</Button>
        <Button onClick={() => setView("join")}>Join Company</Button>
        <SignOutButton />
      </div>
    ),
    create: (
      <div>
        <Button onClick={() => setView("choice")}>Back</Button>
        <CreateCompanyForm />
      </div>
    ),
    join: (
      <div>
        <Button onClick={() => setView("choice")}>Back</Button>
        <JoinCompanyForm />
      </div>
    ),
  };

  return views[view];
}

export default OnboardingPage;
