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
// import { toast } from 'sonner'
import { deleteSubCategory } from '../../../lib/actions/sub-category'

import Link from 'next/link'
import { toast } from 'sonner'

interface CellActionsProps {
  subCategoryId: string
}

export const CellActions: React.FC<CellActionsProps> = ({ subCategoryId }) => {
  const path = usePathname()

  const [formState, deleteAction, pending] = useActionState(
    deleteSubCategory.bind(null, path, subCategoryId as string),
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
  // Return null if rowData or subCategoryId don't exist
  if (!subCategoryId) return null

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
              href={`/dashboard/sub-categories/${subCategoryId}`}
            >
              <Edit size={15} />
              ویرایش زیردسته
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> حذف زیردسته‌بندی
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            از حذف زیردسته‌بندی مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            این عملیات برگشت‌پذیر نیست و تمام زیردسته‌بندی و محصولاتش حذف خواهند
            شد!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">صرف‌نظر</AlertDialogCancel>
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
