import { getAuthUser } from "@/actions/auth";
import { validateInviteAction } from "@/actions/invite";
import SignUpForm from "@/components/auth/sign-up-form";
import { redirect } from "next/navigation";

type JoinProps = {
  params: Promise<{ token: string }>;
};

async function JoinPage({ params }: JoinProps) {
  const { token } = await params;
  const { invite } = await validateInviteAction(token);
  if (!invite) {
    return <div>Invalid or expired invite link.</div>;
  }

  const user = await getAuthUser();
  if (user) {
    // Invites are for new crew only. Existing accounts should sign out
    // and re-open the link, or use the app they already have access to.
    redirect("/projects");
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 pt-safe pb-safe bg-background md:max-w-sm mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Join {invite.company_name}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create an account to join the company.
        </p>
      </div>
      <SignUpForm token={token} />
    </div>
  );
}

export default JoinPage;
