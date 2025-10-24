'use client'
import { buttonVariants } from '@/components/ui/button'

import Link from 'next/link'
import { EllipsisVertical, ShoppingCart } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import useFromStore from '@/hooks/useFromStore'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/hooks/useCartStore'
import { ThemeSwitcher } from '@/components/shared/theme-switcher'
// import UserSession from '@/components/home/navbar/UserSession'

const Menu = () => {
  const cartItems = useFromStore(useCartStore, (state) => state.cart)
  return (
    <div className="flex justify-end gap-3">
      <nav className="hidden md:flex w-full max-w-xs gap-1">
        <ThemeSwitcher />
        <Link
          href="/cart"
          className={cn(
            buttonVariants({
              variant: 'ghost',
            }),
            'relative'
          )}
        >
          <ShoppingCart />
          <span
            className="bg-indigo-800 text-white  flex items-center
            justify-center absolute size-4  right-1 text-xs -top-0.5 rounded-full"
          >
            {cartItems?.length || 0}
          </span>
        </Link>
        {/* <UserSession /> */}
      </nav>
      <nav className="md:hidden">
        <Sheet>
          <SheetTrigger className="align-middle">
            <EllipsisVertical />
          </SheetTrigger>
          <SheetContent className="flex flex-col items-start">
            <SheetTitle>منو</SheetTitle>
            <ThemeSwitcher />
            <Link
              href="/cart"
              className={cn(
                buttonVariants({
                  variant: 'ghost',
                }),
                'relative'
              )}
            >
              <ShoppingCart />
              <span
                className="bg-indigo-800 text-white  flex items-center
            justify-center absolute size-4 right-1 text-xs -top-0.5 rounded-full"
              >
                {cartItems?.length || 0}
              </span>
            </Link>
            {/* <UserSession /> */}
            <SheetDescription></SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}

export default Menu
