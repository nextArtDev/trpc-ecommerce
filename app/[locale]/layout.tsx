import type { Metadata } from 'next'
// import localFont from 'next/font/local'
import '../globals.css'
import { Toaster } from 'sonner'
import QueryProviders from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-providers'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Playfair_Display, Vazirmatn } from 'next/font/google'

// const vazirFont = localFont({
//   src: '../../public/fonts/Vazirmatn-VariableFont_wght.ttf',
// })

const montserrat = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: 'variable',
  display: 'swap',
})

// Configure Vazirmatn with variable font
const vazir = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazir',
  weight: 'variable', // Variable font weight range
  display: 'swap',
})
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  manifest: '/manifest.json',
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
      className={`${montserrat.variable} ${vazir.variable}`}
    >
      <NextIntlClientProvider messages={messages}>
        <QueryProviders>
          <body
            className={`${
              locale === 'fa' ? vazir.className : montserrat.className
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
