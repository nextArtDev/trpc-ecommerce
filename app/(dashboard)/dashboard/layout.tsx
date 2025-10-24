import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import AppSidebar from '../../../components/dashboard/AppSidebar'
import { Separator } from '@/components/ui/separator'
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb'
// import AdminSearch from '@/components/dashboard/admin-search'
import localFont from 'next/font/local'
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
const farsiFont = localFont({
  src: '../../../public/fonts/FarsiFont.woff2',
})

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()
  if (!user || user.role !== 'admin') return notFound()
  // if (!user ) {
  //   redirect('/')
  // }

  // if (user.role !== 'admin') {
  //   redirect('/sign-in')
  // }

  return (
    <section dir="rtl" className={`w-full h-full ${farsiFont.className}`}>
      <SidebarProvider>
        <AppSidebar user={user} />
        <main className="w-full h-full">
          <SidebarInset>
            <header className="w-full px-2 flex h-16 shrink-0 items-center gap-2 border-b">
              <SidebarTrigger />
              {/* <p>LOGO</p> */}
              <Separator orientation="vertical" className="mr-2 h-4" />
              {/* <AdminSearch /> */}
            </header>
          </SidebarInset>
          {/* <SidebarTrigger /> */}
          {children}
        </main>
      </SidebarProvider>
    </section>
  )
}
