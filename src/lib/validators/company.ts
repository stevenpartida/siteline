import { z } from "zod";

export const createCompanySchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(1, "Enter your company name")
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long"),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;

export const editCompanySchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name is too long"),
  license_number: z.string().trim().max(50, "License number is too long"),
});

export type EditCompanyFormValues = z.infer<typeof editCompanySchema>;
