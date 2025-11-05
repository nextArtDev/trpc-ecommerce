// app/sitemap.ts
import {
  getCategoriesWithStats,
  getHomepageProducts,
  getSubCategories,
} from '@/lib/home/queries/products'
import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://'

  try {
    const [products, categories, subCategories] = await Promise.all([
      getHomepageProducts(),
      getCategoriesWithStats(),
      getSubCategories(),
    ])

    // Get all supported locales
    const locales = routing.locales

    // Create entries for each locale
    const allEntries: MetadataRoute.Sitemap = []

    // Add homepage for each locale
    locales.forEach((locale) => {
      allEntries.push({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      })
    })

    // Add static pages for each locale
    const staticPages = [
      { path: 'about-us', priority: 0.8, changeFrequency: 'monthly' as const },
      {
        path: 'contact-us',
        priority: 0.8,
        changeFrequency: 'monthly' as const,
      },
      { path: 'faq', priority: 0.7, changeFrequency: 'weekly' as const },
      { path: 'products', priority: 0.9, changeFrequency: 'daily' as const },
      {
        path: 'sub-categories',
        priority: 0.8,
        changeFrequency: 'daily' as const,
      },
      { path: 'categories', priority: 0.7, changeFrequency: 'daily' as const },
      { path: 'sign-in', priority: 0.5, changeFrequency: 'monthly' as const },
      { path: 'cart', priority: 0.6, changeFrequency: 'daily' as const },
    ]

    locales.forEach((locale) => {
      staticPages.forEach((page) => {
        allEntries.push({
          url: `${baseUrl}/${locale}/${page.path}`,
          lastModified: new Date(),
          changeFrequency: page.changeFrequency,
          priority: page.priority,
        })
      })
    })

    // Add product pages for each locale
    if (products?.length) {
      products.forEach((product) => {
        locales.forEach((locale) => {
          allEntries.push({
            url: `${baseUrl}/${locale}/products/${product.slug}`,
            lastModified: new Date(product.updatedAt),
            changeFrequency: 'daily' as const,
            priority: 0.8,
          })
        })
      })
    }

    // Add category pages for each locale
    if (categories?.length) {
      categories.forEach((category) => {
        locales.forEach((locale) => {
          allEntries.push({
            url: `${baseUrl}/${locale}/categories/${category.url}`,
            lastModified: new Date(category.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
          })
        })
      })
    }

    // Add subcategory pages for each locale
    if (subCategories?.length) {
      subCategories.forEach((sub) => {
        locales.forEach((locale) => {
          allEntries.push({
            url: `${baseUrl}/${locale}/sub-categories/${sub.id}`,
            lastModified: new Date(sub.updatedAt),
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          })
        })
      })
    }

    return allEntries
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Return basic sitemap with locales if database queries fail
    const locales = routing.locales
    const basicEntries: MetadataRoute.Sitemap = []

    locales.forEach((locale) => {
      basicEntries.push({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      })
    })

    return basicEntries
  }
}
