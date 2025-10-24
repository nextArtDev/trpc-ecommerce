'use client'

import { useState, useEffect } from 'react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from 'use-debounce'

const AdminSearch = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  // Determine the target URL based on current pathname
  const getTargetUrl = () => {
    if (pathname.includes('/dashboard/orders')) {
      return '/dashboard/orders'
    } else if (pathname.includes('/dashboard/users')) {
      return '/dashboard/users'
    } else {
      return '/dashboard/products'
    }
  }

  const [queryValue, setQueryValue] = useState(searchParams.get('query') || '')

  // Debounced search function that updates URL without page reload
  const debouncedSearch = useDebouncedCallback((searchTerm: string) => {
    const targetUrl = getTargetUrl()
    const params = new URLSearchParams()

    // Preserve existing search params except query and page
    searchParams.forEach((value, key) => {
      if (key !== 'query' && key !== 'page') {
        params.set(key, value)
      }
    })

    if (searchTerm.trim()) {
      params.set('query', searchTerm.trim())
    }

    const queryString = params.toString()
    const newUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl

    router.push(newUrl)
  }, 400)

  // Update local state when URL search params change
  useEffect(() => {
    const currentQuery = searchParams.get('query') || ''
    setQueryValue(currentQuery)
  }, [searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQueryValue(value)
    debouncedSearch(value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Cancel any pending debounced calls and execute immediately
    debouncedSearch.cancel()

    const targetUrl = getTargetUrl()
    const params = new URLSearchParams()

    // Preserve existing search params except query and page
    searchParams.forEach((value, key) => {
      if (key !== 'query' && key !== 'page') {
        params.set(key, value)
      }
    })

    if (queryValue.trim()) {
      params.set('query', queryValue.trim())
    }

    const queryString = params.toString()
    const newUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl

    router.push(newUrl)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="search"
        placeholder="جست‌وجو..."
        value={queryValue}
        onChange={handleInputChange}
        className="md:w-[100px] lg:w-[300px]"
      />
    </form>
  )
}

export default AdminSearch
