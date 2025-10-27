import DiscoverMoreCarousel from '@/components/home/discover-more/DiscoverMoreCarousel'
import Hero from '@/components/home/hero/hero'
import Commitments from '@/components/home/shared/Commitments'
import StoreStatement from '@/components/home/shared/StoreStatement'
import WorkVideo from '@/components/home/shared/WorkVideo'
import TestimonialCarousel from '@/components/home/testemonial/Testemonial'
import BestSellers from '@/components/product/best-sellers'
import Newest from '@/components/product/newest'

import {
  getBestSellers,
  getCategoriesWithStats,
  getHomepageProducts,
  getHomePageReviews,
  getSubCategories,
} from '@/lib/home/queries/products'
import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
  // Fetch data for dynamic meta information
  const t = await getTranslations('metadata')

  const [categories, reviews] = await Promise.all([
    getCategoriesWithStats(),
    getHomePageReviews(),
  ])

  const categoryNames = categories
    ?.map((cat) => cat.translations[0]?.name)
    .slice(0, 5)
  const avgRating = !!reviews?.length
    ? (
        reviews?.reduce((sum, review) => sum + review.rating, 0) /
        reviews?.length
      ).toFixed(1)
    : null

  const description = t('home.description', {
    categories: categoryNames?.join(', '),
    rating: avgRating ? `${avgRating}/5` : '',
    reviewCount: reviews?.length || 0,
  })

  return {
    title: t('home.title'),
    description,
    keywords: [
      ...categoryNames?.map((name) => name?.toLowerCase() || ''),
      ...t('keywords.common').split(','),
    ].join(', '),

    // Open Graph for social sharing
    openGraph: {
      type: 'website',
      title: t('home.title'),
      description,
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: t('siteName'),
      images: [
        {
          url: '/hero-image.webp',
          width: 1200,
          height: 630,
          alt: t('home.title'),
        },
      ],
      locale: 'en_US',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: t('home.title'),
      description,
      images: ['/twitter-home.jpg'],
      creator: '@yourstorehandle',
      site: '@yourstorehandle',
    },

    // Additional metadata
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

    // Canonical URL
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL,
    },

    // Verification
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },

    // Additional tags
    other: {
      'theme-color': '#eceae8',
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'msapplication-TileColor': '#eceae8',
    },
  }
}
export default async function Home() {
  const t = await getTranslations('home')
  const tBestSellers = await getTranslations('bestSellers')
  const tNewestSellers = await getTranslations('newestSellers')
  // await seed()

  const [products, bestSellers, subCategories, reviews] = await Promise.all([
    getHomepageProducts(),
    getBestSellers(),
    // getCategoriesWithStats(),
    getSubCategories(),
    getHomePageReviews(),
  ])

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t('siteName'),
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description: t('organization.description'),
    contactPoint: {
      '@type': 'ContactPoint',
      availableLanguage: ['English', 'Persian'],
    },
    sameAs: [
      'https://facebook.com/yourstore',
      'https://instagram.com/yourstore',
      'https://twitter.com/yourstore',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Iran',
      addressLocality: 'Dezful',
      addressRegion: 'Khozestan',
    },
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t('siteName'),
    url: process.env.NEXT_PUBLIC_SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // Reviews aggregate rating
  const reviewsData = !!reviews?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'AggregateRating',
        itemReviewed: {
          '@type': 'Organization',
          name: t('siteName'),
          url: process.env.NEXT_PUBLIC_SITE_URL,
        },
        ratingValue: (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1),
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      }
    : null

  // Best sellers collection
  const bestSellersData =
    bestSellers && bestSellers.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: tNewestSellers('title'),
          description: tNewestSellers('description'),
          numberOfItems: bestSellers.length,
          itemListElement: bestSellers.slice(0, 10)?.map((product, index) => {
            const firstVariant = product.variants[0]
            const price = firstVariant
              ? firstVariant.price -
                firstVariant.price * (firstVariant.discount / 100)
              : 0
            const availability =
              firstVariant && firstVariant.quantity > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock'
            return {
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: product.translations[0]?.name,
                description: product.translations[0]?.description,
                image: product.images?.[0]?.url,
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
                offers: {
                  '@type': 'Offer',
                  price: price,
                  priceCurrency: 'IRT',
                  availability: availability,
                },
              },
            }
          }),
        }
      : null

  // New arrivals collection
  const newArrivalsData =
    products && products.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          name: t('newestSellers.title'),
          description: t('newestSellers.description'),
          numberOfItems: products.length,
          itemListElement: products.slice(0, 10)?.map((product, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Product',
              name: product.translations[0]?.name,
              description: product.translations[0]?.description,
              image: product.images?.[0]?.url,
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
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
        }
      : null

  // Breadcrumb for home page
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: t('breadcrumb.home'),
        item: process.env.NEXT_PUBLIC_SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: t('breadcrumb.products'),
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: t('breadcrumb.about'),
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: t('breadcrumb.contact'),
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/contact-us`,
      },
    ],
  }

  return (
    <div className="relative w-full h-full items-center justify-items-center min-h-screen mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteData),
        }}
      />
      {reviewsData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(reviewsData),
          }}
        />
      )}
      {bestSellersData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(bestSellersData),
          }}
        />
      )}
      {newArrivalsData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(newArrivalsData),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbData),
        }}
      />
      <Hero subCategories={subCategories} />
      <div className="py-16">
        <StoreStatement />
      </div>
      {!!bestSellers && <BestSellers items={bestSellers} />}
      {!!products && <Newest items={products} />}
      <section className="py-12">
        <WorkVideo />
      </section>
      <section className=" ">
        <Commitments />
      </section>
      <section className="flex flex-col w-full h-full gap-6  text-center py-12 ">
        <h2 className="text-xl md:text-3xl font-bold uppercase text-center py-8  ">
          بیشتر{' '}
        </h2>
        <DiscoverMoreCarousel subCategories={subCategories} />
      </section>

      {!!reviews && (
        <TestimonialCarousel
          testimonials={reviews?.map((review) => {
            const { title, description, user, createdAt, rating } = review
            return {
              title,
              description,
              user: user.name!,
              createdAt,
              rating,
            }
          })}
        />
      )}
    </div>
  )
}
