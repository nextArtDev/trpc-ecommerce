// app/[locale]/products/[slug]/page.tsx

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
import {
  createMetaDescription,
  generateProductKeywords,
  stripHtmlTags,
  truncateText,
} from '@/lib/metadata-utils'
import { getTranslations, getLocale } from 'next-intl/server'
import {
  transformProduct,
  transformSpecs,
  transformQuestions,
} from '@/lib/types/home'
import { getTranslation, getTranslationField } from '@/lib/translation-utils'
import { getIsWhishedByUser } from '@/lib/home/queries/user'

interface ProductDetailsPageProps {
  params: Promise<{ slug: string; locale: string }>
  searchParams: Promise<{
    sizeId: string
    page: string
  }>
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProductDetails(slug)
  const t = await getTranslations('product')
  const tHome = await getTranslations('home')

  if (!product) {
    return {
      title: t('notFound.title'),
      description: t('notFound.description'),
      robots: 'noindex, nofollow',
    }
  }
  // Transform product with translations
  const displayProduct = transformProduct(product)

  const productAverageRating = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: true,
    where: { productId: product.id, isPending: false },
  })

  const avgRating = productAverageRating._avg.rating
  const reviewCount = productAverageRating._count || 0

  const brandName = product.brand || t('specialBrand')
  const title = `${displayProduct.name} - ${brandName} | ${STORE_NAME}`

  const availableVariants =
    product.variants?.filter((v) => v.quantity > 0).length || 0

  const cleanDescription = createMetaDescription({
    productName: displayProduct.name,
    brandName,
    description: displayProduct.description,
    avgRating,
    reviewCount,
    availableVariants,
    maxLength: 155,
  })

  const keywords = generateProductKeywords({
    ...product,
    name: displayProduct.name,
    description: displayProduct.description,
    keywords: displayProduct.keywords || '',
  })

  const inStock =
    product.variants?.some((variant) => variant.quantity > 0) || false
  const lowestPrice = product.variants?.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants?.[0]?.price || 0
  )

  const ogDescription = displayProduct.description
    ? truncateText(stripHtmlTags(displayProduct.description), 200)
    : cleanDescription

  const twitterDescription = truncateText(ogDescription, 140)

  return {
    title,
    description: cleanDescription,
    keywords: keywords.join(', '),

    openGraph: {
      type: 'website',
      title: `${displayProduct.name} - ${brandName}`,
      description: ogDescription,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${slug}`,
      siteName: STORE_NAME,
      images:
        product.images?.map((img) => ({
          url: img.url,
          width: 800,
          height: 800,
          alt: `${displayProduct.name} - ${t('productImage')}`,
        })) || [],
      locale: locale === 'fa' ? 'fa_IR' : 'en_US',
    },

    twitter: {
      card: 'summary_large_image',
      title: `${displayProduct.name} - ${brandName}`,
      description: twitterDescription,
      images: product.images?.map((img) => img.url) || [],
      creator: TWITTER_HANDLE,
      site: TWITTER_HANDLE,
    },

    other: {
      'product:brand': brandName,
      'product:availability': inStock ? t('inStock') : t('outOfStock'),
      'product:condition': 'new',
      'product:price:amount': lowestPrice?.toString() || '0',
      'product:price:currency': 'IRR',
      'product:retailer_item_id': product.id,
      ...(avgRating && {
        'product:rating:value': avgRating.toFixed(1),
        'product:rating:scale': '5',
        'product:rating:count': reviewCount.toString(),
      }),
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${slug}`,
      languages: {
        fa: `${process.env.NEXT_PUBLIC_SITE_URL}/fa/products/${slug}`,
        en: `${process.env.NEXT_PUBLIC_SITE_URL}/en/products/${slug}`,
        de: `${process.env.NEXT_PUBLIC_SITE_URL}/de/products/${slug}`,
        fr: `${process.env.NEXT_PUBLIC_SITE_URL}/fr/products/${slug}`,
        it: `${process.env.NEXT_PUBLIC_SITE_URL}/it/products/${slug}`,
      },
    },

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
  params: Promise<{ slug: string; locale: string }>
  searchParams: Promise<{
    size?: string
    color?: string
    page?: string
  }>
}) => {
  const { slug, locale } = await params
  const searchParamsSize = (await searchParams).size
  const searchParamsColor = (await searchParams).color
  const t = await getTranslations('product')
  const tHome = await getTranslations('home')

  const product = await getProductDetails(slug)
  if (!product || product.variants.length === 0) {
    notFound()
  }

  // Transform product data using our utility functions
  const displayProduct = transformProduct(product)
  const displaySpecs = transformSpecs(product.specs)
  const displayQuestions = transformQuestions(product.questions)

  // Use our translation utility for category, subcategory, and offer tag
  const displayCategory = {
    ...product.category,
    name: getTranslationField(product.category.translations, locale, 'name'),
  }

  const displaySubCategory = {
    ...product.subCategory,
    name: getTranslationField(product.subCategory.translations, locale, 'name'),
  }

  const displayOfferTag = product.offerTag
    ? {
        ...product.offerTag,
        name: getTranslationField(
          product.offerTag.translations,
          locale,
          'name'
        ),
      }
    : null

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.subCategoryId
  )

  // Transform related products using our utility function
  const displayRelatedProducts = relatedProducts?.map((rp) => ({
    ...rp,
    name: getTranslation(rp.translations, 'name'),
    description: getTranslationField(rp.translations, 'description'),
  }))

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

  // Structured data with translated content
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayProduct.name,
    description: displayProduct.description
      ? stripHtmlTags(displayProduct.description)
      : `${t('qualityProduct')} ${displayProduct.name} ${t('from')} ${
          product.brand || t('specialBrand')
        }`,
    image: product.images?.map((img) => img.url) || [],
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${slug}`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || t('specialBrand'),
    },
    category: displayCategory.name,
    offers:
      product.variants?.map((variant) => ({
        '@type': 'Offer',
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${slug}?size=${variant.size?.id}&color=${variant.color?.id}`,
        priceCurrency: 'IRR',
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
            name: review.user?.name || t('customer'),
          },
          reviewBody: review.description
            ? stripHtmlTags(review.description)
            : '',
          datePublished: review.createdAt.toISOString(),
        })),
      }),
  }

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
        name: displayCategory.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/categories/${displayCategory.url}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: displaySubCategory.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/subcategories/${displaySubCategory.url}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: displayProduct.name,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${slug}`,
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
        data={{
          ...product,
          name: displayProduct.name,
          description: displayProduct.description,
          keywords: displayProduct.keywords || '',
          category: displayCategory,
          subCategory: displaySubCategory,
          offerTag: displayOfferTag,
          specs: displaySpecs,
          questions: displayQuestions,
        }}
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
        relatedProducts={displayRelatedProducts}
        isInWishList={!!isInWishList}
      />
    </div>
  )
}

export default ProductDetailsPage
