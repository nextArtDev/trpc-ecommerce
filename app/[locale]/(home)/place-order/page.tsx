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

import { notFound, redirect } from 'next/navigation'
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
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { PriceDisplay } from '@/components/shared/price-display'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('placeOrder')

  return {
    title: t('title'),
  }
}
const PlaceOrderPage = async () => {
  const cUser = await getCurrentUser()
  const t = await getTranslations('placeOrder')

  if (!cUser) {
    notFound()
  }
  const userId = cUser?.id

  if (!userId) redirect('/sign-in')

  const cart = await getValidatedCart()

  if (!cart || cart.cart?.items.length === 0) redirect('/cart')
  const shippingAddress = await getUserShippingAddressById(userId)
  if (!shippingAddress) redirect('/shipping-address')

  const cartCurrency = cart.cart?.currency || 'تومان'

  return (
    <section className="px-2">
      <CheckoutSteps current={2} />
      <h1 className="py-4 text-2xl font-bold text-center"> {t('title')}</h1>

      {(!cart.success || cart.cart?.validationErrors) && (
        <AlertDialog open={!!cart.cart?.validationErrors.length}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-red-500">
                {t('invalidCart')}
              </AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                {cart.cart?.validationErrors.map((err, idx) => (
                  <div
                    key={idx}
                    className={
                      err.severity === 'error'
                        ? 'text-red-600 font-semibold'
                        : 'text-amber-600'
                    }
                  >
                    <span className="font-medium">{err.productName}:</span>{' '}
                    {err.issue}
                  </div>
                ))}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Link href={'/cart'}>{t('backToCart')}</Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/*   Display payment method based on currency */}
      <Card className="mb-4 border-indigo-200 bg-indigo-50/50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">{t('paymentMethod')}</h3>
              <p className="text-sm text-muted-foreground">
                {cartCurrency === 'تومان'
                  ? 'پرداخت از طریق زرین‌پال'
                  : 'Payment via PayPal'}
              </p>
            </div>
            <div className="text-2xl font-bold text-indigo-600">
              {cartCurrency}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="md:col-span-2 overflow-x-auto space-y-4">
          <Card>
            <CardContent className="p-4 flex flex-col gap-2">
              <h2 className="text-xl pb-4 font-bold">{t('shippingAddress')}</h2>
              <p>{shippingAddress?.name}</p>
              <p>
                {shippingAddress?.addressType === 'IRANIAN'
                  ? `${shippingAddress?.city?.name} - ${shippingAddress?.province?.name}`
                  : `${
                      shippingAddress?.cityInt ? shippingAddress?.cityInt : ''
                    }| ${shippingAddress?.state?.name}, ${
                      shippingAddress?.country?.name
                    }`}
              </p>
              <p>{shippingAddress.address1}</p>
              <p>{shippingAddress.zip_code}</p>
              <div className="mt-3">
                <Link href="/shipping-address">
                  <Button variant="outline">{t('edit')}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 gap-4 ">
              <h2 className="text-xl pb-4 font-bold">{t('orders')}</h2>
              <Table dir="rtl">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('product')}</TableHead>
                    <TableHead>{t('quantity')}</TableHead>
                    <TableHead>{t('unitPrice')}</TableHead>
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
                      <TableCell className="text-right">
                        <PriceDisplay
                          amount={item.price}
                          currency={cartCurrency}
                        />
                        {/* {item.price} */}
                      </TableCell>
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
                <p>{t('subtotal')}</p>
                {/* <p>{cart.cart?.subTotal}</p> */}

                <PriceDisplay
                  amount={Number(cart.cart?.subTotal)}
                  currency={cartCurrency}
                />
              </div>
              {/* <div className="flex justify-between">
                <div>مالیات</div>
                <div>{cart.taxPrice}</div>
              </div> */}
              <div className="flex justify-between">
                <p>{t('shipping')}</p>
                {/* <p>{cart.cart?.shippingFees}</p> */}
                <PriceDisplay
                  amount={Number(cart.cart?.shippingFees)}
                  currency={cartCurrency}
                />
              </div>
              <div className="flex justify-between">
                <p>{t('total')}</p>
                {/* <p>{cart.cart?.total}</p> */}
                <PriceDisplay
                  amount={Number(cart.cart?.total)}
                  currency={cartCurrency}
                />
              </div>
              <PlaceOrderForm currency={cartCurrency} />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default PlaceOrderPage
