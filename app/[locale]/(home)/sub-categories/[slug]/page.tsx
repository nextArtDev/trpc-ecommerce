import { notFound } from 'next/navigation'
import { getSubCategoryBySlug } from '@/lib/home/queries/products'
import { Bounded } from '@/components/shared/Bounded'
import { FadeIn } from '@/components/shared/fade-in'
import Image from 'next/image'
import { RevealText } from '@/components/shared/reveal-text'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { STORE_NAME } from '@/constants/store'
import { getName, getDescription } from '@/lib/translation-utils'
import ProductGrid from '../../search/components/ProductGrid'

interface SubcategoryPageProps {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const t = await getTranslations('subcategory')
  const subcategory = await getSubCategoryBySlug({ slug })

  if (!subcategory) {
    return {
      title: t('notFound.title'),
      description: t('notFound.description'),
      robots: 'noindex, nofollow',
    }
  }

  // Extract translations
  const subcategoryName = getName(subcategory.translations)
  const subcategoryDescription = getDescription(subcategory.translations)
  const categoryName = getName(subcategory.category?.translations || [])

  const productCount = subcategory.products?.length || 0

  const description =
    subcategoryDescription ||
    t('metaDescription', {
      subcategoryName,
      categoryName,
      count: productCount,
    })

  const title = `${subcategoryName} - ${categoryName} | ${STORE_NAME}`

  return {
    title,
    description,
    keywords: [
      subcategoryName.toLowerCase(),
      categoryName.toLowerCase(),
      t('keywords.shop'),
      t('keywords.buyOnline'),
      t('keywords.premiumQuality'),
      t('keywords.fastShipping'),
    ].join(', '),

    openGraph: {
      type: 'website',
      title: `${subcategoryName} - ${categoryName}`,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/sub-categories/${slug}`,
      siteName: STORE_NAME,
      images: [
        {
          url: subcategory.images?.[0]?.url || '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: t('collectionImage', { name: subcategoryName }),
        },
      ],
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${subcategoryName} - ${categoryName}`,
      description,
      images: [subcategory.images?.[0]?.url || '/default-twitter-image.jpg'],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/sub-categories/${slug}`,
      languages: {
        fa: `${process.env.NEXT_PUBLIC_SITE_URL}/fa/sub-categories/${slug}`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/sub-categories/${slug}`,
        de: `${process.env.NEXT_PUBLIC_SITE_URL}/de/sub-categories/${slug}`,
        fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/sub-categories/${slug}`,
        it: `${process.env.NEXT_PUBLIC_SITE_URL}/it/sub-categories/${slug}`,
      },
    },

    other: {
      'product-category': categoryName,
      'product-subcategory': subcategoryName,
      'product-count': productCount.toString(),
    },

    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  }
}

const SubcategoryDetailsPage = async ({ params }: SubcategoryPageProps) => {
  const { slug, locale } = await params
  const t = await getTranslations('subcategory')
  const tHome = await getTranslations('home')

  const subcategory = await getSubCategoryBySlug({ slug })

  if (!subcategory) notFound()

  // Extract translations
  const subcategoryName = getName(subcategory.translations)
  const subcategoryDescription = getDescription(subcategory.translations ?? '')
  const categoryName = getName(subcategory.category?.translations || [])

  // Transform products to include name and description
  const transformedProducts = subcategory.products.map((product) => ({
    ...product,
    name: getName(product.translations),
    description: getDescription(product.translations),
  }))

  // Structured data JSON-LD
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: subcategoryName,
    description:
      subcategoryDescription ||
      t('defaultDescription', { name: subcategoryName }),
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/sub-categories/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: transformedProducts.length,
      itemListElement: transformedProducts
        .slice(0, 10)
        .map((product, index) => {
          const firstVariant = product.variants?.[0]
          const price = firstVariant
            ? firstVariant.price -
              firstVariant.price * (firstVariant.discount / 100)
            : 0

          return {
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.name,
              description: product.description || product.brand,
              image: product.images?.[0]?.url,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${product.slug}`,
              offers: {
                '@type': 'Offer',
                price: price,
                priceCurrency: 'IRR',
                availability:
                  firstVariant && firstVariant.quantity > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
              },
              ...(product.rating > 0 && {
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: product.rating.toFixed(1),
                  reviewCount: product.numReviews || 0,
                  bestRating: 5,
                  worstRating: 1,
                },
              }),
            },
          }
        }),
    },
    breadcrumb: {
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
          name: categoryName,
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/categories/${subcategory.category?.url}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: subcategoryName,
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/sub-categories/${slug}`,
        },
      ],
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
      <div className="w-full h-full flex flex-col items-center justify-center gap-8">
        <Bounded className="relative w-full h-full overflow-hidden bg-neutral-950">
          <FadeIn
            vars={{ scale: 1, opacity: 0.5 }}
            className="absolute inset-0 pt-12 max-h-svh origin-top lg:h-screen motion-safe:scale-125 motion-reduce:opacity-50"
          >
            <Image
              unoptimized
              src={subcategory.images[0]?.url || '/images/fallback-image.webp'}
              priority
              fetchPriority="high"
              alt={t('heroImageAlt', { name: subcategoryName })}
              fill
              className="object-cover origin-top"
            />
          </FadeIn>
          <div className="relative flex h-screen flex-col justify-center">
            <RevealText
              text={subcategoryName}
              id="hero-heading"
              className="font-display max-w-xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
              staggerAmount={0.2}
              duration={1.7}
            />

            {subcategoryDescription && (
              <FadeIn
                className="mt-6 max-w-md translate-y-8 text-lg text-neutral-100"
                vars={{ delay: 1, duration: 1.3 }}
              >
                <p>{subcategoryDescription}</p>
              </FadeIn>
            )}
          </div>
        </Bounded>

        <div className="flex-1 w-full h-full">
          <ProductGrid products={transformedProducts} isInSearchPage={false} />
        </div>
      </div>
    </>
  )
}

export default SubcategoryDetailsPage
