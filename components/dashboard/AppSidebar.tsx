'use client'
import * as React from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChartBarStacked,
  ChartColumnStacked,
  ChartNoAxesCombined,
  CirclePercent,
  Home,
  MessageSquare,
  ScanBarcode,
  ShoppingCart,
  Users,
} from 'lucide-react'
import { $Enums } from '@/lib/generated/prisma'
import { cn } from '@/lib/utils'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'

// This is sample data.
// const data = {
//   navMain: [
//     {
//       title: 'وضعیت کلی',
//       url: '/dashboard',
//       items: [
//         {
//           title: 'وضعیت کلی',
//           url: '/dashboard',
//         },
//         // {
//         //   title: 'Project Structure',
//         //   url: '#',
//         // },
//       ],
//     },
//     {
//       title: 'فروشگاه',
//       url: '/dashboard/products',
//       items: [
//         {
//           title: 'دسته‌بندی',
//           url: '/dashboard/categories',
//           // isActive: true,
//         },
//         {
//           title: 'زیر دسته‌بندی',
//           url: '/dashboard/sub-categories',
//           // isActive: true,
//         },
//         {
//           title: 'محصولات',
//           url: '/dashboard/products',
//         },
//         // {
//         //   title: 'Rendering',
//         //   url: '#',
//         // },
//       ],
//     },
//     {
//       title: 'سفارشها',
//       url: '/dashboard/orders',
//       items: [
//         {
//           title: 'سفارشها',
//           url: '/dashboard/orders',
//         },
//       ],
//     },
//     {
//       title: 'تخفیها',
//       url: '/dashboard/coupons',
//       items: [
//         {
//           title: 'کوپن تخفیف',
//           url: '/dashboard/coupons',
//         },
//       ],
//     },
//     {
//       title: 'کاربرها',
//       url: '/dashboard/users',
//       items: [
//         {
//           title: 'کاربرها',
//           url: '/dashboard/users',
//         },
//       ],
//     },
//     {
//       title: 'کامنت‌ها',
//       url: '/dashboard/comments',
//       items: [
//         {
//           title: 'کامنت‌ها',
//           url: '/dashboard/comments',
//         },
//       ],
//     },
//   ],
// }

export default function AppSidebar({
  user,
}: {
  user: {
    id: string
    email: string
    phoneNumber: string | null
    name: string
    role: $Enums.Role
  }
}) {
  const pathname = usePathname()
  const routes = [
    {
      href: `/`,
      label: 'خانه',
      active: pathname === `/`,
      icon: Home,
    },
    {
      href: `/dashboard`,
      label: 'وضعیت',
      active: pathname === `/dashboard`,
      icon: ChartNoAxesCombined,
    },
    {
      href: '/dashboard/categories',
      label: 'دسته‌بندی',
      active: pathname === '/dashboard/categories',
      icon: ChartBarStacked,
    },
    {
      href: '/dashboard/sub-categories',
      label: 'زیر دسته‌بندی',
      active: pathname === '/dashboard/sub-categories',
      icon: ChartColumnStacked,
    },
    {
      href: '/dashboard/products',
      label: 'محصولات',
      active: pathname === '/dashboard/products',
      icon: ScanBarcode,
    },
    {
      href: '/dashboard/orders',
      label: 'سفارشها',
      active: pathname === '/dashboard/orders',
      icon: ShoppingCart,
    },
    {
      href: '/dashboard/coupons',
      label: 'تخفیها',
      active: pathname === '/dashboard/coupons',
      icon: CirclePercent,
    },
    {
      href: '/dashboard/users',
      label: 'کاربرها',
      active: pathname === '/dashboard/users',
      icon: Users,
    },
    {
      href: `/dashboard/comments`,
      label: 'کامنت‌ها',
      active: pathname === `/dashboard/comments`,
      icon: MessageSquare,
    },
  ]
  const { toggleSidebar } = useSidebar()
  return (
    <Sidebar variant="sidebar" side="right">
      <SidebarHeader>{/* <SearchForm /> */}</SidebarHeader>
      <SidebarContent className=" font-bold">
        {/* We create a SidebarGroup for each parent. */}

        <SidebarGroupContent>
          <SidebarMenu className="items-start mx-auto py-4 ">
            {routes.map((item) => (
              <SidebarMenuItem
                onClick={toggleSidebar}
                className={`py-2 w-full ${
                  item.active ? 'text-muted-foreground bg-muted' : ''
                }`}
                key={item.href}
              >
                <SidebarMenuButton asChild>
                  <Link
                    href={item.href}
                    className={cn(' w-full flex items-center  gap-2.5 ')}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
        <Separator />
        <SidebarFooter className="py-4 pr-4 text-center">
          <div className="flex flex-col gap-y-1">
            {user?.name}
            <span className="text-muted-foreground">
              {/* {user?.emailAddresses[0].emailAddress} */}
              {user?.phoneNumber}
            </span>
            <span className="">
              <Badge
                variant="secondary"
                className="capitalize  dark:bg-pink-700/30 dark:text-pink-700  bg-indigo-700/30 text-indigo-700 "
              >
                {user?.role?.toString()?.toLocaleLowerCase()} Dashboard
              </Badge>
            </span>
          </div>
        </SidebarFooter>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
