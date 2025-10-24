'use client'
import { Button, buttonVariants } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { signOutServerAction } from '@/lib/home/actions/user'
import { type VariantProps } from 'class-variance-authority'
import React, { FormEvent, useTransition } from 'react'
import { toast } from 'sonner'

type ButtonVariant = VariantProps<typeof buttonVariants>['variant']

const SignOutBtn = ({
  className,
  variant = 'ghost',
}: {
  className?: string
  variant?: ButtonVariant
}) => {
  const [isPending, startTransition] = useTransition()
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: async () => {
            await signOutServerAction()
          },
          onError: () => {
            toast.error('مشکلی پیش آمده، لطفا بعدا دوباره امتحان کنید!')
          },
        },
      })
    })
  }
  return (
    <article dir="rtl" className={className}>
      <form onSubmit={handleSubmit}>
        <input className="hidden" />
        <Button
          disabled={isPending}
          variant={variant}
          type="submit"
          className="w-full text-right"
        >
          خروج
        </Button>
      </form>
    </article>
  )
}

export default SignOutBtn
