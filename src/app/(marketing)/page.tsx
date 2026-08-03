import { JoinTeamDrawer } from "@/components/onboarding/join-team-drawer";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

async function LandingPage() {
  const cookieStore = await cookies();
  const supabase = await createClient(cookieStore);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect("/projects");

  return (
    <main className="flex h-full flex-col items-center px-6 text-center">
      <div className="flex flex-col items-center justify-center gap-4 pt-24">
        <Image
          src="/icons/siteline-icon-1024.png"
          width={84}
          height={84}
          alt="Siteline Logo"
          className="rounded-3xl mb-8"
        />
        <h1 className="text-4xl font-bold tracking-tight">Siteline</h1>
        <p className="mx-auto max-w-xs text-center text-lg font-semibold tracking-tight leading-6 text-balance">
          Organize job site photos and documents by project.
        </p>
        <p className="mx-auto max-w-xs text-center text-base font-normal tracking-tight leading-6 text-balance text-muted-foreground">
          Every photo you take on site auto-files to the right project by GPS.
          No folders, no fuss.
        </p>
      </div>
      <div className="mt-auto w-full max-w-sm pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="space-y-3 mb-8">
          <Button
            asChild
            size="lg"
            className="w-full rounded-full text-base py-6"
          >
            <Link href="/sign-up">Get Started for Free</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="w-full rounded-full text-base py-6 bg-card text-foreground border border-border hover:bg-card/20"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>

        <JoinTeamDrawer />
      </div>
    </main>
  );
}

export default LandingPage;
