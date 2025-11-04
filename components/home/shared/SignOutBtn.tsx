// components/shared/SignOutBtn.tsx
'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { Loader2 } from 'lucide-react'

interface SignOutBtnProps {
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
  className?: string
  children?: React.ReactNode
}

export default function SignOutBtn({
  variant = 'default',
  className = '',
  children,
}: SignOutBtnProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const t = useTranslations('profile')

  const handleSignOut = async () => {
    startTransition(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/')
          },
        },
      })
    })
  }

  return (
    <Button
      variant={variant}
      className={className}
      onClick={handleSignOut}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          {children || (
            <>
              <LogOut className="h-4 w-4" />
              <span>{t('signOut')}</span>
            </>
          )}
        </>
      )}
    </Button>
  )
}
