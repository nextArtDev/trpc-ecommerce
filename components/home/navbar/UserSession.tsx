// components/layout/user-session.tsx
'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Loader2,
  User,
  FileText,
  Heart,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import SignOutBtn from '../shared/SignOutBtn'
import { TransitionLink } from '../shared/TransitionLink'
import { useSession } from '@/lib/auth-client'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export default function UserSession() {
  const [isOpen, setIsOpen] = useState(false)
  const sessions = useSession()
  const session = sessions.data?.user
  const t = useTranslations('profile')

  if (sessions.isPending) return <Loader2 className="animate-spin w-6 h-6" />

  if (!session?.id) {
    return (
      <TransitionLink
        aria-label={t('signIn')}
        href={'/sign-in'}
        className="flex items-center gap-2 px-3 py-2 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        <User className="h-5 w-5" />
        <span className="hidden sm:inline">{t('signIn')}</span>
      </TransitionLink>
    )
  }

  // Get user initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 h-auto p-1.5 data-[state=open]:bg-accent"
          aria-label={t('account')}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.image || ''} alt={session.name || ''} />
            <AvatarFallback className="text-xs">
              {getInitials(session.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium truncate max-w-[100px]">
              {session.name}
            </span>
            {session.phoneNumber && (
              <span className="text-xs text-muted-foreground">
                {session.phoneNumber}
              </span>
            )}
          </div>
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg bg-background/95 backdrop-blur-md border shadow-lg"
        align="end"
        forceMount
      >
        <div className="px-2 py-1.5">
          <div className="flex items-center gap-2 p-2">
            <Avatar className="h-9 w-9">
              <AvatarImage src={session.image || ''} alt={session.name || ''} />
              <AvatarFallback>{getInitials(session.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{session.name}</p>
              {session.phoneNumber && (
                <p className="text-xs leading-none text-muted-foreground">
                  {session.phoneNumber}
                </p>
              )}
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <TransitionLink href={'/user/profile'} aria-label={t('nav.profile')}>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 p-2">
              <User className="h-4 w-4" />
              <span>{t('nav.profile')}</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink href={'/user/orders'} aria-label={t('nav.orders')}>
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 p-2">
              <FileText className="h-4 w-4" />
              <span>{t('nav.orders')}</span>
            </DropdownMenuItem>
          </TransitionLink>
          <TransitionLink
            href={'/user/bookmarks'}
            aria-label={t('nav.bookmarks')}
          >
            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 p-2">
              <Heart className="h-4 w-4" />
              <span>{t('nav.bookmarks')}</span>
            </DropdownMenuItem>
          </TransitionLink>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer p-2 text-red-600 focus:text-red-600">
          <SignOutBtn
            variant="ghost"
            className="w-full flex items-center gap-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            <span>{t('signOut')}</span>
          </SignOutBtn>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
