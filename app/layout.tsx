import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { Toaster } from 'sonner'
import QueryProviders from '@/providers/query-provider'
import { ThemeProvider } from '@/providers/theme-providers'

const myFont = localFont({
  src: '../public/fonts/Parastoo-VariableFont_wght.ttf',
})
// const vazirFont = localFont({
//   src: '../public/fonts/Vazirmatn-VariableFont_wght.ttf',
// })

// const numericFont = localFont({
//   src: '../public/fonts/FarsiAdad.woff2',
//   variable: '--font-adad',
// })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="fa-IR" dir="rtl" suppressHydrationWarning>
      <QueryProviders>
        <body className={`  ${myFont.className}  adad  antialiased`}>
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
    </html>
  )
}
