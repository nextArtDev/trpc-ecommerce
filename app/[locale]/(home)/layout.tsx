import Navbar from '@/components/home/navbar/Navbar'
import { ViewTransitions } from 'next-view-transitions'
import Footer from '@/components/home/shared/Footer'
import { CurrencyInitializer } from '@/components/shared/CurrencyInitializer'

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <section className="relative w-full h-full ">
      <ViewTransitions>
        <Navbar />

        {children}
        <CurrencyInitializer />
        <Footer />
      </ViewTransitions>
    </section>
  )
}
