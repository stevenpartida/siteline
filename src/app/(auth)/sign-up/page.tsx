'use client'

import { type SignUpFormValues, signUpSchema } from '@/lib/validators/auth'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Field,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { signUpAction } from '@/actions/auth'

function SignUpPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: SignUpFormValues) {
    setServerError(null)
    setIsLoading(true)
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)

    const result = await signUpAction(formData)
    if (result.error) {
      setServerError(result.error)
       setIsLoading(false)
      return
    }
    console.log(values)
    router.push('/onboarding')
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 pt-safe pb-safe bg-background md:max-w-sm mx-auto w-full">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Sign up to get started with Siteline.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...field}
                placeholder="you@example.com"
                autoComplete="email"
                inputMode="email"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>Password</FieldLabel>
              <Input
                {...field}
                type="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {/* Server error */}
        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Creating account...' : 'Continue'}
        </Button>

      </form>

      {/* Sign in link */}
      <p className="text-sm text-center text-muted-foreground mt-6">
        Already have an account?{' '}
        <a href="/sign-in" className="text-primary font-medium">
          Sign in
        </a>
      </p>

    </div>
  )
}

export default SignUpPage