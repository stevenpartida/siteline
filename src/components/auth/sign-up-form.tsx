"use client";

import { type SignUpFormValues, signUpSchema } from "@/lib/validators/auth";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { signUpAction } from "@/actions/auth";
import { joinCompanyAction } from "@/actions/invite";

type SignUpFormProps = {
  token?: string;
};

function SignUpForm({ token }: SignUpFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { full_name: "", email: "", password: "" },
  });

  async function onSubmit(values: SignUpFormValues) {
    setServerError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("full_name", values.full_name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await signUpAction(formData);
    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }

    if (token) {
      const joinResult = await joinCompanyAction(token);
      if (joinResult.error) {
        setServerError(joinResult.error);
        setIsLoading(false);
        return;
      }
      router.push("/projects");
      return;
    }

    router.push("/onboarding");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Controller
        name="full_name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel>Your Name</FieldLabel>
            <Input
              {...field}
              placeholder="John Smith"
              autoComplete="off"
              inputMode="text"
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel>Email</FieldLabel>
            <Input
              {...field}
              placeholder="you@example.com"
              autoComplete="email"
              inputMode="email"
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel>Password</FieldLabel>
            <Input
              {...field}
              type="password"
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}
      />

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? "Creating account..." : "Continue"}
      </Button>
    </form>
  );
}

export default SignUpForm;
