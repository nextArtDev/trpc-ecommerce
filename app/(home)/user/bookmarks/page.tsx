import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { userBookmarkedProducts } from '@/lib/home/queries/products'
import React, { Suspense } from 'react'
import BookmarkedPageClient from './components/BookmarkedPageClient'

interface PageProps {
  searchParams: Promise<{
    page?: string
  }>
}

const BookmarkedPageContent = async ({ searchParams }: PageProps) => {
  const resolvedSearchParams = await searchParams
  const page = resolvedSearchParams.page

  try {
    const products = await userBookmarkedProducts({
      page: page ? parseInt(page, 10) : 1,
      limit: 50, // Changed from 1 to a more reasonable limit
    })
    return (
      <BookmarkedPageClient
        products={products}
        currentPage={page ? parseInt(page, 10) : 1}
      />
    )
  } catch (error) {
    console.error('Search page error:', error)
    return <PageResultError />
  }
}

function PageResultError() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-lg font-medium mb-2">خطا در بارگذاری</div>
          <div className="text-muted-foreground">
            مشکلی در بارگذاری نتایج جستجو رخ داده است. لطفاً دوباره تلاش کنید.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="container mx-auto overflow-x-hidden py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Skeleton */}
        <div className="flex-1">
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i} className="rounded-none">
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookmarkedPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <BookmarkedPageContent searchParams={searchParams} />
    </Suspense>
  )
}
