import { Plus } from 'lucide-react'
import { columns, CouponColumn } from './components/columns'

// import DataTable from '../../components/data-table'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { format } from 'date-fns-jalali'
import Link from 'next/link'
import { Suspense } from 'react'
import { DataTable } from '../../components/shared/DataTable'
import { DataTableSkeleton } from '../../components/shared/DataTableSkeleton'
import { Heading } from '../../components/shared/Heading'
import { getAllCoupons } from '../../lib/queries'
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'کوپن تخفیف',
}
function CouponsDataTable({
  formattedCoupons,
  page,
  pageSize,
  isNext,
}: {
  formattedCoupons: CouponColumn[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="code"
      columns={columns}
      data={formattedCoupons}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

export default async function AdminCouponsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await currentUser()

  if (!user || user?.role !== 'admin') return notFound()
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50
  const coupons = await getAllCoupons({ page, pageSize })
  // if (!coupons)
  //   return (
  //     <section className="w-full h-full min-h-screen">موردی یافت نشد!</section>
  //   )

  const formattedCoupons: CouponColumn[] = coupons.coupon?.map((item) => ({
    id: item.id,
    code: item.code,
    startDate: item.startDate,
    endDate: item.endDate,
    discount: item.discount,

    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 flex items-center justify-between space-y-4 p-8 pt-6">
        <Heading
          title={`تخفیفات (${formattedCoupons?.length})`}
          description="تخفیفات را مدیریت کنید."
        />
        <Link href={`/dashboard/coupons/new`} className={cn(buttonVariants())}>
          <Plus className="ml-2 h-4 w-4" /> اضافه کردن
        </Link>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!coupons?.coupon.length && !!formattedCoupons && (
            <CouponsDataTable
              formattedCoupons={formattedCoupons}
              page={page}
              pageSize={pageSize}
              isNext={coupons.isNext}
            />
          )}
        </Suspense>
      </div>
    </div>
    // <section className="px-1">
    //   <Suspense>
    //     <DataTable
    //       actionButtonText={
    //         <>
    //           <Plus size={15} />
    //           ایجاد کوپن تخفیف
    //         </>
    //       }
    //       modalChildren={<CouponDetails />}
    //       newTabLink={`/dashboard/coupons/new`}
    //       filterValue="code"
    //       data={coupons}
    //       columns={columns}
    //       searchPlaceholder="جست‌وجوی کد کوپن..."
    //     />
    //   </Suspense>
    // </section>
  )
}
