'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Expand } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'
import {
  City,
  OrderItem,
  Province,
  ShippingAddress,
} from '@/lib/generated/prisma'
import { Button } from '@/components/ui/button'
import CustomModal from '@/app/(dashboard)/dashboard/components/custom-modal'
import PaymentStatusTag from '@/app/(dashboard)/dashboard/(routes)/orders/components/payment-status'
import StoreOrderSummary from './store-order-summary'
import OrderStatusTag from '@/app/(dashboard)/dashboard/(routes)/orders/components/order-status'
import { useTranslations } from 'next-intl'

export type OrderTypeColumn = {
  transactionId: string
  name: string
  paymentStatus: PaymentStatus
  shippingAddress: ShippingAddress & { province: Province | null } & {
    city: City | null
  }
  orderStatus: OrderStatus
  user: { name: string | null; phoneNumber: string | null }
  items: OrderItem[]
  shippingFees: number | null
  total: number | undefined
  paidAt: string | null
}

const ColumnHeader: React.FC<{ id: string }> = ({ id }) => {
  const t = useTranslations('user.orders')
  return <span>{t(id)}</span>
}

export const columns: ColumnDef<OrderTypeColumn>[] = [
  {
    accessorKey: 'transactionId',
    header: () => <ColumnHeader id="transactionId" />,
    cell: ({ row }) => <span>{row.original.transactionId}</span>,
  },
  {
    accessorKey: 'paymentStatus',
    header: () => <ColumnHeader id="payment" />,
    cell: ({ row }) => {
      return (
        <PaymentStatusTag
          status={row.original.paymentStatus as PaymentStatus}
          isTable
        />
      )
    },
  },
  {
    accessorKey: 'status',
    header: () => <ColumnHeader id="shippingStatus" />,
    cell: ({ row }) => {
      return (
        <div className="">
          <OrderStatusTag status={row.original.orderStatus as OrderStatus} />
        </div>
      )
    },
  },
  {
    accessorKey: 'total',
    header: () => <ColumnHeader id="total" />,
    cell: ({ row }) => {
      return <span>{row.original.total}</span>
    },
  },
  {
    accessorKey: 'open',
    header: '',
    cell: ({ row }) => {
      return <ViewOrderButton order={row.original} />
    },
  },
]
interface ViewOrderButtonProps {
  order: OrderTypeColumn
}

const ViewOrderButton: React.FC<ViewOrderButtonProps> = ({ order }) => {
  const { setOpen } = useModal()
  const t = useTranslations('user.orders')

  return (
    <Button
      variant={'secondary'}
      onClick={() => {
        setOpen(
          <CustomModal maxWidth="!max-w-3xl" heading={t('orderDetails')}>
            <StoreOrderSummary order={order} />
          </CustomModal>
        )
      }}
    >
      <span className="w-7 h-7 rounded-full grid place-items-center">
        <Expand className="w-5" />
      </span>
    </Button>
  )
}
