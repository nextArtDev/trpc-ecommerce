import { SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible'
import SearchCombobox from '../shared/SearchCombo'

const SearchBar = ({
  isOpen,
  onToggle,
  categories,
}: {
  isOpen: boolean
  onToggle: () => void
  categories: { category: string }[]
}) => (
  <>
    <Button
      variant="ghost"
      size="icon"
      aria-label="Search"
      aria-expanded={isOpen}
      onClick={onToggle}
    >
      <SearchIcon className="h-6 w-6" />
    </Button>

    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className="absolute top-full right-0 w-full bg-background  border-b z-10"
    >
      <CollapsibleContent>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative w-full flex h-16 items-center">
            <div className="relative w-full">
              {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" /> */}
              {/* <Input
                type="search"
                placeholder="جست‌و‌جوی محصولات..."
                className="w-full pl-10 h-12"
                autoFocus
                /> */}
              <SearchCombobox categories={categories || ['']} />
              {/* <Search categories={categories || ['']} /> */}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </>
)

export default SearchBar
