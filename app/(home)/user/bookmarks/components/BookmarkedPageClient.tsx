'use client'

import ProductGrid from '@/app/(home)/search/components/ProductGrid'
import { Button } from '@/components/ui/button'
import { SearchProductsResult } from '@/lib/types/home'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useState, useTransition } from 'react'
import Pagination from './pagination'

interface BookmarkedPageClientProps {
  products: SearchProductsResult
  currentPage: number
}

const BookmarkedPageClient: FC<BookmarkedPageClientProps> = ({
  products,
  currentPage,
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [loadingPage, setLoadingPage] = useState<number | null>(null)

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > products.pagination.pages) {
      return
    }

    setLoadingPage(page)

    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString())

      if (page === 1) {
        params.delete('page')
      } else {
        params.set('page', page.toString())
      }

      const queryString = params.toString()
      const url = queryString ? `?${queryString}` : ''

      router.push(url, { scroll: false })
      setLoadingPage(null)
    })
  }

  const isLoading = isPending || loadingPage !== null

  return (
    <div className="relative min-h-screen pt-16 overflow-x-hidden">
      <h1 className="text-xl lg:text-3xl font-bold text-center pb-8">
        لیست علاقه‌مندی‌ها
      </h1>
      <div className="container mx-auto px-4">
        {/* Product Grid */}
        <ProductGrid products={products.products} loading={isLoading} />

        {/* No products message */}
        {products.products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              هیچ محصولی در لیست علاقه‌مندی‌های شما یافت نشد.
            </p>
          </div>
        )}

        {/* Desktop Pagination */}
        {products.pagination.pages > 1 && (
          <div className="mt-12 hidden lg:block">
            <Pagination
              pagination={products.pagination}
              onPageChange={handlePageChange}
              loading={isLoading}
              loadingPage={loadingPage}
            />
          </div>
        )}

        {/* Mobile Load More Button */}
        {products.pagination.hasNext && (
          <div className="mt-8 text-center lg:hidden">
            <Button
              variant="outline"
              onClick={() => handlePageChange(products.pagination.current + 1)}
              disabled={isLoading}
              className="w-full max-w-sm"
            >
              {isLoading ? 'در حال بارگذاری...' : 'مشاهده بیشتر'}
            </Button>
          </div>
        )}

        {/* Mobile Pagination (Alternative) */}
        {products.pagination.pages > 1 && (
          <div className="mt-8 lg:hidden">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={() =>
                  handlePageChange(products.pagination.current - 1)
                }
                disabled={!products.pagination.hasPrev || isLoading}
                className="flex-1 max-w-[120px]"
              >
                قبلی
              </Button>

              <span className="text-sm text-muted-foreground px-4">
                صفحه {products.pagination.current} از{' '}
                {products.pagination.pages}
              </span>

              <Button
                variant="outline"
                onClick={() =>
                  handlePageChange(products.pagination.current + 1)
                }
                disabled={!products.pagination.hasNext || isLoading}
                className="flex-1 max-w-[120px]"
              >
                بعدی
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookmarkedPageClient
