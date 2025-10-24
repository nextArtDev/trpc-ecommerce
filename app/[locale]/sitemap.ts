import {
  getCategoriesWithStats,
  getHomepageProducts,
  getSubCategories,
} from '@/lib/home/queries/products'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://'

  try {
    const [products, categories, subCategories] = await Promise.all([
      getHomepageProducts(),
      getCategoriesWithStats(),
      getSubCategories(),
    ])

    let allEntries: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/faq`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/products`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/sub-categories`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/categories`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      },
    ]

    // Add doctor pages
    if (products?.length) {
      const doctorEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/products/${product.slug}`,
        lastModified: new Date(product.updatedAt),
        changeFrequency: 'daily' as const,
        priority: 0.8,
      }))
      allEntries = [...allEntries, ...doctorEntries]
    }

    // Add specialization pages
    if (categories?.length) {
      const categoryEntries: MetadataRoute.Sitemap = categories.map(
        (category) => ({
          url: `${baseUrl}/categories/${category.url}`,
          lastModified: new Date(category.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })
      )
      allEntries = [...allEntries, ...categoryEntries]
    }

    // Add illness pages
    if (subCategories?.length) {
      const illnessEntries: MetadataRoute.Sitemap = subCategories.map(
        (sub) => ({
          url: `${baseUrl}/sub-categories/${sub.id}`,
          lastModified: new Date(sub.updatedAt),
          changeFrequency: 'weekly' as const,
          priority: 0.6,
        })
      )
      allEntries = [...allEntries, ...illnessEntries]
    }

    return allEntries
  } catch (error) {
    console.error('Error generating sitemap:', error)

    // Return basic sitemap if database queries fail
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact-us`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/faq`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ]
  }
}
