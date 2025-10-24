import { notFound } from 'next/navigation'
import React from 'react'
import { getSubCategoryBySlug } from '@/lib/home/queries/products'
import { Bounded } from '@/components/shared/Bounded'
import { FadeIn } from '@/components/shared/fade-in'
import Image from 'next/image'
import { RevealText } from '@/components/shared/reveal-text'
// import Link from 'next/link'
import ProductGrid from '../../search/components/ProductGrid'
import { Metadata } from 'next'

interface SubcategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: SubcategoryPageProps): Promise<Metadata> {
  const slug = (await params).slug
  const subcategory = await getSubCategoryBySlug({ slug })

  if (!subcategory) {
    return {
      title: 'زیردسته مورد نظر پیدا نشد!',
      description: 'زیردسته مورد نظر یافت نمی‌شود.',
      robots: 'noindex, nofollow',
    }
  }

  // const productCount = subcategory.products?.length || 0
  const categoryName = subcategory.category?.name || 'Products'
  const subcategoryName = subcategory.name
  // const description = subcategory.description ||
  //   `Discover our premium collection of ${subcategoryName.toLowerCase()} in the ${categoryName.toLowerCase()} category. Shop ${productCount} carefully curated products with fast shipping and excellent customer service.`

  return {
    title: `${subcategoryName} - ${categoryName} `,
    // description,
    keywords: [
      subcategoryName.toLowerCase(),
      categoryName.toLowerCase(),
      'shop',
      'buy online',
      'premium quality',
      'fast shipping',
    ].join(', '),

    // Open Graph metadata for social sharing
    openGraph: {
      type: 'website',
      // title: `${subcategoryName} - Premium ${categoryName}`,
      title: `${subcategoryName} `,
      // description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/sub-categories/${slug}`,
      siteName: ' ',
      images: [
        {
          url: subcategory.images?.[0]?.url || '/default-og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${subcategoryName} collection`,
        },
      ],
      locale: 'fa-IR',
    },

    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      // title: `${subcategoryName} - Premium ${categoryName}`,
      title: `${subcategoryName} `,
      // description,
      images: [subcategory.images?.[0]?.url || '/default-twitter-image.jpg'],
      // creator: '@yourstorehandle',
      // site: '@yourstorehandle',
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/sub-categories/${slug}`,
    },

    // Additional meta tags
    // other: {
    //   'product-category': categoryName,
    //   'product-subcategory': subcategoryName,
    //   'product-count': productCount.toString(),
    // },

    // Structured data
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      // bing: process.env.BING_SITE_VERIFICATION,
    },

    // Add structured data as JSON-LD
    // ...(structuredData && {
    //   other: {
    //     ...((return metadata)?.other || {}),
    //     'structured-data': JSON.stringify(structuredData),
    //   }
    // })
  }
}

const SubcategoryDetailsPage = async ({ params }: SubcategoryPageProps) => {
  // const page = Number((await searchParams).page) || 1
  // const pageSize = 4

  const slug = (await params).slug

  const subcategory = await getSubCategoryBySlug({ slug })
  if (!subcategory) notFound()
  // Structured data JSON-LD for client-side rendering
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: subcategory.name,
    // description:
    //   subcategory.description ||
    //   `Shop premium ${subcategory.name.toLowerCase()} products`,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/sub-categories/${slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: subcategory.products?.length || 0,
      itemListElement:
        subcategory.products?.slice(0, 10).map((product, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Product',
            name: product.name,
            // description: product.description,
            image: product.images?.[0]?.url,
            url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.slug}`,
            ...(product?.variants?.map((vr) => vr.price) && {
              offers: {
                '@type': 'Offer',
                price: product?.variants?.map((vr) => vr.price),
                priceCurrency: 'IRI',
                availability:
                  product.variants?.[0].quantity > 0
                    ? 'https://schema.org/InStock'
                    : 'https://schema.org/OutOfStock',
              },
            }),
          },
        })) || [],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: subcategory.category?.name || 'Category',
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${subcategory.category?.url}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: subcategory.name,
          item: `${process.env.NEXT_PUBLIC_SITE_URL}/sub-categories/${slug}`,
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
        <Bounded
          className={`relative w-full h-full  overflow-hidden bg-neutral-950 `}
        >
          <FadeIn
            vars={{ scale: 1, opacity: 0.5 }}
            className=" absolute inset-0 pt-12 max-h-svh origin-top lg:h-screen motion-safe:scale-125 motion-reduce:opacity-50 "
          >
            <Image
              unoptimized
              src={
                subcategory.images.map((s) => s.url)[0] ||
                '/images/fallback-image.webp'
              }
              priority
              fetchPriority="high"
              alt="hero image"
              fill
              className="object-cover origin-top "
            />
          </FadeIn>
          <div className="relative flex h-screen flex-col justify-center">
            <RevealText
              text={subcategory.name}
              id="hero-heading"
              className="font-display max-w-xl text-6xl leading-none text-neutral-50 md:text-7xl lg:text-8xl"
              staggerAmount={0.2}
              duration={1.7}
            />
            {/* {subcategory.description&&  <FadeIn 
            className="mt-6 max-w-md translate-y-8  text-lg text-neutral-100"
            vars={{ delay: 1, duration: 1.3 }}
            >
            <p className=" ">
            {subcategory.description}
            </p>
            </FadeIn>} */}

            {/* <FadeIn
              className="mt-8 translate-y-5"
              vars={{ delay: 1.7, duration: 1.1 }}
            >
              <Link
                href={`/categories/${subcategory.category.url}`}
                className=" w-fit inline-flex items-center justify-center px-12 py-4 text-center font-extrabold tracking-wider uppercase transition-colors duration-300  border border-white text-white hover:bg-white/20"
              >
                {subcategory.category.name}
              </Link>
            </FadeIn> */}
          </div>
        </Bounded>
        <div className="flex-1 w-full h-full">
          <ProductGrid products={subcategory.products} isInSearchPage={false} />
        </div>
      </div>
    </>
  )
}

export default SubcategoryDetailsPage
