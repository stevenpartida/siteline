import { z } from "zod";

export const editAccountSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(1, "Enter your name")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .trim()
    .refine((val) => {
      if (val === "") return true; // allow clearing
      const digits = val.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Enter a valid phone number"),
});

export type EditAccountFormValues = z.infer<typeof editAccountSchema>;
