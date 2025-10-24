import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from 'lucide-react'

import SignOutBtn from '../shared/SignOutBtn'
// import { getCurrentUser } from '@/lib/auth-helpers'
import { CurrentUserType } from '@/lib/types/home'
import { TransitionLink } from '../shared/TransitionLink'

export default function UserSession(session: {
  session: CurrentUserType | null
}) {
  if (!session.session?.id) {
    return (
      <TransitionLink
        aria-label="user sign in"
        href={'/sign-in'}
        className="w-full "
      >
        <User className="h-6 w-6" />
      </TransitionLink>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="User account">
          <User className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-fit rounded-none bg-background/20 backdrop-blur-lg   "
        align="start"
      >
        <DropdownMenuLabel dir="rtl" className="cursor-pointer" asChild>
          {session.session?.name}
        </DropdownMenuLabel>
        {session.session?.phoneNumber && (
          <>
            <DropdownMenuGroup dir="rtl">
              <TransitionLink href={'/user/profile'} aria-label="user profile">
                <DropdownMenuItem className="cursor-pointer">
                  پروفایل
                </DropdownMenuItem>
              </TransitionLink>
              <TransitionLink href={'/user/orders'} aria-label="user orders">
                <DropdownMenuItem className="cursor-pointer">
                  سفارشها
                </DropdownMenuItem>
              </TransitionLink>
              <TransitionLink
                href={'/user/bookmarks'}
                aria-label="user bookmarks"
              >
                <DropdownMenuItem className="cursor-pointer">
                  علاقه‌مندی‌ها
                </DropdownMenuItem>
              </TransitionLink>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem
              asChild
              dir="rtl"
              className="cursor-pointer w-full"
            >
              <SignOutBtn className="w-full" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
