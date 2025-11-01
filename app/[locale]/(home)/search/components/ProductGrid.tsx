import { Suspense } from 'react'
import ProductCard from '@/components/product/product-card'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchProduct } from '@/lib/types/home'
import { useTranslations } from 'next-intl'

interface ProductGridProps {
  products: SearchProduct[]
  loading?: boolean
  isInSearchPage?: boolean
}

export default function ProductGrid({
  products,
  loading = false,
  isInSearchPage = true,
}: ProductGridProps) {
  const t = useTranslations('products')

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="rounded-none">
            <CardContent className="p-4">
              <Skeleton className="w-full h-48 mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-6 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <Card className="rounded-none">
        <CardContent className="py-12 text-center">
          <div className="text-lg font-medium mb-2">
            {t('noProducts.title')}
          </div>
          {isInSearchPage && (
            <div className="text-muted-foreground">
              {t('noProducts.description')}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
      {products.map((product) => (
        <Suspense key={product.id} fallback={<ProductCardSkeleton />}>
          <ProductCard product={product} />
        </Suspense>
      ))}
    </div>
  )
}

function ProductCardSkeleton() {
  return (
    <Card className="rounded-none">
      <CardContent className="p-4">
        <Skeleton className="w-full h-48 mb-4" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-6 w-1/3" />
      </CardContent>
    </Card>
  )
}
