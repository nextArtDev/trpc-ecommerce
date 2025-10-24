import { format } from 'date-fns-jalali'
// import { getAllOrders } from '../../lib/queries'
// import { DataTable } from '../../components/shared/DataTable'
// import { columns, OrderTypeColumn } from './components/columns'

import { Separator } from '@/components/ui/separator'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'
import {
  City,
  OrderItem,
  Province,
  ShippingAddress,
} from '@/lib/generated/prisma'
import { Suspense } from 'react'
import { Heading } from '@/app/(dashboard)/dashboard/components/shared/Heading'
import { DataTableSkeleton } from '@/app/(dashboard)/dashboard/components/shared/DataTableSkeleton'
import { DataTable } from '@/app/(dashboard)/dashboard/components/shared/DataTable'
import { columns, OrderTypeColumn } from './components/columns'
import { getMyOrders } from '@/lib/home/queries/order'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

function OrdersDataTable({
  formattedOrders,
  page,
  pageSize,
  isNext,
}: {
  formattedOrders: OrderTypeColumn[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="id"
      columns={columns}
      data={formattedOrders}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()

  if (!user) {
    notFound()
  }
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const orders = await getMyOrders({ page, pageSize, userId: user.id })
  // console.log(orders.order?.map((t) => t.shippingAddressId))
  const formattedOrders: OrderTypeColumn[] = orders.order?.map((item) => ({
    transactionId: item?.paymentDetails?.transactionId || '',
    name: item.user.name ?? '',
    paymentStatus: item.paymentStatus as PaymentStatus,
    orderStatus: item.orderStatus as OrderStatus,
    shippingAddress: item.shippingAddress as ShippingAddress & {
      province: Province | null
    } & {
      city: City | null
    },
    user: item.user,
    total: item.total || undefined,
    items: item.items as OrderItem[],
    shippingFees: item.shippingFees,
    paidAt: item?.paidAt ? format(item.paidAt, 'dd MMMM yyyy HH:mm:ss') : null,
  }))

  return (
    <div className="flex-col w-full  max-w-5xl mx-auto">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`سفارشات شما (${formattedOrders?.length})`}
          description=""
        />

        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!orders?.order.length && !!formattedOrders && (
            <OrdersDataTable
              formattedOrders={formattedOrders}
              page={page}
              pageSize={pageSize}
              isNext={orders.isNext}
            />
          )}
        </Suspense>
        <Separator />
      </div>
    </div>
  )
}

export default AdminOrdersPage
