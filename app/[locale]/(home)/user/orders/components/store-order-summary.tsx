import { FC } from 'react'

import Image from 'next/image'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'
// import { ProductStatus } from '@/lib/generated/prisma'
import { OrderTypeColumn } from './columns'
import PaymentStatusTag from '@/app/(dashboard)/dashboard/(routes)/orders/components/payment-status'
import OrderStatusTag from '@/app/(dashboard)/dashboard/(routes)/orders/components/order-status'
import { useTranslations } from 'next-intl'
import { StaticPriceWithRate } from '@/components/shared/static-price-display'

interface Props {
  order: OrderTypeColumn
}

const StoreOrderSummary: FC<Props> = ({ order }) => {
  const t = useTranslations('user.orders')
  // const { coupon, couponId, subTotal, total, shippingFees } = order

  // let discountedAmount = 0
  // if (couponId && coupon) {
  //   discountedAmount = ((subTotal + shippingFees) * coupon.discount) / 100
  // }

  return (
    <div className="py-2 relative flex flex-col text-start">
      <div className="w-full px-1">
        <div className="space-y-3">
          <h2 className="sr-only font-bold text-3xl leading-10 overflow-ellipsis line-clamp-1">
            {t('orderDetails')}
          </h2>
          {order?.paidAt && (
            <h5 className="font-semibold text-lg leading-9">
              {t('paymentTime')}: {order.paidAt}
            </h5>
          )}
          {order?.transactionId && (
            <h6 className="font-semibold text-base leading-9">
              {t('transactionId')}: {order.transactionId}
            </h6>
          )}
          <div className="flex items-center gap-x-2">
            <PaymentStatusTag status={order.paymentStatus as PaymentStatus} />
            <OrderStatusTag status={order.orderStatus as OrderStatus} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 py-4 mb-6">
          {/* Address */}
          <div>
            <p className="font-normal text-base leading-7 mb-3 transition-all duration-500">
              {t('address')}
            </p>
            <h6 className="font-semibold text-lg leading-9">
              {order.shippingAddress?.province?.name},{' '}
              {order.shippingAddress.city?.name}
              ,&nbsp;
              {order.shippingAddress.address1} <br />
              {order.shippingAddress.zip_code}
            </h6>
          </div>
          {/* Customer */}
          <div>
            <p className="font-normal text-base leading-7 mb-3 transition-all duration-500">
              {t('customer')}
            </p>
            <h6 className="font-semibold text-lg leading-9">
              {order.user.name},{' '}
              {order.user?.phoneNumber ?? order.user.phoneNumber}
            </h6>
          </div>
        </div>
        {/* Products */}
        {order?.items.map((product, index) => (
          <div
            key={index}
            className="grid gap-4 py-3 w-full border-t"
            style={{ gridTemplateColumns: '144px 1.3fr 1fr' }}
          >
            {/* Product image */}
            <div className="w-full h-full">
              <Image
                unoptimized
                src={product.image || '/images/fallback-image.webp'}
                alt={product.name}
                width={200}
                height={200}
                className="w-36 h-36 rounded-xl object-cover"
              />
            </div>
            {/* Product info */}
            <div className="flex flex-col gap-y-1">
              <h5 className="font-semibold text-sm leading-4 line-clamp-1 overflow-ellipsis">
                {product.name}
              </h5>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  {t('sku')}:{' '}
                  <span className="ms-1">{product.sku ? product.sku : ''}</span>
                </p>
              </div>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  {t('size')}: <span className="ms-1">{product.size}</span>
                </p>
              </div>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  {t('quantity')}:{' '}
                  <span className="ms-1">{product.quantity}</span>
                </p>
              </div>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  {t('price')}:&nbsp;
                  <span className="ms-1">
                    <StaticPriceWithRate
                      originalAmount={product.price}
                      displayCurrency={order.currency}
                      exchangeRate={1 / order.exchangeRate}
                      originalCurrency="تومان"
                    />
                  </span>
                </p>
              </div>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  {t('shippingFee')}:{' '}
                  <span className="ms-1">
                    <StaticPriceWithRate
                      originalAmount={order.shippingFees || 0}
                      displayCurrency={order.currency}
                      exchangeRate={1 / order.exchangeRate}
                      originalCurrency="تومان"
                    />
                  </span>
                </p>
              </div>
            </div>
            {/* Product status - total */}
            <div className="flex flex-col items-center justify-center">
              <div className="grid place-items-center">
                <h5 className="font-semibold text-3xl leading-10 mt-3">
                  <StaticPriceWithRate
                    originalAmount={product.totalPrice}
                    displayCurrency={order.currency}
                    exchangeRate={1 / order.exchangeRate}
                    originalCurrency="تومان"
                  />
                </h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StoreOrderSummary
