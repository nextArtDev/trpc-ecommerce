import { CartProductType } from '@/lib/types/home'

type Props = {
  cartItems: CartProductType[]
}

const OrderSummary = ({ cartItems }: Props) => {
  const subtotal = cartItems?.reduce((total, item) => {
    return total + Number(item.price) * item.quantity
  }, 0)

  // const total = subtotal + shippingFees

  // const handleSaveCart = async () => {
  //   try {
  //     setLoading(true)
  //     const res = await saveUserCart(cartItems)
  //     if (res) router.push('/goshop/checkout')
  //     setLoading(false)
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       toast.error(error.message)
  //       console.log(error.message)
  //     } else {
  //       toast.error('An unexpected error occurred')
  //     }
  //   }
  // }

  return (
    <div className="mt-10 max-w-md mx-auto ">
      <div className="rounded-lg bg-muted px-4 py-6 sm:p-6 lg:p-8">
        <h2 className="sr-only">سفارش</h2>

        <div className="flow-root">
          <dl className="-my-4 divide-y divide-foreground text-sm">
            <div className="flex items-center justify-between py-4">
              <dt className="">مجموع قیمت سفارش</dt>
              <dd className="font-medium ">{subtotal}</dd>
            </div>
            <div className="flex items-center justify-between py-4">
              <dt className="">هزینه ارسال</dt>
              <dd className="font-medium ">مرحله بعد</dd>
            </div>
            {/* <div className="flex items-center justify-between py-4">
              <dt className="">Tax</dt>
              <dd className="font-medium ">$0.00</dd>
            </div> */}
            {/* <div className="flex items-center justify-between py-4">
              <dt className="text-base font-medium ">قیمت کل</dt>
              <dd className="text-base font-medium ">{subtotal}</dd>
            </div> */}
          </dl>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
