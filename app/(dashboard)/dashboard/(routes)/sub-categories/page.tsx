import { Plus } from 'lucide-react'
import { getAllSubCategories } from '../../lib/queries'

import { columns, SubCategoryColumn } from './components/columns'
import { Suspense } from 'react'
import { DataTableSkeleton } from '../../components/shared/DataTableSkeleton'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Heading } from '../../components/shared/Heading'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { format } from 'date-fns-jalali'
import { DataTable } from '../../components/shared/DataTable'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'زیردسته‌بندی',
}

function SubCategoryDataTable({
  formattedSubCategory,
  page,
  pageSize,
  isNext,
}: {
  formattedSubCategory: SubCategoryColumn[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="name"
      columns={columns}
      data={formattedSubCategory}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

export default async function AdminSubCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()

  if (!user || user?.role !== 'admin') return notFound()
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const subCategoriesResponse = await getAllSubCategories({ page, pageSize })

  const formattedSubCategory: SubCategoryColumn[] =
    subCategoriesResponse.subCategories?.map((item) => ({
      id: item.id,
      name: item.name,
      url: item.url,
      featured: item.featured,
      images: item.images,
      category: item.category,
      // categories: categories,

      createdAt: format(item.createdAt, 'dd MMMM yyyy'),
    }))

  return (
    <div className="flex-col">
      <div className="flex-1 flex items-center justify-between space-y-4 p-8 pt-6">
        <Heading
          title={`زیردسته‌بندی (${formattedSubCategory?.length})`}
          description="زیردسته‌بندی را مدیریت کنید."
        />
        <Link
          href={`/dashboard/sub-categories/new`}
          className={cn(buttonVariants())}
        >
          <Plus className="ml-2 h-4 w-4" /> اضافه کردن
        </Link>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!subCategoriesResponse.subCategories?.length &&
            !!formattedSubCategory && (
              <SubCategoryDataTable
                formattedSubCategory={formattedSubCategory}
                page={page}
                pageSize={pageSize}
                isNext={subCategoriesResponse?.isNext}
              />
            )}
        </Suspense>
      </div>
    </div>
  )
}
