import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // ✅ Use getClaims() not getSession() or getUser()
  const { data: claimsData } = await supabase.auth.getClaims();
  const user = claimsData?.claims;

  const path = request.nextUrl.pathname;

  const publicRoutes = ["/", "/sign-in", "/sign-up"];
  const isPublic = publicRoutes.includes(path) || path.startsWith("/join");

  // 1. Public route → let through
  if (isPublic) return supabaseResponse;

  // 2. No user → redirect to landing
  if (!user) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 3. Has user + on auth route → redirect to projects
  if (["/sign-in", "/sign-up"].includes(path)) {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // 4. Has user + no company → redirect to onboarding
  const { data: userData } = await supabase
    .from("users")
    .select("company_id")
    .eq("id", user.sub)
    .single();

  if (!userData?.company_id && path !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 5. Has user + has company + trying to hit onboarding → redirect to projects
  if (userData?.company_id && path === "/onboarding") {
    return NextResponse.redirect(new URL("/projects", request.url));
  }

  // 6. Everything else → let through
  return supabaseResponse;
}
