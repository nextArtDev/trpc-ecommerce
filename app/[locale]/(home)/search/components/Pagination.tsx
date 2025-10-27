import { Button } from '@/components/ui/button'
import { SearchPagination } from '@/lib/types/home'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

interface PaginationProps {
  pagination: SearchPagination
  onPageChange: (page: number) => void
}

export default function Pagination({
  pagination,
  onPageChange,
}: PaginationProps) {
  if (pagination.pages <= 1) return null

  const getPageNumbers = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, pagination.current - delta);
      i <= Math.min(pagination.pages - 1, pagination.current + delta);
      i++
    ) {
      range.push(i)
    }

    if (pagination.current - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (pagination.current + delta < pagination.pages - 1) {
      rangeWithDots.push('...', pagination.pages)
    } else {
      rangeWithDots.push(pagination.pages)
    }

    return rangeWithDots
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      {/* First Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={pagination.current === 1}
        className="hidden sm:flex"
      >
        <ChevronsRight className="w-4 h-4" />
      </Button>

      {/* Previous Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.current - 1)}
        disabled={!pagination.hasPrev}
      >
        <ChevronRight className="w-4 h-4" />
        <span className="hidden sm:inline mr-1">قبلی</span>
      </Button>

      {/* Page Numbers */}
      <div className="flex space-x-1">
        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            variant={page === pagination.current ? 'default' : 'outline'}
            size="sm"
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={typeof page !== 'number'}
            className="min-w-10"
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Next Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.current + 1)}
        disabled={!pagination.hasNext}
      >
        <span className="hidden sm:inline ml-1">بعدی</span>
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {/* Last Page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(pagination.pages)}
        disabled={pagination.current === pagination.pages}
        className="hidden sm:flex"
      >
        <ChevronsLeft className="w-4 h-4" />
      </Button>
    </div>
  )
}
