// app/manifest.ts
import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { routing } from '@/i18n/routing'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  // Get the locale from headers or default to 'en'
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || '/'
  const locale = pathname.split('/')[1] || routing.defaultLocale

  // Validate locale
  const validLocale = routing.locales.includes(
    locale as 'fa' | 'en' | 'de' | 'fr' | 'it'
  )
    ? locale
    : routing.defaultLocale

  // Manifest data for each locale
  const manifestData = {
    fa: {
      name: 'کارگاه چرم سارینا',
      short_name: 'سارینا',
      description: 'فروش محصولات چرمی دست‌ساز',
      start_url: '/fa',
      display: 'standalone' as const,
      background_color: '#ffffff',
      theme_color: '#000000',
      dir: 'rtl' as const,
      lang: 'fa',
      orientation: 'portrait' as const,
      scope: '/fa',
      categories: ['shopping', 'fashion', 'lifestyle'],
    },
    en: {
      name: 'Sarina Leather Workshop',
      short_name: 'Sarina',
      description: 'Handmade leather products',
      start_url: '/en',
      display: 'standalone' as const,
      background_color: '#ffffff',
      theme_color: '#000000',
      dir: 'ltr' as const,
      lang: 'en',
      orientation: 'portrait' as const,
      scope: '/en',
      categories: ['shopping', 'fashion', 'lifestyle'],
    },
    de: {
      name: 'Sarina Lederwerkstatt',
      short_name: 'Sarina',
      description: 'Handgefertigte Lederprodukte',
      start_url: '/de',
      display: 'standalone' as const,
      background_color: '#ffffff',
      theme_color: '#000000',
      dir: 'ltr' as const,
      lang: 'de',
      orientation: 'portrait' as const,
      scope: '/de',
      categories: ['shopping', 'fashion', 'lifestyle'],
    },
    fr: {
      name: 'Atelier de Cuir Sarina',
      short_name: 'Sarina',
      description: 'Produits en cuir faits à la main',
      start_url: '/fr',
      display: 'standalone' as const,
      background_color: '#ffffff',
      theme_color: '#000000',
      dir: 'ltr' as const,
      lang: 'fr',
      orientation: 'portrait' as const,
      scope: '/fr',
      categories: ['shopping', 'fashion', 'lifestyle'],
    },
    it: {
      name: 'Laboratorio di Pelle Sarina',
      short_name: 'Sarina',
      description: 'Prodotti in pelle fatti a mano',
      start_url: '/it',
      display: 'standalone' as const,
      background_color: '#ffffff',
      theme_color: '#000000',
      dir: 'ltr' as const,
      lang: 'it',
      orientation: 'portrait' as const,
      scope: '/it',
      categories: ['shopping', 'fashion', 'lifestyle'],
    },
  }

  const localeData =
    manifestData[validLocale as keyof typeof manifestData] || manifestData.en

  return {
    ...localeData,
    icons: [
      {
        src: '/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Desktop view',
      },
      {
        src: '/screenshot-mobile.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Mobile view',
      },
    ],
    shortcuts: [
      {
        name: localeData.name,
        short_name: localeData.short_name,
        description: localeData.description,
        url: localeData.start_url,
        icons: [
          {
            src: '/icon-96x96.png',
            sizes: '96x96',
          },
        ],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    // edge_side_panel: {
    //   preferred_width: 400,
    // },

    launch_handler: {
      client_mode: ['navigate-existing', 'auto'],
    },
  }
}
