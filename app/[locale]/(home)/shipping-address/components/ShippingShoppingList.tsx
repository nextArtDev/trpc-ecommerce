import { PriceDisplay } from '@/components/shared/price-display'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/hooks/useCartStore'
import { Link } from '@/i18n/navigation'
import { CartItem } from '@/lib/generated/prisma'
import { Currency } from '@/lib/types/home'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import Image from 'next/image'

type Props = {
  cartItems: CartItem[]
  mutable?: boolean
}

const ShippingShoppingList = ({ cartItems }: Props) => {
  const t = useTranslations('cart')
  const getLockedCurrency = useCartStore((state) => state.getLockedCurrency)
  const lockedCurrency = getLockedCurrency()

  return (
    <ul
      role="list"
      className=" divide-y divide-foreground border-t border-b border-foreground"
    >
      {cartItems?.map((item) => (
        <li key={item.productSlug} className={cn(' flex py-6 sm:py-10')}>
          <div className="relative shrink-0 size-20 sm:size:32">
            <Image
              unoptimized
              fill
              alt={item.name}
              src={item.image || '/images/fallback-image.webp'}
              className="size-24 rounded-lg object-cover sm:size-32"
            />
          </div>

          <div className="relative mr-4 flex flex-1 flex-col justify-between sm:mr-6">
            <div className="flex justify-between sm:grid sm:grid-cols-2">
              <div className="pl-6">
                <Link
                  href={`/products/${item.productSlug}`}
                  className="font-medium line-clamp-1  hover:underline"
                >
                  <h3 className="text-sm">
                    {item.name} | {item.quantity ? item.quantity : null}{' '}
                    {t('quantity')}
                  </h3>
                </Link>
                {/* <p className="mt-1 text-sm ">{product.color}</p> */}
                {item.size ? (
                  <p className="mt-1 text-sm ">
                    {item.size} | {item.color}
                  </p>
                ) : null}
                {item.price ? (
                  // <p className="mt-1 text-sm ">
                  //   {item.price} تومان
                  //   </p>
                  <PriceDisplay
                    className="mt-1 text-sm"
                    originalCurrency="تومان"
                    amount={item.price}
                    currency={lockedCurrency as Currency}
                  />
                ) : null}
              </div>
            </div>
            <Separator />
            <div className={cn('mt-4 flex items-center font-semibold gap-1 ')}>
              <p className="font-semibold"> {t('totalPrice')}</p>
              <div
                className={cn(
                  'inline-grid w-full max-w-32 lg:mr-44  grid-cols-1'
                )}
              >
                {/* <p>{+item.price * item.quantity} تومان</p> */}
                <PriceDisplay
                  originalCurrency="تومان"
                  amount={+item.price * item.quantity}
                  currency={lockedCurrency as Currency}
                />
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ShippingShoppingList
