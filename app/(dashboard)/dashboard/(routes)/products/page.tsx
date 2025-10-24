import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { format } from 'date-fns-jalali'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { DataTable } from '../../components/shared/DataTable'
import { DataTableSkeleton } from '../../components/shared/DataTableSkeleton'
import { Heading } from '../../components/shared/Heading'
import { getAllProductsList } from '../../lib/queries'
import { columns, ProductColumn } from './components/columns'
import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'محصولات',
}

function ProductDataTable({
  formattedProduct,
  page,
  pageSize,
  isNext,
}: {
  formattedProduct: ProductColumn[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="name"
      columns={columns}
      data={formattedProduct}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()

  if (!user || user?.role !== 'admin') return notFound()
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const products = await getAllProductsList({ page, pageSize })
  // if (!products) return notFound()
  if (!products) return <h1 className="text-2xl">هیچ محصولی اضافه نشده!</h1>
  const formattedProduct: ProductColumn[] = products?.products?.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    subCategory: item.subCategory,
    offerTag: item?.offerTag,
    variants: item?.variants,
    // colors: item.variants.map((variant) => variant.color),
    // sizes: item.variants.map((variant) => variant.size),
    images: item.images,
    category: item.category,
    featured: item.isFeatured,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 flex items-center justify-between space-y-4 p-8 pt-6">
        <Heading
          title={`محصولات (${formattedProduct?.length})`}
          description="محصولات را مدیریت کنید."
        />
        <Link href={`/dashboard/products/new`} className={cn(buttonVariants())}>
          <Plus className="ml-2 h-4 w-4" /> اضافه کردن
        </Link>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!products.products?.length && !!formattedProduct && (
            <ProductDataTable
              formattedProduct={formattedProduct}
              page={page}
              pageSize={pageSize}
              isNext={products?.isNext}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}
