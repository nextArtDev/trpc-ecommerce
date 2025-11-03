'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import React from 'react'
import { useTranslations } from 'next-intl'

// const links = [
//   {
//     title: 'پروفایل',
//     href: '/user/profile',
//   },
//   {
//     title: 'سفارشها',
//     href: '/user/orders',
//   },
//   {
//     title: 'علاقه‌مندی‌ها',
//     href: '/user/bookmarks',
//   },
// ]

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname()
  const t = useTranslations('user.nav')

  const links = [
    {
      title: t('profile'),
      href: '/user/profile',
    },
    {
      title: t('orders'),
      href: '/user/orders',
    },
    {
      title: t('bookmarks'),
      href: '/user/bookmarks',
    },
  ]
  return (
    <nav
      className={cn('flex items-center space-x-8 lg:space-x-6', className)}
      {...props}
    >
      {links.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'text-base font-medium transition-colors hover:text-primary py-6',
            pathname.includes(item.href)
              ? ' px-2 py-1 underline underline-offset-6'
              : 'text-muted-foreground'
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

export default MainNav
