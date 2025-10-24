// import Image from 'next/image'
// import Link from 'next/link'

import MainNav from './components/main-nav'
// import Menu from './components/menu'
import ModalProvider from '@/providers/modal-provider'

export const metadata = {
  title: 'حساب کاربری',
}

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="w-full h-full border-b  mx-auto">
          <div className="w-full  flex justify-around items-center h-16 px-4">
            {/* <article>
              <Link href="/" className="w-22">
                <Image
                  src={'/images/logo.svg'}
                  height={48}
                  width={48}
                  alt={'SEP'}
                />
              </Link>
            </article> */}
            <MainNav className="mx-2" />
            {/* <div className="  items-center flex space-x-4">
              <Menu />
            </div> */}
          </div>
        </div>

        <div className="flex-1 w-full h-full space-y-4 p-2 pt-6  mx-auto">
          <ModalProvider>{children}</ModalProvider>
        </div>
      </div>
    </>
  )
}
