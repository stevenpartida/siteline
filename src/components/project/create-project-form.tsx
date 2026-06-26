import {
  type CreateProjectFormValues,
  createProjectSchema,
} from "@/lib/validators/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { createProjectAction } from "@/actions/project";
import { getAddressFromCoordsAction } from "@/actions/location";
import { getCurrentPosition } from "@/lib/helpers";
import { Spinner } from "../ui/spinner";

type CreateProjectFormProps = {
  isOpen: boolean; // NEW — drives the autofill trigger
  onComplete: (result: {
    projectId: string | null;
    error: string | null;
  }) => void;
};

function CreateProjectForm({ isOpen, onComplete }: CreateProjectFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false); // NEW

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

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;

    async function autofillAddress() {
      setIsLocating(true);
      try {
        const coords = await getCurrentPosition();

        const result = await getAddressFromCoordsAction(coords);
        if (!cancelled && result.success) {
          form.reset({
            project_name: "",
            address_line_1: result.address.address_line_1,
            address_line_2: "",
            city: result.address.city,
            state: result.address.state,
            zip_code: result.address.zip_code,
          });
        }
      } catch {
        // permission denied, timeout, unsupported — fall through silently,
        // user fills the form manually. Never block.
      } finally {
        if (!cancelled) setIsLocating(false);
      }
    }

    autofillAddress();

    return () => {
      cancelled = true;
    };
  }, [isOpen, form]);

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
    <div className="flex-1 flex-col pb-12 px-4  w-full">
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Controller
          name="project_name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid || undefined}
              className="mb-4"
            >
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
        <div className="flex flex-col gap-1 mb-4">
          <div className="flex items-center gap-2 pl-1">
            <FieldLabel className="text-foreground text-sm">Address</FieldLabel>
            {isLocating && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Spinner className="size-3" />
              </span>
            )}
          </div>
          <Controller
            name="address_line_1"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
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
          className="mt-12 w-full h-12 rounded-xl"
        >
          {isLoading ? (
            <>
              <Spinner />
              <span>Creating...</span>
            </>
          ) : (
            "Create Project"
          )}
        </Button>
      </form>
    </div>
  );
}

export default CreateProjectForm;
