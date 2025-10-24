import { format } from 'date-fns-jalali'

import { Separator } from '@/components/ui/separator'

import { Columns, CommentColumn } from './components/columns'
import { DataTable } from '../../components/shared/DataTable'
import { Heading } from './components/Heading'
import { getAllReviews } from '../../lib/queries'
import { Suspense } from 'react'
import { DataTableSkeleton } from '../../components/shared/DataTableSkeleton'
import { currentUser } from '@/lib/auth'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'کامنت',
}

function CommentsDataTable({
  formattedComments,
  page,
  pageSize,
  isNext,
}: {
  formattedComments: CommentColumn[]
  page: number
  pageSize: number
  isNext: boolean
}) {
  return (
    <DataTable
      searchKey="name"
      columns={Columns}
      data={formattedComments}
      pageNumber={page}
      pageSize={pageSize}
      isNext={isNext}
    />
  )
}

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const user = await currentUser()

  if (!user || user?.role !== 'admin') return notFound()
  const params = await searchParams
  const page = params.page ? +params.page : 1
  const pageSize = params.pageSize ? +params.pageSize : 50

  const comments = await getAllReviews({ page, pageSize })

  const formattedComments: CommentColumn[] = comments!.review.map((item) => ({
    id: item.id,
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    name: item.user?.name!,
    title: item.title,
    description: item.description,
    isPending: item.isPending,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <Suspense>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Heading
            title={`کامنت‌ها (${formattedComments?.length})`}
            description="کامنتها را مدیریت کنید."
          />

          <Separator />
          <Suspense fallback={<DataTableSkeleton />}>
            {comments?.review?.length && !!formattedComments && (
              <CommentsDataTable
                formattedComments={formattedComments}
                page={page}
                pageSize={pageSize}
                isNext={comments.isNext}
              />
            )}
          </Suspense>
          <Separator />
        </div>
      </div>
    </Suspense>
  )
}

export default page
