import { z } from "zod";

export const createProjectSchema = z.object({
  project_name: z.string().optional(),
  address_line_1: z.string().min(1, "Address is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().regex(/^\d{5}$/, "Invalid zip code"),
});

export type CreateProjectFormValues = z.infer<typeof createProjectSchema>;
