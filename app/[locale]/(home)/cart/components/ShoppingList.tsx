import { TransitionLink } from '@/components/home/shared/TransitionLink'
import AddToCardBtn from '@/components/product/product-detail/AddToCardBtn'
import { Badge } from '@/components/ui/badge'
import { CartProductType } from '@/lib/types/home'
import { useTranslations } from 'next-intl'

import Image from 'next/image'

type Props = {
  cartItems: CartProductType[]
  mutable?: boolean
}

const ShoppingList = ({ cartItems, mutable = false }: Props) => {
  const t = useTranslations('cart')
  return (
    <ul
      role="list"
      className="w-full h-full divide-y divide-foreground border-t border-b border-foreground"
    >
      {cartItems?.map((item) => (
        <li
          key={item.slug}
          className="w-full h-full flex flex-col items-center justify-center sm:items-center sm:justify-center sm:flex-row gap-4 py-6 px-4 sm:px-0 hover:bg-muted/30 transition-colors duration-200"
        >
          {!mutable && (
            <div className="relative shrink-0 mx-auto sm:mx-0">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 overflow-hidden rounded-xl border border-border shadow-sm">
                <Image
                  unoptimized
                  fill
                  alt={item.name}
                  src={item.image || '/images/fallback-image.webp'}
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                />
              </div>
            </div>
          )}

          <div className="flex-1 space-y-3 sm:space-y-4">
            <div className="w-ful h-full flex flex-col items-center  justify-center sm:flex-row sm:justify-evenly sm:items-start gap-3">
              <div className="flex flex-col gap-2 sm:flex-row  sm:justify-evenly sm:items-center flex-1">
                <TransitionLink
                  href={`/products/${item.slug}`}
                  className="font-medium line-clamp-1  hover:underline"
                >
                  <h3 className="font-semibold text-base sm:text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
                    {item.name}
                  </h3>
                  {item.size && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t('size')}:
                      </span>
                      <p className="text-xs px-2 py-1">{item.size}</p>
                    </div>
                  )}
                  {item.color && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {t('color')}:
                      </span>
                      <p className="text-xs px-2 py-1">{item.color}</p>
                    </div>
                  )}
                </TransitionLink>

                <div className="text-left space-y-3 px-auto text-sm font-medium ">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {t('quantity')}:
                    </span>
                    <p className="text-xs px-0.5 py-1">{item.quantity}</p>
                    {!mutable && (
                      <>
                        <span className="text-sm text-muted-foreground">
                          {t('unitPrice')}:
                        </span>
                        <p className="text-xs px-0.5 py-1">
                          {item.price} {t('currency')}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base text-muted-foreground">
                      {t('totalPrice')}:
                    </span>
                    <Badge
                      variant="outline"
                      className="text-red-500 text-sm sm:text-base px-2 py-1"
                    >
                      {+item.price * item.quantity} {t('currency')}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <div className="flex-1">
                  {!mutable && (
                    <AddToCardBtn
                      product={{
                        id: item.productId,
                        slug: item.slug,
                        name: item.name,
                        image: item.image,
                        shippingFeeMethod: item.shippingMethod,
                      }}
                      variant={{
                        id: item.variantId,
                        size: item.size,
                        color: item.color,
                        price: item.price,
                        discount: 0,
                        quantity: item.stock,
                        weight: item.weight,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ShoppingList
