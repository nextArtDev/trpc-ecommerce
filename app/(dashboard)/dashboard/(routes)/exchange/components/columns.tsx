'use client'

// React, Next.js imports
import { useActionState } from 'react'

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useModal } from '@/providers/modal-provider'
import { MoreHorizontal, Trash } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns-jalali'
import { getTimeUntil } from '../../../lib/utils'
import { usePathname } from 'next/navigation'
import { deleteCoupon } from '../../../lib/actions/coupons'

export type CouponColumn = {
  id: string
  code: string
  startDate: string
  endDate: string
  discount: number
  createdAt: string
}
export const columns: ColumnDef<CouponColumn>[] = [
  {
    accessorKey: 'code',
    header: 'کد',
    cell: ({ row }) => {
      return <span>{row.original.code}</span>
    },
  },
  {
    accessorKey: 'startDate',
    header: 'شروع',
    cell: ({ row }) => {
      return <span>{format(row.original.startDate, 'hh:mm:ss y/LL/dd')}</span>
    },
  },
  {
    accessorKey: 'endDate',
    header: 'پایان',
    cell: ({ row }) => {
      return <span>{format(row.original.endDate, 'hh:mm:ss y/LL/dd')}</span>
    },
  },
  {
    accessorKey: 'timeLeft',
    header: 'زمان مانده',
    cell: ({ row }) => {
      const { days, hours } = getTimeUntil(row.original.endDate)
      return (
        <span>
          {/* {days} days and {hours} hours */}
          {days} روز و {hours} ساعت
        </span>
      )
    },
  },

  {
    accessorKey: 'discount',
    header: 'تخفیف',
    cell: ({ row }) => {
      return (
        <span className="text-red-500 font-bold">{row.original.discount}%</span>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const rowData = row.original

      return <CellActions couponId={rowData.id} />
    },
  },
]

// Define props interface for CellActions component
interface CellActionsProps {
  couponId: string
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ couponId }) => {
  const { setClose } = useModal()
  const path = usePathname()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, deleteAction, pending] = useActionState(
    deleteCoupon.bind(null, path, couponId as string),
    {
      errors: {},
    }
  )
  if (!couponId) return null
  return (
    <AlertDialog>
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2 cursor-pointer">
              <Trash size={15} /> حذف کوپن
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent dir="rtl" className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            از حذف کوپن مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            این عملیات برگشت‌پذیر نیست و تمام کوپن و محصولاتش حذف خواهند شد!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">صرف‌نظر</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={() => {
              setClose()
            }}
          >
            <form action={deleteAction}>
              <input className="hidden" />
              <Button
                disabled={pending}
                variant={'ghost'}
                type="submit"
                className="hover:bg-transparent active:bg-transparent w-full outline-none"
              >
                حذف
              </Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
