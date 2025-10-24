'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SearchFilters, SortOption } from '@/lib/types/home'

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
  // const selectedOption =
  //   options.find((opt) => opt.value === selectedSort) || options[0]

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        مرتب‌سازی:
      </span>
      <Select
        dir="rtl"
        value={(selectedSort ?? 'newest') as SearchFilters['sortBy']}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onValueChange={onSortChange}
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
