import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { SearchFilters } from '@/lib/types/home'

interface SearchHeaderProps {
  filters: SearchFilters
  totalResults: number
  onClearFilters: () => void
}

export default function SearchHeader({
  filters,
  totalResults,
  onClearFilters,
}: SearchHeaderProps) {
  const activeFilters = []

  if (filters.search)
    activeFilters.push({ key: 'search', label: `جستجو: ${filters.search}` })
  if (filters.minPrice)
    activeFilters.push({
      key: 'minPrice',
      label: `حداقل: ${filters.minPrice.toLocaleString()}`,
    })
  if (filters.maxPrice)
    activeFilters.push({
      key: 'maxPrice',
      label: `حداکثر: ${filters.maxPrice.toLocaleString()}`,
    })
  if (filters.colors?.length)
    activeFilters.push({
      key: 'colors',
      label: `رنگ: ${filters.colors.join(', ')}`,
    })
  if (filters.sizes?.length)
    activeFilters.push({
      key: 'sizes',
      label: `سایز: ${filters.sizes.join(', ')}`,
    })

  const hasActiveFilters = activeFilters.length > 0

  if (!hasActiveFilters && totalResults === 0) return null

  return (
    <Card className="mb-6 p-0 rounded-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {totalResults} محصول یافت شد
            </span>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">
                فیلترهای فعال:
              </span>
              {activeFilters.map((filter) => (
                <Badge key={filter.key} variant="secondary" className="text-xs">
                  {filter.label}
                </Badge>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-6 px-2 text-xs text-red-400"
              >
                <X className="w-3 h-3 mr-1 " />
                حذف همه
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
