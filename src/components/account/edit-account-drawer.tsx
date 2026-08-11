"use client";

import { editAccountAction } from "@/actions/account";
import {
  type EditAccountFormValues,
  editAccountSchema,
} from "@/lib/validators/account";
import { Profile } from "@/types/account";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { IconAlertCircle, IconPhone, IconX } from "@tabler/icons-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

type EditAccountDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Pick<Profile, "fullName" | "phone">;
};

function EditAccountDrawer({
  open,
  onOpenChange,
  profile,
}: EditAccountDrawerProps) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EditAccountFormValues>({
    resolver: zodResolver(editAccountSchema),
    defaultValues: {
      full_name: profile.fullName,
      phone: profile.phone ?? "",
    },
  });

  // Re-seed defaults when the drawer opens so it reflects the latest profile.
  useEffect(() => {
    if (!open) return;
    form.reset({
      full_name: profile.fullName,
      phone: profile.phone ?? "",
    });
  }, [open, profile.fullName, profile.phone, form]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setServerError(null);
    onOpenChange(nextOpen);
  }

  async function onSubmit(values: EditAccountFormValues) {
    setServerError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("full_name", values.full_name);
    formData.append("phone", values.phone ?? "");

    const result = await editAccountAction(formData);
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
            Edit Profile
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
            name="full_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="full_name"
                  className="text-sm text-foreground"
                >
                  Full Name
                </FieldLabel>
                <Input
                  {...field}
                  id="full_name"
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
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel
                  htmlFor="phone"
                  className="text-sm text-foreground"
                >
                  Phone
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <IconPhone className="size-4" />
                  </InputGroupAddon>
                  <InputGroupInput
                    {...field}
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(555) 555-5555"
                  />
                </InputGroup>
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
                "Save Changes"
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

export default EditAccountDrawer;
