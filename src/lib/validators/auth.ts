import { z } from "zod";

// Sign Up Schema and Sign Up form values type
export const signUpSchema = z.object({
  first_name: z.string().min(1, "Enter your first name"),
  last_name: z.string().min(1, "Enter your last name"),
  email: z.email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password doesn't meet all requirements")
    .regex(/[A-Z]/, "Must include 1 uppercase letter")
    .regex(/[0-9]/, "Must include 1 number")
    .regex(/[^\w\s]/, "Must include 1 symbol"),
});

export type SignUpFormValues = z.infer<typeof signUpSchema>;

// Sign In schema and sign in form values type
export const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
