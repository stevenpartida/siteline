import { z } from "zod";

export const createCompanySchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  company_name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters long")
    .max(100),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;
