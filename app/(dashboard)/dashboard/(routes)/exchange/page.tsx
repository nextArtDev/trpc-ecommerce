import { Plus } from 'lucide-react'
import { columns, ExchangeColumn } from './components/columns'

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
import { getAllExchanges } from '../../lib/queries'
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'نرخ ارز',
}
function ExchangesDataTable({
  formattedExchanges,
  page,
  pageSize,
  isNext,
}: {
  formattedExchanges: ExchangeColumn[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="code"
      columns={columns}
      data={formattedExchanges}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

export default async function AdminExchangesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await currentUser()

  if (!user || user?.role !== 'admin') return notFound()
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50
  const exchanges = await getAllExchanges({ page, pageSize })
  // if (!exchanges)
  //   return (
  //     <section className="w-full h-full min-h-screen">موردی یافت نشد!</section>
  //   )

  const formattedExchanges: ExchangeColumn[] = exchanges.exchange?.map(
    (item) => ({
      id: item.id,
      code: item.code,
      startDate: item.startDate,
      endDate: item.endDate,
      discount: item.discount,

      createdAt: format(item.createdAt, 'dd MMMM yyyy'),
    })
  )
  return (
    <div className="flex-col">
      <div className="flex-1 flex items-center justify-between space-y-4 p-8 pt-6">
        <Heading
          title={`تخفیفات (${formattedExchanges?.length})`}
          description="تخفیفات را مدیریت کنید."
        />
        <Link
          href={`/dashboard/exchanges/new`}
          className={cn(buttonVariants())}
        >
          <Plus className="ml-2 h-4 w-4" /> اضافه کردن
        </Link>
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!exchanges?.exchange.length && !!formattedExchanges && (
            <ExchangesDataTable
              formattedExchanges={formattedExchanges}
              page={page}
              pageSize={pageSize}
              isNext={exchanges.isNext}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}
