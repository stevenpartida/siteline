import {
  joinCompanySchema,
  type JoinCompanyFormValues,
} from "@/lib/validators/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { joinCompanyAction } from "@/actions/invite";

function JoinCompanyForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<JoinCompanyFormValues>({
    resolver: zodResolver(joinCompanySchema),
    defaultValues: { invite_url: "" },
  });
  async function onSubmit(values: JoinCompanyFormValues) {
    setServerError(null);
    setIsLoading(true);

    const token = values.invite_url.split("/").pop();
    if (!token) {
      setServerError("Invalid invite URL");
      setIsLoading(false);
      return;
    }
    const result = await joinCompanyAction(token);
    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }
    console.log(values);
    router.push("/dashboard");
  }
  return (
    <div className="flex-1 flex flex-col justify-center px-6 pt-safe pb-safe bg-background md:max-w-sm mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Join Company</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Paste the company url to join
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="invite_url"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>Company Name</FieldLabel>
              <Input
                {...field}
                placeholder="Paster invite here"
                autoComplete="off"
                inputMode="url"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {/* Server error */}
        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? "Joining company..." : "Join"}
        </Button>
      </form>
    </div>
  );
}

export default JoinCompanyForm;
