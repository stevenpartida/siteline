import {  z } from 'zod'

export const signUpSchema = z.object({
    email: z.email('Enter a valid email.'),
    password: z.string()
    .min(8, 'Password must be at least 8 characters.')
    .regex(/[A-Z]/, 'Must include 1 uppercase letter')
    .regex(/[0-9]/, 'Must include 1 number')
    .regex(/[^\w\s]/, 'Must include 1 symbol')
})

export type SignUpFormValues = z.infer<typeof signUpSchema>