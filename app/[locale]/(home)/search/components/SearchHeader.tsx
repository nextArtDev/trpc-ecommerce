'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { SearchFilters } from '@/lib/types/home'
import { useTranslations, useLocale } from 'next-intl'

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
  const t = useTranslations('search')
  const locale = useLocale()

  const activeFilters = []

  if (filters.search)
    activeFilters.push({
      key: 'search',
      label: t('filters.search', { query: filters.search }),
    })
  if (filters.minPrice)
    activeFilters.push({
      key: 'minPrice',
      label: t('filters.minPrice', {
        price: filters.minPrice.toLocaleString(locale),
      }),
    })
  if (filters.maxPrice)
    activeFilters.push({
      key: 'maxPrice',
      label: t('filters.maxPrice', {
        price: filters.maxPrice.toLocaleString(locale),
      }),
    })
  if (filters.colors?.length)
    activeFilters.push({
      key: 'colors',
      label: t('filters.colors', { colors: filters.colors.join(', ') }),
    })
  if (filters.sizes?.length)
    activeFilters.push({
      key: 'sizes',
      label: t('filters.sizes', { sizes: filters.sizes.join(', ') }),
    })

  const hasActiveFilters = activeFilters.length > 0

  if (!hasActiveFilters && totalResults === 0) return null

  return (
    <Card className="mb-6 p-0 rounded-none">
      <CardContent className="p-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t('results.count', { count: totalResults })}
            </span>
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {t('filters.active')}:
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
                <X className="w-3 h-3 mr-1" />
                {t('filters.clearAll')}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
