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
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getExchangeRates } from '../../lib/actions/exchanges'
import ExchangeDetails from './components/exchange-details'

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
    <div className="flex flex-col w-full h-full">
      <DataTable
        searchKey="code"
        columns={columns}
        data={formattedExchanges}
        pageNumber={page}
        pageSize={pageSize}
        isNext={isNext}
      />
      <Separator />
      <ExchangeDetails {...formattedExchanges[0]} />
    </div>
  )
}

export default async function AdminExchangesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await currentUser()

  if (!user || user?.role !== 'admin') return notFound()

  const exchanges = await getExchangeRates()
  // if (!exchanges)
  //   return (
  //     <section className="w-full h-full min-h-screen">موردی یافت نشد!</section>
  //   )

  const formattedExchanges: ExchangeColumn[] = [
    {
      id: exchanges.rates.id,
      tomanToDollar: 1 / exchanges.rates.tomanToDollar,
      tomanToEuro: 1 / exchanges.rates.tomanToEuro,

      createdAt: format(new Date(), 'dd MMMM yyyy'),
    },
  ]
  return (
    <div className="flex-col">
      <div className="flex-1 flex items-center justify-between space-y-4 p-8 pt-6">
        <Heading
          title={`نرخ ارز (${formattedExchanges?.length})`}
          description="نرخ ارز را مدیریت کنید."
        />
      </div>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Separator />
        <Suspense fallback={<DataTableSkeleton />}>
          {!!exchanges?.rates && !!formattedExchanges && (
            <ExchangesDataTable
              formattedExchanges={formattedExchanges}
              page={1}
              pageSize={1}
              isNext={false}
            />
          )}
        </Suspense>
      </div>
    </div>
  )
}
