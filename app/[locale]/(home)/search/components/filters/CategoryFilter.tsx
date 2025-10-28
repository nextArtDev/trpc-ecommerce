'use client'
import { Button } from '@/components/ui/button'
import { CategoryData } from '@/lib/types/home'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface CategoryFilterProps {
  categories: CategoryData[]
  selectedCategory?: string
  onCategoryChange: (categoryId?: string) => void
}

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const t = useTranslations('filters')
  const featuredCategories = categories
    .filter((cat) => cat.featured)
    .slice(0, 5)
  const showFeaturedOnly = !isExpanded && categories.length > 5
  const displayCategories = showFeaturedOnly ? featuredCategories : categories

  return (
    <Card dir="rtl" className="rounded-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium">
          {t('category.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={!selectedCategory ? 'indigo' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(undefined)}
          className="w-full justify-start"
        >
          {t('category.all')}
        </Button>

        {displayCategories.map((category) => (
          <div key={category.id} className="flex items-center gap-2">
            {category.featured && (
              <Badge
                variant="outline"
                className="text-xs rounded-xs border-none"
              >
                {t('category.featured')}
              </Badge>
            )}
            <Button
              variant={selectedCategory === category.id ? 'indigo' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="flex-1 justify-center"
            >
              {category.name}
            </Button>
          </div>
        ))}

        {categories.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-center text-muted-foreground"
          >
            {isExpanded ? (
              <>
                {t('showLess')} <ChevronUp className="w-4 h-4 mr-1" />
              </>
            ) : (
              <>
                {t('showMore')} ({categories.length - 5}){' '}
                <ChevronDown className="w-4 h-4 mr-1" />
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
