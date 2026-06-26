import {
  type CreateCompanyFormValues,
  createCompanySchema,
} from "@/lib/validators/company";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { createCompanyAction } from "@/actions/company";

function CreateCompanyForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(createCompanySchema),
    defaultValues: { company_name: "" },
  });

  async function onSubmit(values: CreateCompanyFormValues) {
    setServerError(null);
    setIsLoading(true);
    const formData = new FormData();
    formData.append("company_name", values.company_name);

    const result = await createCompanyAction(formData);
    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }
    console.log(values);
    router.push("/projects");
  }
  return (
    <div className="flex-1 flex flex-col justify-center px-6 pt-safe pb-safe bg-background md:max-w-sm mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Set up your company
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your details to get started.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="company_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>Company Name</FieldLabel>
              <Input
                {...field}
                placeholder="Ace Roofing"
                autoComplete="off"
                inputMode="text"
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
          {isLoading ? "Creating company..." : "Create"}
        </Button>
      </form>
    </div>
  );
}

export default CreateCompanyForm;
