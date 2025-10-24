import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { OrderStatus } from '@/lib/types/home'

import { FC, useActionState, useTransition } from 'react'
// import OrderStatusTag from './order-status'
import { usePathname } from 'next/navigation'
import { updateOrderItemStatus } from '@/lib/home/actions/order'
import { cn } from '@/lib/utils'
import { Truck } from 'lucide-react'

const statusStyles: {
  [key in OrderStatus]: { bgColor: string; textColor: string; label: string }
} = {
  [OrderStatus.Pending]: {
    bgColor: 'bg-yellow-100 dark:bg-yellow-500/10',
    textColor: 'text-yellow-800 dark:text-yellow-500',
    label: 'در انتظار',
  },
  [OrderStatus.Confirmed]: {
    bgColor: 'bg-blue-100 dark:bg-blue-500/10',
    textColor: 'text-blue-800 dark:text-blue-500',
    label: 'تایید شده',
  },
  [OrderStatus.Processing]: {
    bgColor: 'bg-indigo-100 dark:bg-indigo-500/10',
    textColor: 'text-indigo-800 dark:text-indigo-500',
    label: 'در حال پردازش',
  },
  [OrderStatus.Shipped]: {
    bgColor: 'bg-teal-100 dark:bg-teal-500/10',
    textColor: 'text-teal-800 dark:text-teal-500',
    label: 'ارسال شده',
  },
  [OrderStatus.OutforDelivery]: {
    bgColor: 'bg-orange-100 dark:bg-orange-500/10',
    textColor: 'text-orange-800 dark:text-orange-500',
    label: 'در حال تحویل',
  },
  [OrderStatus.Delivered]: {
    bgColor: 'bg-green-100 dark:bg-green-500/10',
    textColor: 'text-green-800 dark:text-green-500',
    label: 'تحویل شده',
  },
  [OrderStatus.Cancelled]: {
    bgColor: 'bg-red-100 dark:bg-red-500/10',
    textColor: 'text-red-800 dark:text-red-500',
    label: 'لغو شده',
  },
  [OrderStatus.Failed]: {
    bgColor: 'bg-gray-100 dark:bg-gray-500/10',
    textColor: 'text-gray-800 dark:text-gray-500',
    label: 'ناموفق',
  },
  [OrderStatus.Refunded]: {
    bgColor: 'bg-purple-100 dark:bg-purple-500/10',
    textColor: 'text-purple-800 dark:text-purple-500',
    label: 'بازپرداخت شده',
  },
  [OrderStatus.Returned]: {
    bgColor: 'bg-pink-100 dark:bg-pink-500/10',
    textColor: 'text-pink-800 dark:text-pink-500',
    label: 'برگشت شده',
  },

  [OrderStatus.OnHold]: {
    bgColor: 'bg-violet-100 dark:bg-violet-500/10',
    textColor: 'text-violet-800 dark:text-violet-500',
    label: 'نگه‌داشته شده',
  },
}

interface Props {
  orderId: string
  status: OrderStatus
}

const OrderStatusSelect: FC<Props> = ({ orderId, status }) => {
  const [isPending, startTransition] = useTransition()
  const path = usePathname()

  const [actionState, updateAction, pending] = useActionState(
    updateOrderItemStatus.bind(null, path, orderId),
    {
      status: status,
      errors: {},
    }
  )

  // Get current status from action state or fallback to prop
  const currentStatus = (actionState.status as OrderStatus) || status
  const styles = statusStyles[currentStatus]
  const { bgColor, textColor, label } = styles
  // Options - exclude current status
  const options = Object.values(OrderStatus).filter((s) => s !== currentStatus)

  // Handle status selection
  const handleStatusChange = (selectedStatus: OrderStatus) => {
    const formData = new FormData()
    formData.append('status', selectedStatus)
    startTransition(() => {
      updateAction(formData)
    })
  }

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger disabled={isPending} asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(' ', bgColor, textColor)}
            disabled={pending}
          >
            {/* <OrderStatusTag status={currentStatus} /> */}
            <Truck className="shrink-0 size-3" />
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full space-y-1" align="center">
          {options.map((option) => {
            const styles = statusStyles[option]
            const { bgColor, textColor, label } = styles
            return (
              <DropdownMenuItem
                asChild
                key={option}
                onClick={() => handleStatusChange(option)}
                className={cn(
                  'w-full cursor-pointer items-center'
                  // bgColor,
                  // textColor
                )}
                disabled={pending}
              >
                {/* <OrderStatusTag status={option} /> */}
                <Button
                  type="button"
                  variant="outline"
                  className={cn(' ', bgColor, textColor)}
                  disabled={pending}
                >
                  {/* <OrderStatusTag status={currentStatus} /> */}
                  <Truck className="shrink-0 size-3" />
                  {label}
                </Button>
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default OrderStatusSelect
