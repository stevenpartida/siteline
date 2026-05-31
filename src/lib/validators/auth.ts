import { z } from "zod";

// Sign Up Schema and Sign Up form values type
export const signUpSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.email("Enter a valid email."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Must include 1 uppercase letter")
    .regex(/[0-9]/, "Must include 1 number")
    .regex(/[^\w\s]/, "Must include 1 symbol"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// Sign In schema and sign in form values type
export const signInSchema = z.object({
  email: z.email("Enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
