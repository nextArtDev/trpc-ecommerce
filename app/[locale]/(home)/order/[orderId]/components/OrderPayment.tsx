// 'use client'

// import { FC } from 'react'
// import StripeWrapper from './stripe/stripe-wraper'
// import StripePayment from './stripe/stripe-payment'
// import PaypalWrapper from './paypal/paypal-wrapper'
// import PaypalPayment from './paypal/paypal-payment'

// interface Props {
//   orderId: string
//   amount: number
// }

// const OrderPayment: FC<Props> = ({ amount, orderId }) => {
//   return (
//     // <div className="w-full h-full min-[768px]:min-w-[400px] space-y-5">
//     <div className="w-full h-full   space-y-5">
//       {/* Paypal */}
//       <div className="mt-6">
//         <PaypalWrapper>
//           <PaypalPayment orderId={orderId} />
//         </PaypalWrapper>
//       </div>

//       {/* Stripe */}
//       <StripeWrapper amount={amount}>
//         <StripePayment orderId={orderId} />
//       </StripeWrapper>
//     </div>
//   )
// }

// export default OrderPayment
