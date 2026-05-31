import { z } from "zod";

export const createCompanySchema = z.object({
  company_name: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters long")
    .max(100),
});

export type CreateCompanyFormValues = z.infer<typeof createCompanySchema>;

export const joinCompanySchema = z.object({
  invite_url: z.string().min(1, "Please enter an invite URL"),
});

export type JoinCompanyFormValues = z.infer<typeof joinCompanySchema>;
