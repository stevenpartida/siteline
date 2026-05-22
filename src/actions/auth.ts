'use server'

import { createClient } from "@/lib/supabase/server"
import { signUpSchema } from "@/lib/validators/auth";
import { cookies } from "next/headers";

export type AuthActionResult = {
    error: string | null
}

export async function signUpAction(formData: FormData) : Promise<AuthActionResult> {
    const cookieStore = await cookies()
    const supabase =  createClient(cookieStore);

    // Parse raw data and return email and password from parsed data
    const rawData = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const parseData = signUpSchema.safeParse(rawData)
    if (!parseData.success) {
        return {error: parseData.error.issues[0].message}
    }

    const {email, password} = parseData.data

    // Create Supabase auth uesr
    const {data, error: authError} = await supabase.auth.signUp({email, password})
    if (authError){
        return {error: authError.message}
    }
    if (!data.user) {
        return {error: 'Sign up failed. Please try again.'}
    }

    // Insert auth user into user table
    const {error: dbError} = await supabase.from('users')
    .insert({id: data.user.id, full_name: null})

    if (dbError) {
        return {error: dbError.message}
    }

    return { error: null}
}