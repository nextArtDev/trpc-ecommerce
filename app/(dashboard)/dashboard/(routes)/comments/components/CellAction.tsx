'use client'

// import { usePathname } from 'next/navigation'
// import { useState, useTransition } from 'react'
// import { MoreHorizontal, Trash } from 'lucide-react'

// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'

// import { useActionState } from 'react'

// import { deleteComment } from '../../../lib/actions/comments'
import { CommentColumn } from './columns'

interface CellActionProps {
  data: CommentColumn
}

// export const CellAction: React.FC<CellActionProps> = ({ data }) => {
export const CellAction: React.FC<CellActionProps> = () => {
  // const path = usePathname()
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isPending, startTransition] = useTransition()

  // const [open, setOpen] = useState(false)

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [deleteState, deleteAction] = useActionState(
  //   deleteComment.bind(null, path, data?.id as string),
  //   {
  //     errors: {},
  //   }
  // )

  return (
    <div className="relative  ">
      {/* <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteAction}
        isPending={isPending}
      />
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">بازکردن منو</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>عملیات</DropdownMenuLabel>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <Trash className="ml-2 h-4 w-4" /> حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </div>
  )
}
