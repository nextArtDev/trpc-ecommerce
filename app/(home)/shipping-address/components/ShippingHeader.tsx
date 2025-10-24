import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const ShippingHeader = () => {
  return (
    <div>
      <header className="relative mx-auto max-w-7xl bg-indigo-900 py-6 lg:grid lg:grid-cols-2 lg:gap-x-16 lg:bg-transparent lg:px-8 lg:pt-16 lg:pb-10">
        <div className="mx-auto flex max-w-2xl px-4 lg:w-full lg:max-w-lg lg:px-0">
          <Link href="/" className="relative w-full h-full">
            <span className="sr-only">Your Company</span>
            <div className="relative h-8 w-auto">
              <Image
                alt="logo"
                fill
                src="/images/logo.svg"
                className="h-8 aspect-square w-auto lg:hidden"
              />
            </div>
            <div className="relative h-8 w-auto">
              <Image
                alt="shipping"
                fill
                src="/images/logo.svg"
                className="hidden aspect-square h-8 w-auto lg:block"
              />
            </div>
          </Link>
        </div>
      </header>
    </div>
  )
}

export default ShippingHeader
