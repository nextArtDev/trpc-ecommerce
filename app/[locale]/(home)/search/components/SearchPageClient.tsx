'use client'

import { useState, useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Filter } from 'lucide-react'
import {
  CategoryData,
  FiltersData,
  SearchFilters,
  SearchProductsResult,
  SortOption,
} from '@/lib/types/home'
import { useSearchFilters } from './useSearchFilters'
import SearchSidebar from './SearchSidebbar'
import SearchHeader from './SearchHeader'
import SortMenu from './SortMenu'
import ProductGrid from './ProductGrid'
import Pagination from './Pagination'
// import Pagination from './Pagination'

interface SearchPageClientProps {
  initialResults: SearchProductsResult
  filtersData: FiltersData
  categories: CategoryData[]
  initialFilters: SearchFilters
}

const sortOptions: SortOption[] = [
  { name: 'جدیدترین', value: 'newest' },
  { name: 'قدیمی‌ترین', value: 'oldest' },
  { name: 'ارزانترین', value: 'price_asc' },
  { name: 'گرانترین', value: 'price_desc' },
  { name: 'بهترین امتیاز', value: 'rating' },
  { name: 'پرفروش‌ترین', value: 'sales' },
]

export default function SearchPageClient({
  initialResults,
  filtersData,
  categories,
}: SearchPageClientProps) {
  const { currentFilters, updateFilters, clearFilters } = useSearchFilters()
  const [results, setResults] = useState(initialResults)
  const [loading, setLoading] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Update results when filters change (you might want to implement client-side filtering
  // or refetch from server depending on your needs)
  useEffect(() => {
    // You can implement client-side filtering here or trigger a server refetch
    // For now, we'll keep the initial results
    setResults(initialResults)
  }, [currentFilters, initialResults])

  const handleSortChange = (sortBy: SearchFilters['sortBy']) => {
    setLoading(true)
    updateFilters({ sortBy })
    // Simulate loading delay - in real app, this would be handled by the server refetch
    setTimeout(() => setLoading(false), 500)
  }

  const handlePageChange = (page: number) => {
    setLoading(true)
    updateFilters({ page })
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setLoading(false), 500)
  }

  const sidebarContent = (
    <SearchSidebar
      filtersData={filtersData}
      categories={categories}
      currentFilters={currentFilters}
      onFiltersChange={updateFilters}
    />
  )

  return (
    <div className="min-h-screen pt-16 overflow-x-hidden">
      <div className="  mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {currentFilters.search
              ? `نتایج جستجو برای "${currentFilters.search}"`
              : '  محصولات'}
          </h1>
          {/* <p className="text-muted-foreground">
            بهترین محصولات را با فیلترهای پیشرفته پیدا کنید
          </p> */}
        </div>

        {/* Search Results Header */}
        <SearchHeader
          filters={currentFilters}
          totalResults={results.pagination.total}
          onClearFilters={clearFilters}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">{sidebarContent}</div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full mb-6 rounded-none">
                  <Filter className="w-4 h-4 mr-2" />
                  فیلترها و دسته‌بندی
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="p-6">{sidebarContent}</div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort Menu */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-muted-foreground">
                {results.pagination.current}/{results.pagination.pages}
              </div>
              <SortMenu
                options={sortOptions}
                selectedSort={currentFilters.sortBy}
                onSortChange={handleSortChange}
              />
            </div>

            {/* Products Grid */}
            <ProductGrid products={results.products} loading={loading} />

            {/* Pagination */}
            {results.pagination.pages > 1 && (
              <div className="mt-12">
                <Pagination
                  pagination={results.pagination}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Load More Button for Mobile (Alternative to Pagination) */}
            {results.pagination.hasNext && (
              <div className="mt-8 text-center lg:hidden">
                <Button
                  variant="outline"
                  onClick={() =>
                    handlePageChange(results.pagination.current + 1)
                  }
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'در حال بارگذاری...' : 'مشاهده بیشتر'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
