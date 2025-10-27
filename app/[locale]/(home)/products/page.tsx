import { getAllCategories, searchProducts } from '@/lib/home/queries/products'
import { getFiltersData } from '@/lib/home/queries/products'

import { Suspense } from 'react'
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

import { parseSearchParams } from '../search/components/utils'
import SearchPageClient from '../search/components/SearchPageClient'
import { generateSearchMetadata } from '@/lib/utils'
import { getLocale, getTranslations } from 'next-intl/server'
import { getName } from '@/lib/translation-utils'
import { useTranslations } from 'next-intl'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    categoryId?: string
    subCategoryId?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    page?: string
    colors?: string | string[]
    sizes?: string | string[]
  }>
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  const locale = await getLocale()
  const t = await getTranslations('products')

  return generateSearchMetadata(params, locale, t)
}

async function SearchPageContent({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const locale = await getLocale()
  const t = await getTranslations('products')
  const tHome = await getTranslations('home')

  const filters = parseSearchParams(params)

  try {
    // Fetch data in parallel for better performance
    const [searchResults, filtersData, categoriesData] = await Promise.all([
      searchProducts(filters),
      getFiltersData(filters.categoryId, filters.subCategoryId),
      getAllCategories({}),
    ])

    // Transform categories to include name field
    const transformedCategories = categoriesData.categories.map((cat) => ({
      ...cat,
      name: getName(cat.translations),
    }))

    // Transform search results to include name and description
    const transformedProducts = searchResults.products.map((product) => ({
      ...product,
      name: getName(product.translations),
      description: product.translations[0]?.description || '',
    }))

    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: tHome('breadcrumb.home'),
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: params.q ? t('searchResults') : t('allProducts'),
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products`,
        },
        ...(params.q
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: `"${params.q}"`,
                item: `${
                  process.env.NEXT_PUBLIC_SITE_URL
                }/${locale}/products?q=${encodeURIComponent(params.q)}`,
              },
            ]
          : []),
      ],
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': params.q ? 'SearchResultsPage' : 'CollectionPage',
      name: params.q
        ? t('searchResultsFor', { query: params.q })
        : t('allProducts'),
      description: params.q
        ? t('searchResultsDescription', {
            query: params.q,
            count: transformedProducts.length,
          })
        : t('allProductsDescription', {
            count: transformedProducts.length,
          }),
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products${
        params.q ? `?q=${encodeURIComponent(params.q)}` : ''
      }`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: transformedProducts.length,
        itemListElement: transformedProducts
          .slice(0, 20)
          .map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.name,
              description: product.brand,
              image: product.images?.[0]?.url,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${product.slug}`,
              offers: {
                '@type': 'Offer',
                price: product.variants[0]
                  ? product.variants[0].price -
                    product.variants[0].price *
                      (product.variants[0].discount / 100)
                  : 0,
                priceCurrency: 'IRR',
                availability:
                  product.variants[0] && product.variants[0].quantity > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
              },
            },
          })),
      },
    }

    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData),
          }}
        />
        <SearchPageClient
          initialResults={{
            ...searchResults,
            products: transformedProducts,
          }}
          filtersData={filtersData}
          categories={transformedCategories}
          initialFilters={filters}
        />
      </>
    )
  } catch (error) {
    console.error('Search page error:', error)
    return <SearchError />
  }
}

function SearchError() {
  const t = useTranslations('products')

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-lg font-medium mb-2">{t('error.title')}</div>
          <div className="text-muted-foreground">{t('error.description')}</div>
        </CardContent>
      </Card>
    </div>
  )
}

function SearchPageSkeleton() {
  return (
    <div className="container mx-auto overflow-x-hidden py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-80 space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-4" />
                <div className="space-y-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Skeleton */}
        <div className="flex-1">
          <Skeleton className="h-12 w-full mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <Suspense fallback={<SearchPageSkeleton />}>
      <SearchPageContent searchParams={searchParams} />
    </Suspense>
  )
}
