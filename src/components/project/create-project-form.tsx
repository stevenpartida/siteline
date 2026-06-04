import {
  type CreateProjectFormValues,
  createProjectSchema,
} from "@/lib/validators/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { createProjectAction } from "@/actions/project";

type CreateProjectFormProps = {
  onComplete: (result: {
    projectId: string | null;
    error: string | null;
  }) => void;
};

function CreateProjectForm({ onComplete }: CreateProjectFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      project_name: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      zip_code: "",
    },
  });

  async function onSubmit(values: CreateProjectFormValues) {
    setServerError(null);
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const result = await createProjectAction(formData);
    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }
    onComplete({ projectId: result.projectId, error: null });
    router.push(`/projects/${result.projectId}`);
  }
  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="project_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <Input
                {...field}
                placeholder="Project Name"
                autoComplete="off"
                inputMode="text"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
        <div>
          <Controller
            name="address_line_1"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel>Address Line 1</FieldLabel>
                <Input
                  {...field}
                  placeholder="Address Line 1"
                  autoComplete="off"
                  inputMode="text"
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            name="address_line_2"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel>Address Line 2</FieldLabel>
                <Input
                  {...field}
                  placeholder="Address Line 2"
                  autoComplete="off"
                  inputMode="text"
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </div>
        <div>
          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel>City</FieldLabel>
                <Input
                  {...field}
                  placeholder="City"
                  autoComplete="off"
                  inputMode="text"
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            name="state"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel>State</FieldLabel>
                <Input
                  {...field}
                  placeholder="State"
                  autoComplete="off"
                  inputMode="text"
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
          <Controller
            name="zip_code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel>Zip Code</FieldLabel>
                <Input
                  {...field}
                  placeholder="Zip Code"
                  autoComplete="off"
                  inputMode="text"
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </div>

        {serverError && <p>{serverError}</p>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating company..." : "Create"}
        </Button>
      </form>
    </div>
  );
}

export default CreateProjectForm;
