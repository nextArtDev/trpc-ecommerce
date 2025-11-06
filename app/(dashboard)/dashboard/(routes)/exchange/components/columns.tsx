'use client'

// React, Next.js imports

// UI components
import { ColumnDef } from '@tanstack/react-table'

export type ExchangeColumn = {
  // id: string
  dollarToToman: number
  euroToToman: number

  // createdAt: string
}
export const columns: ColumnDef<ExchangeColumn>[] = [
  {
    accessorKey: 'tomanToDollar',
    header: 'تومان به دلار',
    cell: ({ row }) => {
      return <span>{row.original.dollarToToman}</span>
    },
  },
  {
    accessorKey: 'tomanToEuro',
    header: 'تومان به یورو',
    cell: ({ row }) => {
      return <span>{row.original.euroToToman}</span>
    },
  },

  // {
  //   id: 'actions',
  //   cell: ({ row }) => {
  //     const rowData = row.original

  //     return <CellActions exchangeId={rowData.id} />
  //   },
  // },
]

// Define props interface for CellActions component
// interface CellActionsProps {
//   exchangeId: string
// }

// CellActions component definition
// const CellActions: React.FC<CellActionsProps> = ({ exchangeId }) => {
//   const { setClose } = useModal()
//   // const path = usePathname()

//   if (!exchangeId) return null
//   return (
//     <AlertDialog>
//       <DropdownMenu dir="rtl">
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" className="h-8 w-8 p-0">
//             <span className="sr-only">Open menu</span>
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="start">
//           <DropdownMenuLabel>عملیات</DropdownMenuLabel>
//           <DropdownMenuSeparator />

//           <AlertDialogTrigger asChild>
//             <DropdownMenuItem className="flex gap-2 cursor-pointer">
//               <Trash size={15} /> حذف کوپن
//             </DropdownMenuItem>
//           </AlertDialogTrigger>
//         </DropdownMenuContent>
//       </DropdownMenu>
//       <AlertDialogContent dir="rtl" className="max-w-lg">
//         <AlertDialogHeader>
//           <AlertDialogTitle className="text-right">
//             از حذف کوپن مطمئن هستید؟
//           </AlertDialogTitle>
//           <AlertDialogDescription className="text-right">
//             این عملیات برگشت‌پذیر نیست و تمام کوپن و محصولاتش حذف خواهند شد!
//           </AlertDialogDescription>
//         </AlertDialogHeader>
//         <AlertDialogFooter className="flex items-center">
//           <AlertDialogCancel className="mb-2">صرف‌نظر</AlertDialogCancel>
//           <AlertDialogAction
//             className="bg-destructive hover:bg-destructive mb-2 text-white"
//             onClick={() => {
//               setClose()
//             }}
//           >
//             {/* <form action={deleteAction}>
//               <input className="hidden" />
//               <Button
//                 disabled={pending}
//                 variant={'ghost'}
//                 type="submit"
//                 className="hover:bg-transparent active:bg-transparent w-full outline-none"
//               >
//                 حذف
//               </Button>
//             </form> */}
//           </AlertDialogAction>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   )
// }
