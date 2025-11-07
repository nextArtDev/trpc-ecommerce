import { format as IranianFormat } from 'date-fns-jalali'
import { format as InternationalFormat } from 'date-fns'
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
import { getTranslations } from 'next-intl/server'

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
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()
  const t = await getTranslations('user.orders')
  const locale = (await params).locale

  if (!user) {
    notFound()
  }
  const searchParamsPromise = await searchParams
  const page = searchParamsPromise.page ? +searchParamsPromise.page : 1
  const pageSize = searchParamsPromise.pageSize
    ? +searchParamsPromise.pageSize
    : 50

  const orders = await getMyOrders({ page, pageSize, userId: user.id })
  // console.log(orders.order?.map((t) => t.shippingAddressId))
  const formattedOrders: OrderTypeColumn[] = orders.order?.map((item) => ({
    transactionId: item?.paymentDetails?.transactionId || '',
    name: item.user.name ?? '',
    currency: item.currency,
    exchangeRate: item.exchangeRate || 1,
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
    paidAt: item?.paidAt
      ? locale === 'fa'
        ? IranianFormat(item.paidAt, 'dd MMMM yyyy HH:mm:ss')
        : InternationalFormat(item.paidAt, 'dd MMMM yyyy HH:mm:ss')
      : null,
  }))

  return (
    <div className="flex-col w-full  max-w-5xl mx-auto">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title={t('title', { count: formattedOrders?.length })}
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
