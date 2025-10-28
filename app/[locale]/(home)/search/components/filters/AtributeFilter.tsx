'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'

interface AttributeFilterProps {
  title: string
  items: string[]
  selectedItems: string[]
  onSelectionChange: (items: string[]) => void
  maxVisible?: number
}

export default function AttributeFilter({
  title,
  items,
  selectedItems,
  onSelectionChange,
  maxVisible = 5,
}: AttributeFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const t = useTranslations('filters')
  const displayItems = isExpanded ? items : items.slice(0, maxVisible)
  const hasMore = items.length > maxVisible

  const toggleItem = (item: string) => {
    if (selectedItems.includes(item)) {
      onSelectionChange(selectedItems.filter((i) => i !== item))
    } else {
      onSelectionChange([...selectedItems, item])
    }
  }

  const clearAll = () => {
    onSelectionChange([])
  }

  if (items.length === 0) return null

  return (
    <Card dir="rtl" className="rounded-none">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {selectedItems.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-xs h-auto p-1 text-red-500"
            >
              {t('clear')}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 flex flex-col items-center justify-center">
        {/* Selected Items */}
        {selectedItems.length > 0 && (
          <div className="flex gap-2">
            {selectedItems.map((item) => (
              <Badge
                key={item}
                variant="default"
                className={cn(
                  'text-xs bg-indigo-600 cursor-pointer hover:bg-destructive',
                  title === t('color.title') && 'p-2'
                )}
                style={{ background: title === t('color.title') ? item : '' }}
                onClick={() => toggleItem(item)}
              >
                {title === t('color.title') ? '' : `${item} ×`}
              </Badge>
            ))}
          </div>
        )}

        {/* Available Items */}
        <div className="space-y-2 flex items-center justify-center gap-2 flex-wrap">
          {displayItems.map((item) => (
            <div
              key={item}
              className="flex gap-1 items-center justify-center space-x-2"
            >
              {title === t('color.title') ? (
                <span
                  className={cn(
                    'size-5 cursor-pointer hover:bg-muted rounded-none',
                    selectedItems.includes(item) &&
                      'ring-1 ring-foreground outline-dashed outline-background outline-1'
                  )}
                  onClick={() => toggleItem(item)}
                  style={{ background: item }}
                ></span>
              ) : (
                <div className="flex flex-wrap gap-1 items-center justify-center space-x-2">
                  <Checkbox
                    id={`${title}-${item}`}
                    checked={selectedItems.includes(item)}
                    onCheckedChange={() => toggleItem(item)}
                  />
                  <label
                    htmlFor={`${title}-${item}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {item}
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Show More/Less */}
        {hasMore && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-center text-muted-foreground"
          >
            {isExpanded ? (
              <>
                {t('showLess')} <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                {t('showMore')} ({items.length - maxVisible}){' '}
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
