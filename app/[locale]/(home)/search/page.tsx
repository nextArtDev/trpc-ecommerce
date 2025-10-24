import { getAllCategories, searchProducts } from '@/lib/home/queries/products'
import { getFiltersData } from '@/lib/home/queries/products' // Add this function

import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { parseSearchParams } from './components/utils'
import SearchPageClient from './components/SearchPageClient'
import { generateSearchMetadata } from '@/lib/utils'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    categoryId?: string
    subCategoryId?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    page?: string
    colors?: string | string[]
    sizes?: string | string[]
  }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  return generateSearchMetadata(params)
}

async function SearchPageContent({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const filters = parseSearchParams(params)

  try {
    // Fetch data in parallel for better performance
    const [searchResults, filtersData, categoriesData] = await Promise.all([
      searchProducts(filters),
      getFiltersData(filters.categoryId, filters.subCategoryId),
      getAllCategories({}),
    ])

    return (
      <SearchPageClient
        initialResults={searchResults}
        filtersData={filtersData}
        categories={categoriesData.categories}
        initialFilters={filters}
      />
    )
  } catch (error) {
    console.error('Search page error:', error)
    return <SearchError />
  }
}

function SearchError() {
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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-80 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i}>
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

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  )
}
