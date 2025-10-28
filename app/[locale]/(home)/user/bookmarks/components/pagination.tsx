import { Button } from '@/components/ui/button'
import { SearchPagination } from '@/lib/types/home'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react'

interface PaginationProps {
  pagination: SearchPagination
  onPageChange: (page: number) => void
  loading?: boolean
  loadingPage?: number | null
}

export default function Pagination({
  pagination,
  onPageChange,
  loading = false,
  loadingPage = null,
}: PaginationProps) {
  if (pagination.pages <= 1) return null

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    // Calculate the range around current page
    for (
      let i = Math.max(2, pagination.current - delta);
      i <= Math.min(pagination.pages - 1, pagination.current + delta);
      i++
    ) {
      range.push(i)
    }

    // Add first page and dots if needed
    if (pagination.current - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    // Add the range
    rangeWithDots.push(...range)

    // Add dots and last page if needed
    if (pagination.current + delta < pagination.pages - 1) {
      rangeWithDots.push('...', pagination.pages)
    } else if (pagination.pages > 1) {
      rangeWithDots.push(pagination.pages)
    }

    // Remove duplicates (in case page 1 is also in range)
    return rangeWithDots.filter(
      (page, index, arr) => index === 0 || page !== arr[index - 1]
    )
  }

  const isPageLoading = (page: number) => loadingPage === page

  return (
    <div
      className="flex items-center justify-center space-x-reverse space-x-2 mt-8"
      dir="rtl"
    >
      {/* First Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={pagination.current === 1 || loading}
        className="hidden sm:flex"
        title="صفحه اول"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>

      {/* Previous Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.current - 1)}
        disabled={!pagination.hasPrev || loading}
        title="صفحه قبل"
      >
        <ChevronRight className="w-4 h-4" />
        <span className="hidden sm:inline mr-1">قبلی</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex space-x-reverse space-x-1">
        {getPageNumbers().map((page, index) => {
          const isCurrentPage = page === pagination.current
          const isNumber = typeof page === 'number'
          const pageIsLoading = isNumber && isPageLoading(page)

          return (
            <Button
              key={index}
              variant={isCurrentPage ? 'default' : 'outline'}
              size="sm"
              onClick={() => isNumber && onPageChange(page)}
              disabled={!isNumber || loading || pageIsLoading}
              className="min-w-10 relative"
              title={isNumber ? `صفحه ${page}` : ''}
            >
              {pageIsLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                page
              )}
            </Button>
          )
        })}
      </div>

      {/* Next Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.current + 1)}
        disabled={!pagination.hasNext || loading}
        title="صفحه بعد"
      >
        <span className="hidden sm:inline ml-1">بعدی</span>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.pages)}
        disabled={pagination.current === pagination.pages || loading}
        className="hidden sm:flex"
        title="صفحه آخر"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>
    </div>
  )
}
