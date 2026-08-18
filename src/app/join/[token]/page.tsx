import { getAuthUser } from "@/actions/auth";
import { validateInviteAction } from "@/actions/invite";
import SignUpForm from "@/components/auth/sign-up-form";
import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type JoinProps = {
  params: Promise<{ token: string }>;
};

async function JoinPage({ params }: JoinProps) {
  const { token } = await params;
  const { invite } = await validateInviteAction(token);

  if (!invite) {
    return (
      <main className="flex flex-col h-dvh px-6 ">
        {/* Back Button */}
        <div className="py-4">
          <Button
            asChild
            variant="frosted"
            size="icon-lg"
            className="rounded-full"
          >
            <Link href="/">
              <IconChevronLeft stroke={1.5} className="size-4" />
            </Link>
          </Button>
        </div>
        {/* Header */}
        <div className="flex flex-col items-start my-8">
          <h1 className="text-3xl font-semibold tracking-tight">
            Invite Not Available
          </h1>
          <p className="text-sm font-normal text-muted-foreground tracking-tight ">
            This invite link is invalid or has expired. Ask your team for a new
            one.
          </p>
        </div>
        <div className="mt-auto w-full pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <Button
            asChild
            className="w-full rounded-full text-base py-6"
            size="lg"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </main>
    );
  }

  const user = await getAuthUser();
  if (user) {
    // Invites are for new crew only. Existing accounts should sign out
    // and re-open the link, or use the app they already have access to.
    redirect("/projects");
  }

  return (
    <main className="flex flex-col h-dvh px-6 ">
      {/* Back Button */}
      <div className="py-4">
        <Button
          asChild
          variant="frosted"
          size="icon-lg"
          className="rounded-full"
        >
          <Link href="/">
            <IconChevronLeft stroke={1.5} className="size-4" />
          </Link>
        </Button>
      </div>
      {/* Header */}
      <div className="flex flex-col items-start my-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Join {invite.company_name}
        </h1>
        <p className="text-sm font-normal text-muted-foreground tracking-tight ">
          Create an account to join the company.
        </p>
      </div>
      <div className="flex flex-1 flex-col w-full pb-[max(1rem,env(safe-area-inset-bottom))]">
        <SignUpForm token={token} />
      </div>
    </main>
  );
}

export default JoinPage;
