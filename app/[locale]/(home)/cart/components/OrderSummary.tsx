import { PriceDisplay } from '@/components/shared/price-display'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'
import { CartProductType } from '@/lib/types/home'
import { useTranslations } from 'next-intl'

type Props = {
  cartItems: CartProductType[]
}

const OrderSummary = ({ cartItems }: Props) => {
  const subtotal = cartItems?.reduce((total, item) => {
    return total + Number(item.price) * item.quantity
  }, 0)

  const t = useTranslations('cart')
  const currency = useCurrencyStore((state) => state.currentCurrency)
  const convertCurrency = useCurrencyStore((state) => state.convertCurrency)
  return (
    <div className="mt-10 max-w-md mx-auto ">
      <div className="rounded-lg bg-muted px-4 py-6 sm:p-6 lg:p-8">
        <h2 className="sr-only">{t('orderSummary')}</h2>

        <div className="flow-root">
          <dl className="-my-4 divide-y divide-foreground text-sm">
            <div className="flex items-center justify-between py-4">
              <dt className="">{t('subtotal')}</dt>
              <dd className="font-medium ">
                {/* {subtotal} {t('currency')} */}
                <PriceDisplay
                  amount={convertCurrency(subtotal, 'تومان', currency)}
                  currency={currency}
                />
              </dd>
            </div>
            <div className="flex items-center justify-between py-4">
              <dt className="">{t('shipping')}</dt>
              <dd className="font-medium ">{t('calculatedNextStep')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
