'use client'
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
import { Edit, MoreHorizontal, Trash } from 'lucide-react'

import { usePathname } from 'next/navigation'
import { useActionState, useEffect } from 'react'

import Link from 'next/link'
import { deleteCategory } from '../../../lib/actions/category'
import { toast } from 'sonner'

interface CellActionsProps {
  categoryId: string
}

export const CellActions: React.FC<CellActionsProps> = ({ categoryId }) => {
  const path = usePathname()

  const [formState, deleteAction, pending] = useActionState(
    deleteCategory.bind(null, path, categoryId as string),
    {
      errors: {},
    }
  )
  useEffect(() => {
    if (formState.errors._form && formState.errors._form.length > 0) {
      // Show error toast
      toast.error(formState.errors._form[0])
    }
  }, [formState.errors])
  if (!categoryId) return null

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
          <Link
            className="flex items-center gap-2"
            href={`/dashboard/categories/${categoryId}`}
          >
            <DropdownMenuItem className="flex gap-2">
              <Edit size={15} />
              ویرایش دسته‌بندی
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> حذف دسته‌بندی
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            از حذف دسته‌بندی مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            این عملیات برگشت‌پذیر نیست و تمام دسته‌بندی و محصولاتش حذف خواهند
            شد!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">صرف نظر</AlertDialogCancel>
          <AlertDialogAction
            disabled={pending}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
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
