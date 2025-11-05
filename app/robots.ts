import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://'
  const locales = routing.locales

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/_next/',
          '/user/',
          '/sign-in',
          '/place-order',
          '/payment/',
          '*.json',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/user/'],
      },
    ],
    sitemap: [
      `${baseUrl}/sitemap.xml`,
      // Optional: Add hreflang sitemap references
      ...locales.map((locale) => `${baseUrl}/sitemap-${locale}.xml`),
    ],
    host: baseUrl,
  }
}
