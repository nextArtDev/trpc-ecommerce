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
import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

import { usePathname } from 'next/navigation'
import { formatId } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { deleteUser } from '../../../lib/actions/user'
import Link from 'next/link'

export type UserColumnType = {
  id: string
  name: string
  role: string
  phoneNumber: string
  createdAt: string
}
export const columns: ColumnDef<UserColumnType>[] = [
  {
    accessorKey: 'id',
    header: 'Id',
    cell: ({ row }) => {
      return <span>{formatId(row.original.id)}</span>
    },
  },
  {
    accessorKey: 'name',
    header: 'نام',
    cell: ({ row }) => {
      return <span>{row.original.name}</span>
    },
  },
  {
    accessorKey: 'role',
    header: 'نقش',
    cell: ({ row }) => {
      return (
        <Badge
          variant={row.original.role === 'admin' ? 'destructive' : 'default'}
        >
          {row.original.role}
        </Badge>
      )
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const rowData = row.original

      return <CellActions userId={rowData.id} />
    },
  },
]

// Define props interface for CellActions component
interface CellActionsProps {
  userId: string
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ userId }) => {
  const { setClose } = useModal()
  const path = usePathname()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, deleteAction, pending] = useActionState(
    deleteUser.bind(null, path, userId as string),
    {
      errors: {},
    }
  )
  if (!userId) return null
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
          <DropdownMenuItem className="flex gap-2">
            <Link
              className="flex items-center gap-2"
              href={`/dashboard/users/${userId}`}
            >
              <Edit size={15} />
              ویرایش کاربر
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2 cursor-pointer">
              <Trash size={15} /> حذف کاربر
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent dir="rtl" className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            از حذف کاربر مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            این عملیات برگشت‌پذیر نیست و تمام کاربر و محصولاتش حذف خواهند شد!
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
