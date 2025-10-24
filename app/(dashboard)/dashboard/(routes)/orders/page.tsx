import { format } from 'date-fns-jalali'
import { getAllPaidOrders } from '../../lib/queries'
import { DataTable } from '../../components/shared/DataTable'
import { columns, OrderTypeColumn } from './components/columns'

import { Separator } from '@/components/ui/separator'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'
import {
  City,
  OrderItem,
  Province,
  ShippingAddress,
} from '@/lib/generated/prisma'
import { Suspense } from 'react'
import { DataTableSkeleton } from '../../components/shared/DataTableSkeleton'
import { Heading } from '../../components/shared/Heading'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'سفارشها',
}

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
      searchKey="name"
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

  if (!user || user?.role !== 'admin') return notFound()
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const orders = await getAllPaidOrders({ page, pageSize })
  // console.log(orders.order?.map((t) => t.shippingAddressId))
  const formattedOrders: OrderTypeColumn[] = orders.order?.map((item) => ({
    id: item.id,
    name: item.user.name ?? '',
    paymentStatus: item.paymentStatus as PaymentStatus,
    transactionId: item?.paymentDetails?.transactionId || '',
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
    paidAt: item.paidAt ? format(item.paidAt, 'dd MMMM yyyy hh:mm:ss') : '',
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={`سفارشات (${formattedOrders?.length})`}
          description="سفارشات را مدیریت کنید."
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
