import type { Metadata } from 'next'
// import localFont from 'next/font/local'
import '../globals.css'
import { Toaster } from 'sonner'
import QueryProviders from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-providers'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
// import { Playfair_Display, Vazirmatn } from 'next/font/google'
import localFont from 'next/font/local'

// const vazirFont = localFont({
//   src: '../../public/fonts/Vazirmatn-VariableFont_wght.ttf',
// })

const vazirFont = localFont({
  src: '../../public/fonts/vazirmatn-v16-arabic-regular.woff2',

  variable: '--font-vazir',
  // weight: 'variable',
  weight: '100 900',
})

const PlayfairFont = localFont({
  src: '../../public/fonts/PlayfairDisplay-Regular.woff2',
  variable: '--font-playFair',
  // weight: 'variable',
  weight: '100 900',
})
// const montserrat = Playfair_Display({
//   subsets: ['latin'],
//   variable: '--font-montserrat',
//   weight: 'variable',
//   display: 'swap',
// })

// // Configure Vazirmatn with variable font
// const vazir = Vazirmatn({
//   subsets: ['arabic'],
//   variable: '--font-vazir',
//   weight: 'variable', // Variable font weight range
//   display: 'swap',
// })
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://'

  // Get keywords from translations
  const keywords = [
    t('keywords.naturalLeather'),
    t('keywords.womenLeatherBag'),
    ...t('keywords.common').split(','),
  ].join(', ')
  return {
    title: t('title'),
    description: t('description'),
    keywords: keywords,
    authors: [{ name: t('author') }],
    creator: t('creator'),
    publisher: t('publisher'),
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        fa: `${baseUrl}/fa`,
        de: `${baseUrl}/de`,
        fr: `${baseUrl}/fr`,
        it: `${baseUrl}/it`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      locale: t('openGraph.locale'),
      url: `${baseUrl}/${locale}`,
      siteName: t('openGraph.siteName'),
      images: [
        {
          url: t('openGraph.image'),
          width: 1200,
          height: 630,
          alt: t('openGraph.imageAlt'),
        },
      ],
    },
    twitter: {
      card: t('twitter.card') as
        | 'summary'
        | 'summary_large_image'
        | 'player'
        | 'app'
        | undefined,
      title: t('title'),
      description: t('description'),
      images: [t('openGraph.image')],
      site: t('twitter.site'),
      creator: t('twitter.creator'),
    },
    // manifest: './manifest.json',
    other: {
      'msapplication-TileColor': t('other.msapplicationTileColor'),
      'apple-mobile-web-app-capable': 'yes',
      'apple-mobile-web-app-status-bar-style': 'default',
      'apple-mobile-web-app-title': t('other.appleMobileWebAppTitle'),
      'format-detection': 'telephone=no',
      'mobile-web-app-capable': 'yes',
      'msapplication-config': '/browserconfig.xml',
      'msapplication-TileImage': '/icon-144.png',
      'application-name': t('other.applicationName'),
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
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  }
}

export default async function RootLayout({
  children,
  params,
  modal,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
  modal: React.ReactNode
}>) {
  const messages = await getMessages()
  const locale = (await params).locale

  return (
    <html
      lang={locale}
      dir={locale === 'fa' ? 'rtl' : 'ltr'}
      suppressHydrationWarning
      className={`${vazirFont.variable} ${PlayfairFont.variable}`}
    >
      <head>
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-title" content="Sarina" />
        <meta name="application-name" content="Sarina" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="mask-icon" href="/mask-icon.svg" color="#000000" />
      </head>
      <NextIntlClientProvider messages={messages}>
        <QueryProviders>
          <body
            className={`${
              locale === 'fa' ? vazirFont.className : PlayfairFont.className
            } antialiased`}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              {modal}
            </ThemeProvider>
            <Toaster richColors />
          </body>
        </QueryProviders>
      </NextIntlClientProvider>
    </html>
  )
}
