'use client'

import Image from 'next/image'
import { ColumnDef } from '@tanstack/react-table'

import { Expand } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'

import OrderStatusSelect from './order-status-select'
import StoreOrderSummary from './store-order-summary'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'
import CustomModal from '../../../components/custom-modal'
import PaymentStatusTag from './payment-status'
import {
  City,
  OrderItem,
  Province,
  ShippingAddress,
} from '@/lib/generated/prisma'
import { Button } from '@/components/ui/button'

export type OrderTypeColumn = {
  id: string
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
  transactionId: string | null
  // name: string | null
  // isPending: boolean
  // description: string | null
}

export const columns: ColumnDef<OrderTypeColumn>[] = [
  // {
  //   accessorKey: 'id',
  //   header: 'سفارش',
  //   cell: ({ row }) => {
  //     return <span>{formatId(row.original.id)}</span>
  //   },
  // },
  {
    accessorKey: 'name',
    header: 'نام',
    cell: ({ row }) => {
      return <span>{row.original.name}</span>
    },
  },
  {
    accessorKey: 'products',
    header: 'محصولات',
    cell: ({ row }) => {
      const images = row.original.items.map((product) => product.image)
      return (
        <div className="flex flex-wrap gap-1">
          {images.map((img, i) => (
            <Image
              unoptimized
              key={`${img}-${i}`}
              src={img || '/images/fallback-image.webp'}
              alt=""
              width={100}
              height={100}
              className="w-7 h-7 object-cover rounded-full"
              style={{ transform: `translateX(-${i * 15}px)` }}
            />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'paidAt',
    header: 'زمان پرداخت',
    cell: ({ row }) => {
      return <div>{row.original.paidAt || ''}</div>
    },
  },
  {
    accessorKey: 'paymentStatus',
    header: 'پرداخت',
    cell: ({ row }) => {
      return (
        <div>
          <PaymentStatusTag
            status={row.original.paymentStatus as PaymentStatus}
            isTable
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      return (
        <div>
          <OrderStatusSelect
            orderId={row.original.id}
            status={row.original.orderStatus as OrderStatus}
          />
        </div>
      )
    },
  },
  {
    accessorKey: 'total',
    header: 'مجموع',
    cell: ({ row }) => {
      return <span> {row.original.total}</span>
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

  return (
    <Button
      variant={'secondary'}
      onClick={() => {
        setOpen(
          <CustomModal maxWidth="!max-w-3xl" heading="جزئیات سفارشات">
            <StoreOrderSummary order={order} />
          </CustomModal>
        )
      }}
    >
      <span className="w-7 h-7 rounded-full  grid place-items-center">
        <Expand className="w-5 " />
      </span>
    </Button>
  )
}
