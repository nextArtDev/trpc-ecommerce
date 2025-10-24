'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { CategoryData, FiltersData, SearchFilters } from '@/lib/types/home'
import CategoryFilter from './filters/CategoryFilter'
import PriceFilter from './filters/PriceFilter'
import AttributeFilter from './filters/AtributeFilter'

interface SearchSidebarProps {
  filtersData: FiltersData
  categories: CategoryData[]
  currentFilters: SearchFilters
  onFiltersChange: (filters: Partial<SearchFilters>) => void
}

export default function SearchSidebar({
  filtersData,
  categories,
  currentFilters,
  onFiltersChange,
}: SearchSidebarProps) {
  return (
    <div className="w-full lg:w-80">
      <ScrollArea className="h-[calc(100vh-10px)]">
        <div className="space-y-6 p-1">
          {/* Category Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={currentFilters.categoryId}
            onCategoryChange={(categoryId) =>
              onFiltersChange({ categoryId, page: 1 })
            }
          />

          {/* Price Filter */}
          <PriceFilter
            filtersData={filtersData}
            selectedMinPrice={currentFilters.minPrice}
            selectedMaxPrice={currentFilters.maxPrice}
            onPriceChange={(minPrice, maxPrice) =>
              onFiltersChange({ minPrice, maxPrice, page: 1 })
            }
          />

          {/* Color Filter */}
          <AttributeFilter
            title="رنگ"
            items={filtersData.colors}
            selectedItems={currentFilters.colors || []}
            onSelectionChange={(colors) => onFiltersChange({ colors, page: 1 })}
          />

          {/* Size Filter */}
          <AttributeFilter
            title="سایز"
            items={filtersData.sizes}
            selectedItems={currentFilters.sizes || []}
            onSelectionChange={(sizes) => onFiltersChange({ sizes, page: 1 })}
          />

          {/* Brand Filter */}
          {/* <AttributeFilter
            title="برند"
            items={filtersData.brands}
            selectedItems={[]} // Add brand filter to SearchFilters type if needed
            onSelectionChange={() => {}} // Implement brand filtering
          /> */}
        </div>
      </ScrollArea>
    </div>
  )
}
