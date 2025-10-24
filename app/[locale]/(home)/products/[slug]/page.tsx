import {
  getProductDetails,
  getRelatedProducts,
} from '@/lib/home/queries/products'
import { notFound } from 'next/navigation'
import React from 'react'
import ProductPage from '../components/ProductPage'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Metadata } from 'next'
import { STORE_NAME, TWITTER_HANDLE } from '@/constants/store'
import { getIsWhishedByUser } from '@/lib/home/queries/user'
import {
  createMetaDescription,
  generateProductKeywords,
  stripHtmlTags,
  truncateText,
} from '@/lib/metadata-utils'

interface ProductDetailsPageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    sizeId: string
    page: string
  }>
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const slug = (await params).slug
  const product = await getProductDetails(slug)

  if (!product) {
    return {
      title: 'محصول پیدا نشد!',
      description: 'محصول مورد نظر شما پیدا نشد.',
      robots: 'noindex, nofollow',
    }
  }

  const productAverageRating = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: true,
    where: { productId: product.id, isPending: false },
  })

  const avgRating = productAverageRating._avg.rating
  const reviewCount = productAverageRating._count || 0

  // Build dynamic title and description
  const brandName = product.brand || 'ویژه'
  // const categoryName = product.subCategory?.name || 'محصولات'
  const title = `${product.name} - ${brandName} | ${STORE_NAME}`

  // Count available variants
  const availableVariants =
    product.variants?.filter((v) => v.quantity > 0).length || 0

  // Create optimized meta description
  const cleanDescription = createMetaDescription({
    productName: product.name,
    brandName,
    description: product.description,
    avgRating,
    reviewCount,
    availableVariants,
    maxLength: 155,
  })

  // Generate keywords
  const keywords = generateProductKeywords(product)

  // Check availability and pricing
  const inStock =
    product.variants?.some((variant) => variant.quantity > 0) || false
  const lowestPrice = product.variants?.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants?.[0]?.price || 0
  )

  // Create clean descriptions for different platforms
  const ogDescription = product.description
    ? truncateText(stripHtmlTags(product.description), 200)
    : cleanDescription

  const twitterDescription = truncateText(ogDescription, 140)

  return {
    title,
    description: cleanDescription,
    keywords: keywords.join(', '),

    // Open Graph metadata for social sharing
    openGraph: {
      type: 'website',
      title: `${product.name} - ${brandName}`,
      description: ogDescription,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`,
      siteName: STORE_NAME,
      images:
        product.images?.map((img) => ({
          url: img.url,
          width: 800,
          height: 800,
          alt: `${product.name} - تصویر محصول`,
        })) || [],
      locale: 'fa_IR',
    },

    // Twitter Card metadata
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${brandName}`,
      description: twitterDescription,
      images: product.images?.map((img) => img.url) || [],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },

    // Product-specific metadata
    other: {
      'product:brand': brandName,
      'product:availability': inStock ? 'موجود' : 'ناموجود',
      'product:condition': 'new',
      'product:price:amount': lowestPrice?.toString() || '0',
      'product:price:currency': 'USD',
      'product:retailer_item_id': product.id,
      ...(avgRating && {
        'product:rating:value': avgRating.toFixed(1),
        'product:rating:scale': '5',
        'product:rating:count': reviewCount.toString(),
      }),
    },

    // SEO robots
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`,
    },

    // Verification tags
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
    },
  }
}

const ProductDetailsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{
    size?: string
    color?: string
    page?: string
  }>
}) => {
  const slug = (await params).slug
  const searchParamsSize = (await searchParams).size
  const searchParamsColor = (await searchParams).color

  const product = await getProductDetails(slug)
  if (!product || product.variants.length === 0) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.subCategoryId
  )

  const urlMatchVariant = product.variants.find(
    (v) => v.size?.id === searchParamsSize && v.color?.id === searchParamsColor
  )
  const firstInStockVariant = product.variants.find((v) => v.quantity > 0)
  const absoluteDefaultVariant = product.variants[0]
  const selectedVariant =
    urlMatchVariant || firstInStockVariant || absoluteDefaultVariant

  const user = await currentUser()
  const isInWishList = await getIsWhishedByUser(product.id, user?.id)
  const userReview = await prisma.review.findFirst({
    where: {
      productId: product.id,
      userId: user?.id,
    },
  })

  const productAverageRating = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: true,
    where: { productId: product.id, isPending: false },
  })

  const avgRating = productAverageRating._avg.rating
  const reviewCount = productAverageRating._count || 0

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description
      ? stripHtmlTags(product.description)
      : `محصول با کیفیت ${product.name} از ${product.brand || 'برند ما'}`,
    image: product.images?.map((img) => img.url) || [],
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'برند ویژه',
    },
    category: product.category?.name,
    offers:
      product.variants?.map((variant) => ({
        '@type': 'Offer',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}?size=${variant.size?.id}&color=${variant.color?.id}`,
        priceCurrency: 'USD',
        price: variant.price,
        availability:
          variant.quantity > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        seller: {
          '@type': 'Organization',
          name: STORE_NAME,
          url: process.env.NEXT_PUBLIC_SITE_URL,
        },
      })) || [],
    ...(avgRating &&
      reviewCount > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: avgRating.toFixed(1),
          reviewCount: reviewCount,
          bestRating: 5,
          worstRating: 1,
        },
      }),
    ...(product.reviews &&
      product.reviews.length > 0 && {
        review: product.reviews.slice(0, 5).map((review) => ({
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: 5,
            worstRating: 1,
          },
          author: {
            '@type': 'Person',
            name: review.user?.name || 'خریدار محترم',
          },
          reviewBody: review.description
            ? stripHtmlTags(review.description)
            : '',
          datePublished: review.createdAt.toISOString(),
        })),
      }),
    ...(product.variants &&
      product.variants.length > 0 && {
        hasVariant: product.variants.map((variant) => ({
          '@type': 'ProductModel',
          name: `${product.name} - ${variant.size?.name || 'سایز استاندارد'}`,
          sku: `${product.sku || product.id}-${variant.size?.id || 'default'}`,
          offers: {
            '@type': 'Offer',
            price: variant.price,
            priceCurrency: 'USD',
            availability:
              variant.quantity > 0
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
          },
        })),
      }),
    additionalProperty: [
      ...(product.variants
        ?.filter((variant) => variant.color?.name)
        .map((variant) => ({
          '@type': 'PropertyValue',
          name: 'رنگ',
          value: variant.color!.name,
        })) || []),
      ...(product.variants
        ?.filter((variant) => variant.size?.name)
        .map((variant) => ({
          '@type': 'PropertyValue',
          name: 'سایز',
          value: variant.size!.name,
        })) || []),
    ],
  }

  // Breadcrumb structured data
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
        name: product.category?.name || 'دسته‌بندی',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/categories/${product.subCategory?.url}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.subCategory?.name || 'زیردسته',
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/subcategories/${product.subCategory?.url}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: product.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${slug}`,
      },
    ],
  }

  return (
    <div>
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
      <ProductPage
        data={product}
        selectedSizeId={selectedVariant.size?.id ?? ''}
        selectedColorId={selectedVariant.color?.id ?? ''}
        productAverageRating={
          productAverageRating._avg.rating && productAverageRating._count
            ? {
                rating: productAverageRating._avg.rating,
                count: productAverageRating._count,
              }
            : null
        }
        reviews={product.reviews}
        userId={user?.id ?? null}
        userReview={userReview}
        relatedProducts={relatedProducts}
        isInWishList={!!isInWishList}
      />
    </div>
  )
}

export default ProductDetailsPage
