import SignUpForm from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="flex-1 flex flex-col justify-center px-6 pt-safe pb-safe bg-background md:max-w-sm mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign up to get started with Siteline.
        </p>
      </div>
      <SignUpForm />
      <p className="text-sm text-center text-muted-foreground mt-6">
        Already have an account?{" "}
        <a href="/sign-in" className="text-primary font-medium">
          Sign in
        </a>
      </p>
    </div>
  );
}
