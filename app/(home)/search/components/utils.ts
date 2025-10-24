import { SearchFilters } from '@/lib/types/home'

export function parseSearchParams(
  searchParams: Record<string, string | string[]>
): SearchFilters {
  return {
    search: typeof searchParams.q === 'string' ? searchParams.q : undefined,
    categoryId:
      typeof searchParams.categoryId === 'string'
        ? searchParams.categoryId
        : undefined,
    subCategoryId:
      typeof searchParams.subCategoryId === 'string'
        ? searchParams.subCategoryId
        : undefined,
    minPrice: searchParams.minPrice
      ? parseInt(searchParams.minPrice as string)
      : undefined,
    maxPrice: searchParams.maxPrice
      ? parseInt(searchParams.maxPrice as string)
      : undefined,
    sortBy: (searchParams.sortBy as SearchFilters['sortBy']) || 'newest',
    page: searchParams.page ? parseInt(searchParams.page as string) : 1,
    colors: Array.isArray(searchParams.colors)
      ? searchParams.colors
      : searchParams.colors
      ? [searchParams.colors as string]
      : undefined,
    sizes: Array.isArray(searchParams.sizes)
      ? searchParams.sizes
      : searchParams.sizes
      ? [searchParams.sizes as string]
      : undefined,
  }
}

export function createSearchUrl(
  baseFilters: SearchFilters,
  updates: Partial<SearchFilters>
): string {
  const filters = { ...baseFilters, ...updates }
  const params = new URLSearchParams()

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v))
      } else {
        params.set(key, value.toString())
      }
    }
  })

  return `/search?${params.toString()}`
}
