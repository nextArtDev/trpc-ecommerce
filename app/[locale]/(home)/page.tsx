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

export async function generateMetadata(): Promise<Metadata> {
  // Fetch data for dynamic meta information
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

  const description = `کارگاه ساخت کیف و محصولات چرم طبیعی. ${categoryNames.join(
    ', '
  )} ${
    avgRating ? `امتیاز ${avgRating}/5 بوسیله ${reviews?.length} خریدار.` : ''
  } ارسال سریع، کیفیت بالای محصولات و تضمین استفاده از چرم طبیعی.`

  return {
    title: 'کارگاه چرم سارینا',
    description,
    keywords: [
      ...categoryNames?.map((name) => name.toLowerCase()),
      'چرم طبیعی',
      'کیف چرم طبیعی زنانه',
      'کیف چرمی زنانه',
      'چرم طبیعی تضمین شده',
      'فروشگاه آنلاین',
      'کارگاه چرم دست‌دوز',
      'فروشگاه چرم',
    ].join(', '),

    // Open Graph for social sharing
    openGraph: {
      type: 'website',
      title: 'کارگاه چرم سارینا ',
      description,
      url: process.env.NEXT_PUBLIC_SITE_URL,
      siteName: 'کارگاه چرم سارینا',
      images: [
        {
          url: '/hero-image.webp', // Your home page OG image
          width: 1200,
          height: 630,
          alt: 'کارگاه چرم سارینا ',
        },
      ],
      locale: 'en_US',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: 'کارگاه چرم سارینا ',
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
      // bing: process.env.BING_SITE_VERIFICATION,
    },

    // Additional tags
    other: {
      'theme-color': '#eceae8', // Your brand color
      'mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'msapplication-TileColor': '#eceae8',
    },
  }
}
export default async function Home() {
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
    name: 'کارگاه چرم سارینا',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`,
    description:
      'Premium online store offering quality products with fast shipping and excellent customer service',
    contactPoint: {
      '@type': 'ContactPoint',
      // telephone: '+1-555-123-4567', // Your phone number
      // contactType: 'Customer Service',
      // email: 'support@yourstore.com', // Your email
      availableLanguage: ['English', 'Persian'],
    },
    sameAs: [
      'https://facebook.com/yourstore', // Your social media links
      'https://instagram.com/yourstore',
      'https://twitter.com/yourstore',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Iran', // Your country
      addressLocality: 'Dezful',
      addressRegion: 'Khozestan',
      // postalCode: '12345',
      // streetAddress: 'Your Address',
    },
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'کارگاه چرم سارینا',
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
          name: 'کارگاه چرم سارینا',
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
          name: 'پرفروش‌ترینها',
          description: 'Our most popular products',
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
          name: 'New Arrivals',
          description: 'Latest products in our collection',
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
        name: 'خانه',
        item: process.env.NEXT_PUBLIC_SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'محصولات',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/products`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'درباره ما',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/about-us`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'ارتباط با ما',
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
