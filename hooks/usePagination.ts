'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useCallback } from 'react'

interface UsePaginationOptions {
  paramName?: string
  scroll?: boolean
  shallow?: boolean
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { paramName = 'page', scroll = false } = options
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [loadingPage, setLoadingPage] = useState<number | null>(null)

  const currentPage = parseInt(searchParams.get(paramName) || '1', 10)

  const navigateToPage = useCallback(
    (page: number) => {
      if (page === currentPage || page < 1) {
        return
      }

      setLoadingPage(page)

      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())

        if (page === 1) {
          params.delete(paramName)
        } else {
          params.set(paramName, page.toString())
        }

        const queryString = params.toString()
        const url = queryString ? `?${queryString}` : ''

        router.push(url, { scroll })
        setLoadingPage(null)
      })
    },
    [currentPage, paramName, router, searchParams, scroll]
  )

  return {
    currentPage,
    navigateToPage,
    isPending,
    loadingPage,
    isLoading: isPending || loadingPage !== null,
  }
}

// Usage example in your component:
/*
const BookmarkedPageClient: FC<BookmarkedPageClientProps> = ({ products }) => {
  const { currentPage, navigateToPage, isLoading, loadingPage } = usePagination()

  return (
    <div className="relative min-h-screen pt-16 overflow-x-hidden">
      <ProductGrid products={products.products} loading={isLoading} />
      
      {products.pagination.pages > 1 && (
        <div className="mt-12">
          <Pagination
            pagination={products.pagination}
            onPageChange={navigateToPage}
            loading={isLoading}
            loadingPage={loadingPage}
          />
        </div>
      )}
    </div>
  )
}
*/
