'use client'

import { ColumnDef } from '@tanstack/react-table'

import { Expand } from 'lucide-react'
import { useModal } from '@/providers/modal-provider'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'

// import OrderStatusSelect from './order-status-select'
// import StoreOrderSummary from './store-order-summary'
// import CustomModal from '../../../components/custom-modal'
// import PaymentStatusTag from './payment-status'
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
  // name: string | null
  // isPending: boolean
  // description: string | null
}

export const columns: ColumnDef<OrderTypeColumn>[] = [
  {
    accessorKey: 'transactionId',
    header: 'کد رهگیری',
    cell: ({ row }) => <span>{row.original.transactionId}</span>,
  },
  // {
  //   accessorKey: 'products',
  //   header: 'محصولات',
  //   cell: ({ row }) => {
  //     const images = row.original.items.map((product) => product.image)
  //     return (
  //       <div className="flex flex-wrap gap-1">
  //         {images.map((img, i) => (
  //           <Image
  //             key={`${img}-${i}`}
  //             src={img}
  //             alt=""
  //             width={100}
  //             height={100}
  //             className="w-7 h-7 object-cover rounded-full"
  //             style={{ transform: `translateX(-${i * 15}px)` }}
  //           />
  //         ))}
  //       </div>
  //     )
  //   },
  // },
  {
    accessorKey: 'paymentStatus',
    header: 'پرداخت',
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
    header: 'وضعیت ارسال',
    cell: ({ row }) => {
      return (
        <div className="">
          {/* <OrderStatusSelect
            orderId={row.original.id}
            status={row.original.orderStatus as OrderStatus}
          /> */}

          <OrderStatusTag
            status={row.original.orderStatus as OrderStatus}
            // isTable
          />

          {/* {row.original.orderStatus} */}
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
