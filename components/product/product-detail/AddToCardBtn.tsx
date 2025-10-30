'use client'
import { PriceDisplay } from '@/components/shared/price-display'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCartStore'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'
import useFromStore from '@/hooks/useFromStore'
import { CartProductType } from '@/lib/types/home'
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
  const t = useTranslations('product')
  const currency = useCurrencyStore((state) => state.currentCurrency)
  const convertCurrency = useCurrencyStore((state) => state.convertCurrency)

  const existItem = cart?.find((item) => item.variantId === variant.id)

  const handleAddToCart = () => {
    // Construct the cart item object right when the user clicks.
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
      quantity: 1, // Always start with 1 when first adding
      shippingMethod: product.shippingFeeMethod,
      extraShippingFee: 0,
      shippingFee: 0,
      currency,
    }
    addToCart(itemToAdd)
    toast.success(
      // ` ${product.name} (${variant.size} / ${variant.color}) به کارت اضافه شد!`
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

  // console.log(cartItems)
  if (existItem) {
    return (
      <div className="flex flex-col gap-2 w-full h-full items-center justify-center">
        <article className="flex  w-full h-full items-center justify-center">
          <Button
            type="button"
            variant="outline"
            // size={'icon'}
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
            // size={'icon'}
            variant="outline"
            className="rounded-md cursor-pointer w-7 h-7 sm:w-9 sm:h-9"
            onClick={handleIncreaseQuantity}
            disabled={existItem.quantity >= variant.quantity}
            aria-label="Increase quantity"
          >
            <Plus className="w-2 h-2 sm:w-4 sm:h-4" />
          </Button>
        </article>
        <article className="flex  w-full h-full items-center justify-center">
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
            <p className="">
              {/* {finalPrice} {t('currency')} */}
              <PriceDisplay
                amount={convertCurrency(finalPrice, 'تومان', currency)}
                currency={currency}
              />
            </p>
          )}
          <p className={cn('text-red-300', variant.discount && 'line-through')}>
            {/* {variant.price} {t('currency')} */}
            <PriceDisplay
              amount={convertCurrency(variant.price, 'تومان', currency)}
              currency={currency}
            />
          </p>
        </div>
      ) : (
        <p className={cn(' text-lg', variant.discount && 'line-through')}>
          {/* {variant.price} {t('currency')} */}
          <PriceDisplay
            amount={convertCurrency(variant.price, 'تومان', currency)}
            currency={currency}
          />
        </p>
      )}
    </Button>
  )
}

export default AddToCardBtn
