'use client'

import * as React from 'react'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { CurrentUserType, NavigationData } from '@/lib/types/home'
import { cn } from '@/lib/utils'
import DesktopNav from './DesktopNav'
import DrawerCart from './DrawerCart'
import MobileNav from './MobileNav'
import UserSession from './UserSession'
import SearchBar from './SearchBar'
import Logo from './Logo'
import TopBanner from './TopBanner'
import { TransitionLink } from '../shared/TransitionLink'

export const ListItem = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof TransitionLink> & {
    title: string
    children: React.ReactNode
  }
>(({ className, title, children, href, ...props }, ref) => {
  return (
    <NavigationMenuLink asChild>
      <TransitionLink
        ref={ref}
        href={href}
        className={cn(
          'group block select-none space-y-2 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
          className
        )}
        {...props}
      >
        {children}
        <div className="text-sm font-medium leading-none text-foreground">
          {title}
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          مشاهده
        </p>
      </TransitionLink>
    </NavigationMenuLink>
  )
})
ListItem.displayName = 'ListItem'

export default function MainNav({
  navigation,
  session,
}: {
  navigation: NavigationData
  session: CurrentUserType
}) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)

  const toggleSearch = React.useCallback(() => {
    setIsSearchOpen((prev) => !prev)
  }, [])

  return (
    <div className="bg-background">
      <header className="relative">
        <nav aria-label="Main navigation">
          <TopBanner />

          <div className="">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex flex-1 items-center lg:hidden">
                  <MobileNav navigation={navigation} session={session} />
                </div>

                <div className="lg:hidden">
                  <Logo />
                </div>

                <div className="flex flex-1 items-center justify-end lg:justify-start">
                  <div className="flex lg:flex-row-reverse items-center space-x-4">
                    <SearchBar
                      isOpen={isSearchOpen}
                      onToggle={toggleSearch}
                      categories={navigation.categories.map((cat) => {
                        return {
                          category: cat.name,
                        }
                      })}
                    />

                    <UserSession session={session} />
                    <DrawerCart />
                  </div>
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center">
                  <Logo />
                </div>

                <div className="hidden lg:items-center h-full lg:flex">
                  <DesktopNav navigation={navigation} session={session} />
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
