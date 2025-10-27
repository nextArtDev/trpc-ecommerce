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

/**
 * Creates an optimized meta description from rich text content
 */
export function createMetaDescription({
  productName,
  brandName,
  description,
  avgRating,
  reviewCount,
  availableVariants,
  maxLength = 155,
  locale = 'en',
  translations,
}: {
  productName: string
  brandName: string
  description: string | null | undefined
  avgRating?: number | null
  reviewCount?: number
  availableVariants?: number
  maxLength?: number
  locale?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations?: any
}): string {
  // Get translations if not provided
  const t = translations || {
    buy: locale === 'fa' ? 'خرید' : 'Buy',
    from: locale === 'fa' ? 'از' : 'from',
    rating: locale === 'fa' ? 'امتیاز' : 'Rating',
    fromCustomers: locale === 'fa' ? 'از خریدار' : 'from customers',
    availableIn: locale === 'fa' ? 'موجود در' : 'Available in',
    models: locale === 'fa' ? 'مدل' : 'models',
    fastShipping:
      locale === 'fa'
        ? 'ارسال سریع به تمام نقاط کشور'
        : 'Fast shipping nationwide',
  }

  let cleanDescription = ''

  if (description) {
    // Strip HTML tags and clean the description
    const strippedDescription = stripHtmlTags(description)

    // Create a more SEO-friendly description
    cleanDescription = `${t.buy} ${productName} ${t.from} ${brandName}. ${strippedDescription}`

    // Add rating info if available
    if (reviewCount && reviewCount > 0 && avgRating) {
      cleanDescription += ` | ${t.rating} ${avgRating.toFixed(1)}/5 ${
        t.fromCustomers
      } ${reviewCount}`
    }

    // Add availability info
    if (availableVariants && availableVariants > 0) {
      cleanDescription += ` | ${t.availableIn} ${availableVariants} ${t.models}`
    }

    cleanDescription += ` | ${t.fastShipping}`

    // Truncate to optimal length
    cleanDescription = truncateText(cleanDescription, maxLength)
  } else {
    // Fallback description if no product description exists
    cleanDescription = `${t.buy} ${productName} ${t.from} ${brandName}.${
      reviewCount && reviewCount > 0 && avgRating
        ? ` ${t.rating} ${avgRating.toFixed(1)}/5 ${
            t.fromCustomers
          } ${reviewCount}.`
        : ''
    } ${
      availableVariants
        ? `${t.availableIn} ${availableVariants} ${t.models}.`
        : ''
    } ${t.fastShipping}.`

    cleanDescription = truncateText(cleanDescription, maxLength)
  }

  return cleanDescription
}
/**
 * Generates SEO-friendly keywords from product data
 */
export function generateProductKeywords(
  product: {
    name: string
    brand?: string | null
    subCategory?: { name: string } | null
    variants?: Array<{
      color?: { name: string } | null
      size?: { name: string } | null
    }>
  },
  locale = 'en',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  translations?: any
): string[] {
  // Get translations if not provided
  const t = translations || {
    onlineShopping: locale === 'fa' ? 'خرید آنلاین' : 'Online shopping',
    store: locale === 'fa' ? 'فروشگاه' : 'Store',
    bestQuality: locale === 'fa' ? 'بهترین کیفیت' : 'Best quality',
    fastShipping: locale === 'fa' ? 'ارسال سریع' : 'Fast shipping',
  }

  const keywords: string[] = [
    product.name.toLowerCase(),
    ...(product.brand ? [product.brand.toLowerCase()] : []),
    ...(product.subCategory?.name
      ? [product.subCategory.name.toLowerCase()]
      : []),
  ]

  // Add color variations
  if (product.variants) {
    const colors = product.variants
      .map((v) => v.color?.name)
      .filter(Boolean)
      .map((color) => color!.toLowerCase())
    keywords.push(...new Set(colors)) // Remove duplicates

    // Add size variations
    const sizes = product.variants
      .map((v) => v.size?.name)
      .filter(Boolean)
      .map((size) => size!.toLowerCase())
    keywords.push(...new Set(sizes)) // Remove duplicates
  }

  // Add common e-commerce keywords
  keywords.push(
    t.onlineShopping.toLowerCase(),
    t.store.toLowerCase(),
    t.bestQuality.toLowerCase(),
    t.fastShipping.toLowerCase()
  )

  return [...new Set(keywords)] // Remove any remaining duplicates
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
