/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/utils/metadata.ts

/**
 * Strips HTML tags and decodes common HTML entities
 */
export function stripHtmlTags(html: string | null | undefined): string {
  if (!html) return ''

  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with regular space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&#39;/g, "'") // Replace &#39; with '
    .replace(/&apos;/g, "'") // Replace &apos; with '
    .replace(/&hellip;/g, '...') // Replace &hellip; with ...
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim() // Remove leading/trailing whitespace
}

/**
 * Truncates text to specified length while keeping words intact
 */
export function truncateText(
  text: string | null | undefined,
  maxLength: number = 160
): string {
  if (!text || text.length <= maxLength) return text || ''

  const truncated = text.substring(0, maxLength)
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  // If we found a space and it's not too close to the beginning, cut there
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex) + '...'
  }

  return truncated + '...'
}

export function createMetaDescription({
  productName,
  brandName,
  description,
  avgRating,
  reviewCount,
  availableVariants,
  maxLength = 155,
  t,
}: {
  productName: string
  brandName: string
  description: string | null | undefined
  avgRating?: number | null
  reviewCount?: number
  availableVariants?: number
  maxLength?: number
  t?: any
}): string {
  let cleanDescription = ''

  if (description) {
    const strippedDescription = stripHtmlTags(description)

    if (t) {
      cleanDescription =
        t('metaDescription.buy', {
          productName,
          brandName,
        }) +
        '. ' +
        strippedDescription

      if (reviewCount && reviewCount > 0 && avgRating) {
        cleanDescription +=
          ' | ' +
          t('metaDescription.rating', {
            rating: avgRating.toFixed(1),
            count: reviewCount,
          })
      }

      if (availableVariants && availableVariants > 0) {
        cleanDescription +=
          ' | ' +
          t('metaDescription.variants', {
            count: availableVariants,
          })
      }

      cleanDescription += ' | ' + t('metaDescription.shipping')
    } else {
      cleanDescription = `خرید ${productName} از ${brandName}. ${strippedDescription}`

      if (reviewCount && reviewCount > 0 && avgRating) {
        cleanDescription += ` | امتیاز ${avgRating.toFixed(
          1
        )}/5 از ${reviewCount} خریدار`
      }

      if (availableVariants && availableVariants > 0) {
        cleanDescription += ` | موجود در ${availableVariants} مدل`
      }

      cleanDescription += ' | ارسال سریع به تمام نقاط کشور'
    }

    cleanDescription = truncateText(cleanDescription, maxLength)
  } else {
    if (t) {
      cleanDescription =
        t('metaDescription.buy', { productName, brandName }) + '.'

      if (reviewCount && reviewCount > 0 && avgRating) {
        cleanDescription +=
          ' ' +
          t('metaDescription.rating', {
            rating: avgRating.toFixed(1),
            count: reviewCount,
          }) +
          '.'
      }

      if (availableVariants) {
        cleanDescription +=
          ' ' +
          t('metaDescription.variants', {
            count: availableVariants,
          }) +
          '.'
      }

      cleanDescription += ' ' + t('metaDescription.shipping') + '.'
    } else {
      cleanDescription = `خرید ${productName} از ${brandName}.`

      if (reviewCount && reviewCount > 0 && avgRating) {
        cleanDescription += ` امتیاز ${avgRating.toFixed(
          1
        )}/5 از ${reviewCount} خریدار.`
      }

      if (availableVariants) {
        cleanDescription += ` موجود در ${availableVariants} مدل.`
      }

      cleanDescription += ' ارسال سریع به تمام نقاط کشور.'
    }

    cleanDescription = truncateText(cleanDescription, maxLength)
  }

  return cleanDescription
}

/**
 * Generates SEO-friendly keywords from product data
 */
export function generateProductKeywords(product: {
  name: string
  description?: string
  keywords?: string
  brand?: string | null
  subCategory?: { name: string } | null
  variants?: Array<{
    color?: { name: string } | null
    size?: { name: string } | null
  }>
}): string[] {
  const keywords: string[] = [
    product.name.toLowerCase(),
    ...(product.brand ? [product.brand.toLowerCase()] : []),
    ...(product.subCategory?.name
      ? [product.subCategory.name.toLowerCase()]
      : []),
  ]

  // Add custom keywords if provided
  if (product.keywords) {
    const customKeywords = product.keywords
      .split(',')
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean)
    keywords.push(...customKeywords)
  }

  // Extract keywords from description
  if (product.description) {
    const descWords = stripHtmlTags(product.description)
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3) // Only words longer than 3 chars
      .slice(0, 5) // Take first 5 words
    keywords.push(...descWords)
  }

  // Add color variations
  if (product.variants) {
    const colors = product.variants
      .map((v) => v.color?.name)
      .filter(Boolean)
      .map((color) => color!.toLowerCase())
    keywords.push(...new Set(colors))

    // Add size variations
    const sizes = product.variants
      .map((v) => v.size?.name)
      .filter(Boolean)
      .map((size) => size!.toLowerCase())
    keywords.push(...new Set(sizes))
  }

  return [...new Set(keywords)] // Remove duplicates
}

/**
 * Type definitions for better type safety
 */
export interface ProductForMetadata {
  id: string
  name: string
  description?: string | null
  brand?: string | null
  sku?: string | null
  category?: { name: string } | null
  subCategory?: {
    name: string
    url: string
  } | null
  variants?: Array<{
    id: string
    price: number
    quantity: number
    size?: { id: string; name: string } | null
    color?: { id: string; name: string } | null
  }>
  images?: Array<{ url: string }>
  reviews?: Array<{
    id: string
    rating: number
    description?: string | null
    createdAt: Date
    user?: { name: string } | null
  }>
}

export interface ProductRating {
  rating: number
  count: number
}
