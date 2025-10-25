import { Plus } from 'lucide-react'
import { CategoryColumn, columns } from './components/columns'
import { getAllCategories } from '../../lib/queries'
import { Suspense } from 'react'
import { format } from 'date-fns-jalali'
import { Heading } from '../../components/shared/Heading'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { DataTableSkeleton } from '../../components/shared/DataTableSkeleton'
import { DataTable } from '../../components/shared/DataTable'
import { getCurrentUser } from '@/lib/auth-helpers'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'دسته‌بندی',
}

function CategoryDataTable({
  formattedCategory,
  page,
  pageSize,
  isNext,
}: {
  formattedCategory: CategoryColumn[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="name"
      columns={columns}
      data={formattedCategory}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

export const dynamic = 'force-dynamic'

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await getCurrentUser()

  if (!user || user?.role !== 'admin') return notFound()
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const categoriesResponse = await getAllCategories({ page, pageSize })

  const formattedCategory: CategoryColumn[] =
    categoriesResponse.categories?.map((item) => ({
      id: item.id,
      name: item.translations.find((t) => t.language === 'fa')?.name as string,
      url: item.url,
      featured: item.featured,
      images: item.images,
      // categories: categories,

      createdAt: format(item.createdAt, 'dd MMMM yyyy'),
    }))

  return (
    <div className="flex-col">
      <div className="flex-1 flex items-center justify-between space-y-4 p-8 pt-6">
        <Heading
          title={`دسته‌بندی (${formattedCategory?.length})`}
          description="دسته‌بندی را مدیریت کنید."
        />
        <Link
          href={`/dashboard/categories/new`}
          className={cn(buttonVariants())}
        >
          <Plus className="ml-2 h-4 w-4" /> اضافه کردن
        </Link>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!categoriesResponse.categories?.length && !!formattedCategory && (
            <CategoryDataTable
              formattedCategory={formattedCategory}
              page={page}
              pageSize={pageSize}
              isNext={categoriesResponse?.isNext}
            />
          )}
        </Suspense>
      </div>
    </div>
    // <div className="px-1">
    //   <DataTable
    //     actionButtonText={
    //       <>
    //         <Plus size={15} />
    //         ایجاد دسته‌بندی
    //       </>
    //     }
    //     modalChildren={<CategoryDetails />}
    //     newTabLink="/dashboard/categories/new"
    //     filterValue="name"
    //     data={categoriesResponse.categories}
    //     searchPlaceholder="جست‌وجو..."
    //     columns={columns}
    //   />
    // </div>
  )
}
