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
import { getIsWhishedByUser } from '@/lib/home/queries/user'
import { getName, getProductTranslation } from '@/lib/translation-utils'

interface ProductDetailsPageProps {
  params: Promise<{ slug: string; locale: string }>
  searchParams: Promise<{
    size?: string
    color?: string
    page?: string
  }>
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug, locale } = await params
  const product = await getProductDetails(slug)
  const t = await getTranslations('product')

  if (!product) {
    return {
      title: t('notFound.title'),
      description: t('notFound.description'),
      robots: 'noindex, nofollow',
    }
  }

  // Get translated fields
  const productTranslation = getProductTranslation(product.translations)
  const productName = productTranslation.name
  const productDescription = productTranslation.description

  const productAverageRating = await prisma.review.aggregate({
    _avg: { rating: true },
    _count: true,
    where: { productId: product.id, isPending: false },
  })

  const avgRating = productAverageRating._avg.rating
  const reviewCount = productAverageRating._count || 0

  const brandName = product.brand || t('specialBrand')
  const title = `${productName} - ${brandName} | ${STORE_NAME}`

  const availableVariants =
    product.variants?.filter((v) => v.quantity > 0).length || 0

  const cleanDescription = createMetaDescription({
    productName,
    brandName,
    description: productDescription,
    avgRating,
    reviewCount,
    availableVariants,
    maxLength: 155,
  })

  const categoryName = getName(product.category.translations)
  const subCategoryName = getName(product.subCategory.translations)

  const keywords = generateProductKeywords({
    name: productName,
    keywords: productTranslation.keywords || '',
    brand: product.brand,
    subCategory: { name: subCategoryName },
    variants: product.variants?.map((v) => ({
      color: v.color ? { name: v.color.name } : null,
      size: v.size ? { name: v.size.name } : null,
    })),
  })

  const inStock =
    product.variants?.some((variant) => variant.quantity > 0) || false
  const lowestPrice = product.variants?.reduce(
    (min, variant) => (variant.price < min ? variant.price : min),
    product.variants?.[0]?.price || 0
  )

  const ogDescription = productDescription
    ? truncateText(stripHtmlTags(productDescription), 200)
    : cleanDescription

  const twitterDescription = truncateText(ogDescription, 140)

  return {
    title,
    description: cleanDescription,
    keywords: keywords.join(', '),

    openGraph: {
      type: 'website',
      title: `${productName} - ${brandName}`,
      description: ogDescription,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${slug}`,
      siteName: STORE_NAME,
      images:
        product.images?.map((img) => ({
          url: img.url,
          width: 800,
          height: 800,
          alt: `${productName} - ${t('productImage')}`,
        })) || [],
      locale: locale === 'fa' ? 'fa_IR' : locale === 'en' ? 'en_US' : locale,
    },

    twitter: {
      card: 'summary_large_image',
      title: `${productName} - ${brandName}`,
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
}: ProductDetailsPageProps) => {
  const { slug, locale } = await params
  const { size: searchParamsSize, color: searchParamsColor } =
    await searchParams
  const t = await getTranslations('product')
  const tHome = await getTranslations('home')

  const product = await getProductDetails(slug)
  if (!product || product.variants.length === 0) {
    notFound()
  }

  // Extract translations from the product
  const productTranslation = getProductTranslation(product.translations)
  const categoryName = getName(product.category.translations)
  const subCategoryName = getName(product.subCategory.translations)
  const offerTagName = product.offerTag
    ? getName(product.offerTag.translations)
    : null

  // Transform specs and questions
  const displaySpecs = product.specs.map((spec) => ({
    name: getName(spec.translations),
    value: spec.translations[0]?.value || '',
  }))

  const displayQuestions = product.questions.map((q) => ({
    question: q.translations[0]?.question || '',
    answer: q.translations[0]?.answer || '',
  }))

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.subCategoryId
  )

  // Transform related products
  const displayRelatedProducts = relatedProducts?.map((rp) => {
    const rpName = getName(rp.translations)
    const rpDesc = rp.translations[0]?.description || ''
    return {
      ...rp,
      name: rpName,
      description: rpDesc,
    }
  })

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
    name: productTranslation.name,
    description: productTranslation.description
      ? stripHtmlTags(productTranslation.description)
      : `${t('qualityProduct')} ${productTranslation.name} ${t('from')} ${
          product.brand || t('specialBrand')
        }`,
    image: product.images?.map((img) => img.url) || [],
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/products/${slug}`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || t('specialBrand'),
    },
    category: categoryName,
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
        name: categoryName,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/categories/${product.category.url}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: subCategoryName,
        item: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/subcategories/${product.subCategory.url}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: productTranslation.name,
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
          name: productTranslation.name,
          description: productTranslation.description,
          keywords: productTranslation.keywords || '',
          category: {
            id: product.category.id,
            url: product.category.url,
            translations: [{ name: categoryName }],
          },
          subCategory: {
            id: product.subCategory.id,
            url: product.subCategory.url,
            translations: [{ name: subCategoryName }],
          },
          offerTag: product.offerTag
            ? {
                url: product.offerTag.url,
                translations: [{ name: offerTagName! }],
              }
            : null,
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
