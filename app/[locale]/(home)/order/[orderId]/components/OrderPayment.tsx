'use client'

import { FC } from 'react'
import StripeWrapper from './stripe/stripe-wraper'
import StripePayment from './stripe/stripe-payment'
import PaypalWrapper from './paypal/paypal-wrapper'
import PaypalPayment from './paypal/paypal-payment'
import { Currency } from '@/lib/types/home'
import { useTranslations } from 'next-intl'
import { PriceDisplay } from '@/components/shared/price-display'

interface Props {
  orderId: string
  amount: number
  currency: Currency
}

const OrderPayment: FC<Props> = ({ amount, orderId, currency }) => {
  const t = useTranslations('payment')
  return (
    <div className="w-full h-full min-[768px]:min-w-[400px] space-y-5">
      <h3 className="text-lg font-medium mb-4">{t('title')}</h3>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">{t('orderTotal')}</span>
          <PriceDisplay
            amount={amount}
            originalCurrency="تومان"
            currency={currency}
            className="font-bold"
          />
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-4">
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">{t('paypal.title')}</h4>
          <PaypalWrapper>
            <PaypalPayment
              orderId={orderId}
              // amount={Number(amount)}
              // currency={currency}
            />
          </PaypalWrapper>
        </div>

        <div className="border-t pt-4">
          <h4 className="font-medium mb-2">{t('stripe.title')}</h4>
          <StripeWrapper
            amount={amount}
            // currency={currency}
          >
            <StripePayment orderId={orderId} />
          </StripeWrapper>
        </div>
      </div>
    </div>
  )
}

export default OrderPayment
