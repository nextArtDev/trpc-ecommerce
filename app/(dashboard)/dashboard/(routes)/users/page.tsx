import { format } from 'date-fns-jalali'
import { getAllUsers } from '../../lib/queries'
import { DataTable } from '../../components/shared/DataTable'

import { Separator } from '@/components/ui/separator'

import { Suspense } from 'react'
import { DataTableSkeleton } from '../../components/shared/DataTableSkeleton'
import { Heading } from '../../components/shared/Heading'
import { columns, UserColumnType } from './components/columns'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'کاربرها',
}

function UsersDataTable({
  formattedUsers,
  page,
  pageSize,
  isNext,
}: {
  formattedUsers: UserColumnType[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="name"
      columns={columns}
      data={formattedUsers}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()

  if (!user || user?.role !== 'admin') return notFound()

  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const users = await getAllUsers({ page, pageSize })
  const formattedUsers: UserColumnType[] = users.users?.map((item) => ({
    id: item.id,
    name: item.name ?? '',
    role: item.role,
    phoneNumber: item.phoneNumber ?? '',

    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`کاربرها (${formattedUsers?.length})`}
          description="کاربرها را مدیریت کنید."
        />

        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!users?.users.length && !!formattedUsers && (
            <UsersDataTable
              formattedUsers={formattedUsers}
              page={page}
              pageSize={pageSize}
              isNext={users.isNext}
            />
          )}
        </Suspense>
        <Separator />
      </div>
    </div>
  )
}

export default AdminUsersPage
