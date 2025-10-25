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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Category,
  CategoryTranslation,
  Color,
  Image,
  OfferTag,
  OfferTagTranslation,
  ProductVariant,
  Size,
  SubCategory,
  SubCategoryTranslation,
} from '@/lib/generated/prisma'
import { useModal } from '@/providers/modal-provider'
import { ColumnDef } from '@tanstack/react-table'
import {
  BookCheck,
  BookX,
  Edit,
  FilePenLine,
  MoreHorizontal,
  Trash,
} from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { deleteProduct } from '../../../lib/actions/products'
import { toast } from 'sonner'

export type ProductColumn = {
  id: string
  name: string
  slug: string
  subCategory: SubCategory & { translations: SubCategoryTranslation[] }
  offerTag?: (OfferTag & { translations: OfferTagTranslation[] }) | null
  featured: boolean
  images: Image[]
  variants: (ProductVariant & { images: Image[] | null } & {
    size: Size | null
  } & { color: Color | null })[]
  // colors: Color[]
  // sizes: Size[]
  category: Category & { translations: CategoryTranslation[] }
  createdAt: string
}

export const columns: ColumnDef<ProductColumn>[] =
  // Product & {
  //   images: Image[]
  //   variantImages: Image[]
  //   colors: Color[] | null
  //   sizes: Size[] | null
  //   category: Category
  //   subCategory: SubCategory
  //   offerTag: OfferTag | null
  // }
  [
    {
      accessorKey: 'name',
      header: 'نام',
      cell: ({ row }) => {
        return <span>{row.original.name}</span>
      },
    },
    {
      accessorKey: 'image',
      header: 'تصویر',
      cell: ({ row }) => {
        return (
          <div className=" flex flex-col justify-center items-center gap-y-3">
            <Link href={`/dashboard/products/${row.original.id}`}>
              <div className="group relative flex  justify-center items-center cursor-pointer">
                <NextImage
                  src={row.original.images.map((img) => img.url)[0]}
                  alt={`${row.original.name} image`}
                  width={96}
                  height={96}
                  className="max-w-32 h-24 rounded-md object-cover shadow-sm"
                />
                <div className=" w-[230px]  text-background absolute inset-0   z-0 rounded-sm bg-primary/25 transition-all duration-150 hidden group-hover:flex items-center justify-center">
                  <FilePenLine className=" text-background" />
                  ویرایش
                </div>

                <div className="flex flex-col gap-y-2 group">
                  <div className="relative **:flex flex-col mt-2 gap-2 cursor-pointer p-2">
                    <div className=" flex flex-col flex-wrap max-w-sm gap-2 rounded-md">
                      {row.original?.variants?.map((vr) => (
                        <div key={vr.id} className="flex gap-0.5">
                          <span
                            className="w-4 h-4 rounded-full shadow-2xl"
                            style={{ backgroundColor: vr.color?.hex }}
                          />
                          {vr?.size?.name} - ({vr.quantity} عدد)
                        </div>
                      ))}
                    </div>
                    <div></div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )
      },
    },
    {
      accessorKey: 'category',
      header: 'دسته‌بندی',
      cell: ({ row }) => {
        return (
          <span>
            {
              row.original.category.translations.find(
                (tr) => tr.language === 'fa'
              )?.name
            }
          </span>
        )
      },
    },
    {
      accessorKey: 'subCategory',
      header: 'زیردسته‌بندی',
      cell: ({ row }) => {
        return (
          <span>
            {
              row.original.subCategory.translations.find(
                (tr) => tr.language === 'fa'
              )?.name
            }
          </span>
        )
      },
    },
    {
      accessorKey: 'featured',
      header: 'ویژه',
      cell: ({ row }) => {
        return (
          <span>
            {row.original.featured ? (
              <BookCheck className="text-green-400" />
            ) : (
              <BookX className="text-red-500" />
            )}
          </span>
        )
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const rowData = row.original

        return <CellActions productId={rowData.id} />
      },
    },
  ]

// Define props interface for CellActions component
interface CellActionsProps {
  productId: string
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ productId }) => {
  // Hooks
  const { setClose } = useModal()
  // const [loading, setLoading] = useState(false)
  const path = usePathname()

  const [formState, deleteAction, pending] = useActionState(
    deleteProduct.bind(null, path, productId as string),
    {
      errors: {},
    }
  )
  useEffect(() => {
    if (formState.errors._form && formState.errors._form.length > 0) {
      toast.error(formState.errors._form[0])
    }
  }, [formState.errors])
  if (!productId) return null

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
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex gap-2">
              <Link
                className="flex items-center gap-2"
                href={`/dashboard/products/${productId}`}
              >
                <Edit size={15} />
                ویرایش محصول
              </Link>
            </DropdownMenuItem>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                className="flex gap-2 text-red-500"
                onClick={() => {}}
              >
                <Trash size={15} className="text-red-500" /> حذف محصول
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">
            از حذف محصول مطمئن هستید؟
          </AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            این عملیات برگشت‌پذیر نیست و تمام محصول و محصولاتش حذف خواهند شد!
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
