import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import OrderDetailsTable from './components/order-details-table1'
import { getOrderById } from '@/lib/home/queries/order'
import {
  Country,
  Order,
  OrderItem,
  ShippingAddress,
  State,
} from '@/lib/generated/prisma'
import { Suspense } from 'react'
import { OrderDetailsSkeleton } from './components/Skeletons'
import { getCurrentUser } from '@/lib/auth-helpers'
import { getTranslations } from 'next-intl/server'
import { Currency } from '@/lib/types/home'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export async function generateMetadata({
  params,
}: {
  params: Promise<{ orderId: string }>
}): Promise<Metadata> {
  const { orderId } = await params
  const t = await getTranslations('order')

  return {
    title: t('title', { orderId }),
  }
}
function OrderDetailsTableWrapper({
  order,
  isAdmin,
  currency,
}: {
  order: Order & { items: OrderItem[] } & {
    shippingAddress: ShippingAddress & { province: { name: string | null } } & {
      city: { name: string | null }
    } & { country: Country | null } & {
      state: State | null
    }
  } & { paymentDetails: { transactionId: string | null } | null } & {
    user: { name: string; phoneNumber: string | null }
  }

  isAdmin: boolean
  currency: Currency
}) {
  return (
    <OrderDetailsTable
      order={{
        ...order,

        shippingAddress: {
          ...order.shippingAddress,
          province: order.shippingAddress?.province,
          city: order.shippingAddress.city,
          country: order.shippingAddress.country,
          state: order.shippingAddress.state,
        },
        user: {
          name: order.user.name,
          phoneNumber: order.user.phoneNumber ?? '',
        },
      }}
      isAdmin={isAdmin}
      currency={currency}
    />
  )
}

const OrderDetailsPage = async ({
  params,
}: {
  params: Promise<{ orderId: string }>
}) => {
  const orderId = (await params).orderId
  const [order, currentUser] = await Promise.all([
    getOrderById(orderId),
    getCurrentUser(),
  ])
  // console.log({ order })
  if (!order) notFound()
  const isAdmin = currentUser?.role === 'admin' || false

  return (
    <section>
      <Suspense fallback={<OrderDetailsSkeleton />}>
        <OrderDetailsTableWrapper
          order={order}
          isAdmin={isAdmin}
          currency={order.currency}
        />
      </Suspense>
    </section>
  )
}

export default OrderDetailsPage
