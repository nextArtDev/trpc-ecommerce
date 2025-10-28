'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchFilters, SortOption } from '@/lib/types/home'
import { useTranslations, useLocale } from 'next-intl'

interface SortMenuProps {
  options: SortOption[]
  selectedSort: SearchFilters['sortBy']
  onSortChange: (sort: SearchFilters['sortBy']) => void
}

export default function SortMenu({
  options,
  selectedSort,
  onSortChange,
}: SortMenuProps) {
  const t = useTranslations('search')
  const locale = useLocale()

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        {t('sort.title')}:
      </span>
      <Select
        dir={locale === 'fa' ? 'rtl' : 'ltr'}
        value={selectedSort || 'newest'}
        onValueChange={(value) =>
          onSortChange(value as SearchFilters['sortBy'])
        }
      >
        <SelectTrigger className="w-[180px] rounded-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value || 'newest'}
              value={option.value || 'newest'}
            >
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
