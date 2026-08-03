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
