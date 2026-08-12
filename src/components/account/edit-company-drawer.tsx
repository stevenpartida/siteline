"use client";

import { editCompanyAction } from "@/actions/company";
import {
  EditCompanyFormValues,
  editCompanySchema,
} from "@/lib/validators/company";
import { Company } from "@/types/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { IconAlertCircle, IconX } from "@tabler/icons-react";
import { Input } from "../ui/input";

type EditCompanyDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  company: Pick<Company, "name" | "license_number">;
};

function EditCompanyDrawer({
  open,
  onOpenChange,
  company,
}: EditCompanyDrawerProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditCompanyFormValues>({
    resolver: zodResolver(editCompanySchema),
    defaultValues: {
      company_name: company.name,
      license_number: company.license_number ?? "",
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      company_name: company.name,
      license_number: company.license_number ?? "",
    });
  }, [open, company.name, company.license_number, form]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setServerError(null);
    onOpenChange(nextOpen);
  }

  async function onSubmit(values: EditCompanyFormValues) {
    setServerError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("company_name", values.company_name);
    formData.append("license_number", values.license_number ?? "");

    const result = await editCompanyAction(formData);
    setIsLoading(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    onOpenChange(false);
  }

  return (
    <Drawer
      open={open}
      onOpenChange={handleOpenChange}
      direction="bottom"
      repositionInputs={false}
    >
      <DrawerContent
        className="rounded-t-3xl bg-background"
        aria-describedby={undefined}
        autoFocus={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DrawerHeader className="flex flex-row items-center justify-between px-4 pb-0">
          <DrawerTitle className="text-2xl font-bold tracking-tight">
            Edit Company
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 rounded-full bg-muted text-foreground hover:bg-muted/80"
              aria-label="Close"
            >
              <IconX className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 px-4 pt-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
        >
          <Controller
            name="company_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="company_name"
                  className="text-sm text-foreground"
                >
                  Company Name
                </FieldLabel>
                <Input
                  {...field}
                  id="company_name"
                  autoComplete="name"
                  inputMode="text"
                  className="h-12 rounded-xl"
                />
                {fieldState.error && (
                  <FieldError className="flex flex-row gap-1 items-center text-xs">
                    <IconAlertCircle size={14} />
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />

          <Controller
            name="license_number"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="license_number"
                  className="text-sm text-foreground"
                >
                  License #
                </FieldLabel>
                <Input
                  {...field}
                  id="license_number"
                  autoComplete="off"
                  inputMode="text"
                  className="h-12 rounded-xl"
                />
                {fieldState.error && (
                  <FieldError className="flex flex-row gap-1 items-center text-xs">
                    <IconAlertCircle size={14} />
                    {fieldState.error.message}
                  </FieldError>
                )}
              </Field>
            )}
          />

          {serverError && (
            <p className="text-sm text-destructive">{serverError}</p>
          )}

          <div className="mt-4 flex flex-col gap-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 w-full rounded-full text-base"
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Company Info"
              )}
            </Button>
            <DrawerClose asChild>
              <Button
                type="button"
                variant="ghost"
                className="h-12 w-full rounded-full text-base font-semibold"
              >
                Cancel
              </Button>
            </DrawerClose>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

export default EditCompanyDrawer;
