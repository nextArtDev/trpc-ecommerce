import { FC } from 'react'

import Image from 'next/image'

// import OrderStatusSelect from './order-status-select'
// import PaymentStatusTag from './payment-status'
import { OrderStatus, PaymentStatus } from '@/lib/types/home'
// import { ProductStatus } from '@/lib/generated/prisma'
import { OrderTypeColumn } from './columns'
import PaymentStatusTag from '@/app/(dashboard)/dashboard/(routes)/orders/components/payment-status'
import OrderStatusTag from '@/app/(dashboard)/dashboard/(routes)/orders/components/order-status'

interface Props {
  order: OrderTypeColumn
}

const StoreOrderSummary: FC<Props> = ({ order }) => {
  // console.log(order)

  // const { coupon, couponId, subTotal, total, shippingFees } = order

  // let discountedAmount = 0
  // if (couponId && coupon) {
  //   discountedAmount = ((subTotal + shippingFees) * coupon.discount) / 100
  // }
  return (
    <div className="py-2 relative flex flex-col text-start">
      <div className="w-full px-1">
        <div className="space-y-3">
          <h2 className=" sr-only font-bold text-3xl leading-10 overflow-ellipsis line-clamp-1 ">
            جزئیات سفارش
          </h2>
          {order?.paidAt && (
            <h5 className="font-semibold text-lg leading-9">
              زمان پرداخت: {order.paidAt}
            </h5>
          )}
          {order?.transactionId && (
            <h6 className="font-semibold text-base leading-9">
              کد رهگیری:{order.transactionId}
            </h6>
          )}
          <div className="flex items-center gap-x-2">
            <PaymentStatusTag status={order.paymentStatus as PaymentStatus} />
            {/* <OrderStatusSelect
              orderId={order.id}
              status={order.orderStatus as OrderStatus}
            /> */}

            <OrderStatusTag status={order.orderStatus as OrderStatus} />
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 py-4   mb-6">
          {/* Shipping info */}
          <div className="grid grid-cols-2">
            {/* <div>
              <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 ">
                Shipping Service
              </p>
              <h6 className="font-semibold text-lg leading-9">
                {order.shippingService}
              </h6>
            </div> */}
            {/* <div>
              <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 ">
                Expected Delivery Date
              </p>
              <h6 className="font-semibold text-lg leading-9">
                {minDate} - {maxDate}
              </h6>
            </div> */}
          </div>
          {/* Payment info */}
          {/* <div className="grid grid-cols-2">
            <div>
              <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 ">
                Payment Method
              </p>
              <h6 className="font-semibold text-lg leading-9">
                {paymentDetails?.paymentMethod || '-'}
              </h6>
            </div>
            <div>
              <p className="font-normal text-base leading-7 text-gray-500 mb-3 transition-all duration-500 ">
                Payment Reference
              </p>
              <h6 className="font-semibold text-lg leading-9">
                {paymentDetails?.paymentInetntId || '-'}
              </h6>
            </div>
          </div> */}
          {/* Address */}
          <div>
            <p className="font-normal text-base leading-7   mb-3 transition-all duration-500 ">
              آدرس
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
            <p className="font-normal text-base leading-7  mb-3 transition-all duration-500 ">
              خریدار
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
            className="grid gap-4 py-3 w-full border-t  "
            style={{ gridTemplateColumns: '144px 1.3fr 1fr' }}
          >
            {/* Product image  */}
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
            {/* Product info  */}
            <div className="flex flex-col gap-y-1">
              <h5 className="font-semibold text-sm leading-4 line-clamp-1 overflow-ellipsis">
                {product.name}
              </h5>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  Sku :{' '}
                  <span className="ms-1">{product.sku ? product.sku : ''}</span>
                </p>
              </div>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  سایز : <span className="ms-1">{product.size}</span>
                </p>
              </div>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  تعداد : <span className="ms-1">{product.quantity}</span>
                </p>
              </div>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  قیمت :&nbsp;
                  <span className="ms-1"> {product.price}</span>
                </p>
              </div>
              <div className="text-sm">
                <p className="font-normal text-muted-foreground">
                  هزینه ارسال :{' '}
                  <span className="ms-1">{order.shippingFees}</span>
                </p>
              </div>
            </div>
            {/* Product status - total  */}
            <div className="flex flex-col items-center justify-center">
              {/* <ProductStatusSelect
                orderItemId={product.id}
                status={product.status as ProductStatus}
              /> */}
              <div className="grid place-items-center">
                <h5 className="font-semibold text-3xl leading-10 mt-3">
                  {product.totalPrice} تومان
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
