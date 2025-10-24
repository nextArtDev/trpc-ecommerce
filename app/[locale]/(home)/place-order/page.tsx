import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
// import { formatCurrency } from '@/lib/utils'
// import { getMyCart } from '../../lib/actions/cart.action'
// import { getUserById } from '../../lib/actions/user.action'
// import { ShippingAddress } from '../../types'
// import CheckoutSteps from '../../components/checkout-steps'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { getValidatedCart } from '@/lib/home/actions/cart'
import { getUserShippingAddressById } from '@/lib/home/queries/user'
import CheckoutSteps from '../shipping-address/components/checkout-steps'
import PlaceOrderForm from './components/place-order-form'
import { getCurrentUser } from '@/lib/auth-helpers'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'سفارش',
}
const PlaceOrderPage = async () => {
  const cUser = await getCurrentUser()

  if (!cUser) {
    notFound()
  }
  const userId = cUser?.id

  if (!userId) redirect('/sign-in')

  const cart = await getValidatedCart()

  if (!cart || cart.cart?.items.length === 0) redirect('/cart')
  const shippingAddress = await getUserShippingAddressById(userId)
  if (!shippingAddress) redirect('/shipping-address')
  return (
    <section className="px-2">
      <CheckoutSteps current={2} />
      <h1 className="py-4 text-2xl font-bold text-center">تایید سفارش</h1>

      {(!cart.success || cart.cart?.validationErrors) && (
        <AlertDialog open={!!cart.cart?.validationErrors.length}>
          {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-500">
                سبد خرید معتبر نیست!
              </AlertDialogTitle>
              <AlertDialogDescription>
                {cart.cart?.validationErrors.map((er) => er.issue).join(', ')}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
              <AlertDialogAction asChild>
                <Link href={'/cart'}>برگشت به سبد خرید &larr;</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-col gap-2">
              <h2 className="text-xl pb-4 font-bold">آدرس ارسال</h2>
              <p>{shippingAddress?.name}</p>
              <p>
                {`${shippingAddress?.city?.name} - ${shippingAddress?.province?.name}`}{' '}
              </p>
              <p>{shippingAddress.address1}</p>
              <p>{shippingAddress.zip_code}</p>
              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">ویرایش</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4 ">
              <h2 className="text-xl pb-4 font-bold">سفارشها</h2>
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead>سفارش</TableHead>
                    <TableHead>تعداد</TableHead>
                    <TableHead>قیمت واحد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cart.cart?.items?.map((item) => (
                    <TableRow key={item.productSlug}>
                      <TableCell>
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="flex items-center"
                        >
                          <Image
                            unoptimized
                            src={item?.image || '/images/fallback-image.webp'}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                          <span className="px-2">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="px-2">{item.quantity}</span>
                      </TableCell>
                      <TableCell className="text-right">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardContent className="p-4 gap-4 space-y-4">
              <div className="flex justify-between">
                <div>سفارشها</div>
                <div>{cart.cart?.subTotal}</div>
              </div>
              {/* <div className="flex justify-between">
                <div>مالیات</div>
                <div>{cart.taxPrice}</div>
              </div> */}
              <div className="flex justify-between">
                <div>هزینه ارسال</div>
                <div>{cart.cart?.shippingFees}</div>
              </div>
              <div className="flex justify-between">
                <div>مجموع</div>
                <div>{cart.cart?.total}</div>
              </div>
              <PlaceOrderForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default PlaceOrderPage
