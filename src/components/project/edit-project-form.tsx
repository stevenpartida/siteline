import {
  type EditProjectFormValues,
  editProjectSchema,
} from "@/lib/validators/project";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { editProjectAction } from "@/actions/project";
import { Spinner } from "../ui/spinner";

type EditProjectFormProps = {
  projectId: string;
  initialValues: EditProjectFormValues;
  onComplete: (result: { error: string | null }) => void;
};

function EditProjectForm({
  projectId,
  initialValues,
  onComplete,
}: EditProjectFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditProjectFormValues>({
    resolver: zodResolver(editProjectSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(values: EditProjectFormValues) {
    setServerError(null);
    setIsLoading(true);
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    const result = await editProjectAction(projectId, formData);
    if (result.error) {
      setServerError(result.error);
      setIsLoading(false);
      return;
    }
    onComplete({ error: null });
  }

  return (
    <div className="flex-1 flex-col pb-12 px-4 w-full">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="project_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid || undefined}
              className="mb-4"
            >
              <FieldLabel className="text-foreground text-sm">
                Project Name
              </FieldLabel>
              <Input
                {...field}
                placeholder="Maple Street Remodel"
                autoComplete="off"
                inputMode="text"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2 pl-1">
            <FieldLabel className="text-foreground text-sm">Address</FieldLabel>
          </div>
          <Controller
            name="address_line_1"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <Input
                  {...field}
                  placeholder="Street address"
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
                <Input
                  {...field}
                  placeholder="Apt, suite, unit (optional)"
                  autoComplete="off"
                  inputMode="text"
                />
                <FieldError>{fieldState.error?.message}</FieldError>
              </Field>
            )}
          />
        </div>
        <div className="flex flex-row gap-1">
          <Controller
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel className="pl-1 text-foreground text-sm">
                  City
                </FieldLabel>
                <Input
                  {...field}
                  className="-mt-1"
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
                <FieldLabel className="pl-1 text-foreground text-sm">
                  State
                </FieldLabel>
                <Input
                  {...field}
                  className="-mt-1"
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
                <FieldLabel className="pl-1 text-foreground text-sm">
                  Zip Code
                </FieldLabel>
                <Input
                  {...field}
                  className="-mt-1"
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

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-full text-base py-6 mt-8"
          size="lg"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Saving...</span>
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </form>
    </div>
  );
}

export default EditProjectForm;
