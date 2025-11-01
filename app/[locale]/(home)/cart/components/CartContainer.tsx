'use client'

import { buttonVariants } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCartStore'

import { useEffect } from 'react'
import CheckoutBtn from './CheckoutBtn'
import OrderSummary from './OrderSummary'
import ShoppingList from './ShoppingList'
import { TransitionLink } from '@/components/home/shared/TransitionLink'
import { useTranslations } from 'next-intl'

function CartContainer({ locale }: { locale?: string }) {
  // const totalPrice = useCartStore((state) => state.totalPrice)
  const cartItems = useCartStore((state) => state.cart)

  const { validateAndUpdatePrices } = useCartStore()

  const t = useTranslations('cart')

  useEffect(() => {
    validateAndUpdatePrices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-center">
        {t('title')}{' '}
      </h1>

      {!!cartItems?.length ? (
        <>
          <div className="">
            <h2 className="sr-only">{t('itemsInCart')}</h2>
          </div>

          <ShoppingList cartItems={cartItems} />
          <OrderSummary cartItems={cartItems} />
          <CheckoutBtn cartItems={cartItems} locale={locale} />
        </>
      ) : (
        <article className="w-full h-full flex flex-col items-center justify-center">
          {t('emptyCart')}
          <TransitionLink
            href={locale ? `/${locale}` : '/'}
            className={buttonVariants({ variant: 'default' })}
          >
            {t('continueShopping')}
          </TransitionLink>
        </article>
      )}
    </div>
  )
}

export default CartContainer
