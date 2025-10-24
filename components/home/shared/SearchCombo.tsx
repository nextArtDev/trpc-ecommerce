import { Check, ChevronsUpDown, SearchIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'

const SearchCombobox = ({
  categories,
}: {
  categories: { category: string }[]
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || 'all'
  )

  const debouncedSearch = useDebouncedCallback(
    (searchTerm: string, category: string) => {
      const params = new URLSearchParams()

      if (searchTerm.trim()) {
        params.set('q', searchTerm.trim())
      }
      if (category && category !== 'all') {
        params.set('category', category)
      }

      const queryString = params.toString()
      const newUrl = queryString ? `/search?${queryString}` : '/search'
      router.push(newUrl)
    },
    500
  )

  useEffect(() => {
    if (query.trim() || selectedCategory !== 'all') {
      debouncedSearch(query, selectedCategory)
    }
  }, [query, selectedCategory, debouncedSearch])

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-[150px] justify-between"
          >
            {selectedCategory === 'all' ? 'همه' : selectedCategory}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[150px] p-0">
          <Command>
            <CommandList>
              <CommandGroup>
                <CommandItem onSelect={() => setSelectedCategory('all')}>
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedCategory === 'all' ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  همه
                </CommandItem>
                {categories.map((category) => (
                  <CommandItem
                    key={category.category}
                    onSelect={() => setSelectedCategory(category.category)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedCategory === category.category
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {category.category}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="relative flex-1">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="جست‌وجو..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}

export default SearchCombobox
