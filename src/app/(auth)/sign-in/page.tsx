'use client'
import { signInAction } from '@/actions/auth'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { signInSchema, type SignInFormValues } from '@/lib/validators/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

function SignInPage() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {email: '', password: ''}
  })

  async function onSubmit(values: SignInFormValues) {
    setIsLoading(true)
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('password', values.password)

    const result = await signInAction(formData)
    if(result.error){
      setServerError(result.error)
       setIsLoading(false)
      return
    }

    console.log(values)
    router.push('/')
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 pt-safe pb-safe bg-background md:max-w-sm mx-auto w-full">
      {/* Header */}
      <div className='mb-8'>
        <h1 className="text-2xl font-bold tracking-tight">Sign In</h1>
        <p className="text-sm text-muted-foreground mt-1">Please enter required details.</p>
      </div>

      {/*Form*/}
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <Controller name='email' control={form.control} render={({field, fieldState}) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldLabel>Email</FieldLabel>
            <Input {...field} placeholder="Email Address" autoComplete="email" inputMode='email' />
            <FieldError>{fieldState.error?.message}</FieldError>
          </Field>
        )}>
        </Controller>
        
        <Controller 
          name="password"
          control={form.control}
          render={({field, fieldState}) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel>Password</FieldLabel>
              <Input
                {...field}
                type='password'
                placeholder='Password'
                autoComplete='current-password'
              />
              <FieldError>{fieldState.error?.message}</FieldError>
            </Field>
          )}
        />

        {serverError && (
          <p className='text-sm text-destructive'>{serverError}</p>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Continue'}
        </Button>
      </form>
      <p className="text-sm text-center text-muted-foreground mt-6">
        Forgot password?{' '}
        <a href="/reset-password" className="text-primary font-medium">
          Reset Password
        </a>
      </p>
    </div>
  )
}

export default SignInPage