'use client'
import { PriceDisplay } from '@/components/shared/price-display'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCartStore'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'
import useFromStore from '@/hooks/useFromStore'
import { CartProductType, Currency } from '@/lib/types/home'
import { cn } from '@/lib/utils'
import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React, { FC } from 'react'
import { toast } from 'sonner'

type AddToCardBtnProps = {
  product: {
    id: string
    slug: string
    name: string
    image: string
    shippingFeeMethod: string
  }
  variant: {
    id: string
    size: string
    color: string
    price: number
    discount: number
    quantity: number
    weight: number | null
  }
}

const AddToCardBtn: FC<AddToCardBtnProps> = ({ product, variant }) => {
  const cart = useFromStore(useCartStore, (state) => state.cart)
  const addToCart = useCartStore((state) => state.addToCart)
  const updateProductQuantity = useCartStore(
    (state) => state.updateProductQuantity
  )

  const canAddToCart = useCartStore((state) => state.canAddToCart)
  const getLockedCurrency = useCartStore((state) => state.getLockedCurrency)
  const lockedCurrency = getLockedCurrency()
  const currency = useCurrencyStore((state) => state.currentCurrency)
  const isWrongCurrency = lockedCurrency && lockedCurrency !== currency

  const t = useTranslations('product')
  // console.log({ currency })
  // console.log({ cart })
  // const convertCurrency = useCurrencyStore((state) => state.convertCurrency)

  const existItem = cart?.find((item) => item.variantId === variant.id)

  const handleAddToCart = () => {
    // NEW: Prevent adding if wrong currency
    if (!canAddToCart(currency)) {
      toast.error(
        t('cart.currencyMismatch', {
          locked: lockedCurrency as Currency,
          current: currency,
        })
      )
      return
    }

    const itemToAdd: CartProductType = {
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      size: variant.size,
      color: variant.color,
      price:
        variant.discount > 0
          ? variant.price - variant.price * (variant.discount / 100)
          : variant.price,
      stock: variant.quantity,
      weight: variant.weight ?? 0,
      quantity: 1,
      shippingMethod: product.shippingFeeMethod,
      extraShippingFee: 0,
      shippingFee: 0,
      currency, // This locks the currency
    }
    // console.log({ cart })
    addToCart(itemToAdd)
    toast.success(
      t('cart.addedToCart', {
        name: product.name,
        size: variant.size,
        color: variant.color,
      })
    )
  }
  const handleIncreaseQuantity = () => {
    if (existItem && existItem.quantity < variant.quantity) {
      updateProductQuantity(existItem, existItem.quantity + 1)
    }
  }

  const handleDecreaseQuantity = () => {
    if (existItem) {
      updateProductQuantity(existItem, existItem.quantity - 1)
    }
  }
  if (variant.quantity <= 0) {
    return (
      <div className="w-full p-4 bg-red-50 border border-red-200 rounded-sm text-center">
        <p className="text-red-600 font-medium">{t('variant.unavailable')}</p>
      </div>
    )
  }

  if (isWrongCurrency && !existItem) {
    return (
      <div className="w-full space-y-2">
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-sm">
          <p className="text-amber-800 text-sm text-center">
            {t('cart.changeCurrencyWarning', {
              locked: lockedCurrency,
            })}
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            // Clear cart to allow new currency
            if (confirm(t('cart.clearCartConfirm'))) {
              useCartStore.getState().emptyCart()
              toast.info(t('cart.cartCleared'))
            }
          }}
        >
          {t('cart.clearAndContinue')}
        </Button>
      </div>
    )
  }

  // console.log(cartItems)
  if (existItem) {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        <article className="flex w-full h-full items-center justify-center">
          <Button
            type="button"
            variant="outline"
            className="rounded-md cursor-pointer w-7 h-7 sm:w-9 sm:h-9"
            onClick={handleDecreaseQuantity}
          >
            <Minus className="w-2 h-2 sm:w-4 sm:h-4" />
          </Button>

          <span className="px-1 sm:px-2 text-green-500 text-xl">
            {existItem.quantity}
          </span>

          <Button
            type="button"
            variant="outline"
            className="rounded-md cursor-pointer w-7 h-7 sm:w-9 sm:h-9"
            onClick={handleIncreaseQuantity}
            disabled={existItem.quantity >= variant.quantity}
            aria-label="Increase quantity"
          >
            <Plus className="w-2 h-2 sm:w-4 sm:h-4" />
          </Button>
        </article>
        <article className="flex w-full h-full items-center justify-center">
          {existItem.quantity >= variant.quantity ? (
            <span className="px-3 py-2 block text-center text-rose-300 text-xs">
              {t('cart.outOfStock')}
            </span>
          ) : (
            <span className="px-3 py-2 block text-center text-indigo-600 dark:text-indigo-100 bg-indigo-500/30 text-xs rounded-md">
              {t('cart.itemsInStock', {
                count: variant.quantity - existItem.quantity,
              })}
            </span>
          )}
        </article>
      </div>
    )
  }

  const finalPrice =
    variant.discount > 0 && variant.discount
      ? variant.price - variant.price * (variant.discount / 100)
      : variant.price

  // NEW: Use locked currency for display if item is in cart
  const displayCurrency = lockedCurrency || currency

  return (
    <Button
      disabled={variant.quantity <= 0}
      variant={'indigo'}
      onClick={handleAddToCart}
      className={cn(
        'w-full rounded-sm py-6 font-bold flex justify-between items-center'
      )}
    >
      <p>{t('cart.buy')}</p>
      {!!variant.discount ? (
        <div className="flex items-center gap-1 text-lg">
          {variant.discount > 0 && (
            <PriceDisplay
              originalCurrency="تومان"
              amount={finalPrice}
              currency={displayCurrency}
            />
          )}
          <span
            className={cn('text-red-300', variant.discount && 'line-through')}
          >
            <PriceDisplay
              originalCurrency="تومان"
              amount={variant.price}
              currency={displayCurrency}
            />
          </span>
        </div>
      ) : (
        <span className={cn(' text-lg', variant.discount && 'line-through')}>
          <PriceDisplay
            originalCurrency="تومان"
            amount={variant.price}
            currency={displayCurrency}
          />
        </span>
      )}
    </Button>
  )
}

export default AddToCardBtn
