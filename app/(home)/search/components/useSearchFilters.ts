'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { createSearchUrl, parseSearchParams } from './utils'
import { SearchFilters } from '@/lib/types/home'

export function useSearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentFilters = useMemo(() => {
    const params = Object.fromEntries(searchParams.entries())
    return parseSearchParams(params)
  }, [searchParams])

  const updateFilters = useCallback(
    (updates: Partial<SearchFilters>) => {
      const newUrl = createSearchUrl(currentFilters, updates)
      router.push(newUrl)
    },
    [currentFilters, router]
  )

  const clearFilters = useCallback(() => {
    const clearedFilters: Partial<SearchFilters> = {
      categoryId: undefined,
      subCategoryId: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      colors: undefined,
      sizes: undefined,
      page: 1,
    }
    const newUrl = createSearchUrl(currentFilters, clearedFilters)
    router.push(newUrl)
  }, [currentFilters, router])

  return {
    currentFilters,
    updateFilters,
    clearFilters,
  }
}
