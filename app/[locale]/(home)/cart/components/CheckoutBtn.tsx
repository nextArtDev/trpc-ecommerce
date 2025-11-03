import { useCartStore } from '@/hooks/useCartStore'
import { useCurrencyStore } from '@/hooks/useCurrencyStore'
import { saveAllToCart } from '@/lib/home/actions/cart'
import { CartProductType } from '@/lib/types/home'
import { Loader } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useTransition } from 'react'
import { toast } from 'sonner'

type Props = {
  cartItems: CartProductType[]
  locale?: string
}

const CheckoutBtn = ({ cartItems, locale }: Props) => {
  const t = useTranslations('cart')
  const router = useRouter()
  // const { toast } = useToast()
  const getLockedCurrency = useCartStore((state) => state.getLockedCurrency)
  const lockedCurrency = getLockedCurrency()
  const currency = useCurrencyStore((state) => state.currentCurrency)

  const [isPending, startTransition] = useTransition()

  const handleSaveCart = async () => {
    const itemCurrencies = new Set(cartItems.map((item) => item.currency))
    //  if (itemCurrencies.size > 1) {
    //    toast.error('محصولات با واحدهای پولی مختلف در سبد خرید وجود دارد.')
    //    return
    //  }
    if (
      (lockedCurrency && lockedCurrency !== currency) ||
      itemCurrencies.size > 1
    ) {
      toast.error('Mismatch Currency')
      return
    }
    startTransition(async () => {
      const res = await saveAllToCart(
        cartItems,
        lockedCurrency || cartItems[0]?.currency || currency
      )
      // console.log(res)
      if (!res.success) {
        toast.error(res.message)
        return
      }
      router.push(locale ? `/${locale}/shipping-address` : '/shipping-address')
    })
  }
  return (
    <div className="my-12 max-w-sm mx-auto ">
      {/* <Link href={'/shipping-address'} className="mt-10"> */}
      <button
        onClick={handleSaveCart}
        disabled={isPending}
        type="submit"
        className="flex justify-center cursor-pointer w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-xs hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 focus:outline-hidden"
      >
        {isPending ? <Loader className="animate-spin" /> : t('checkout')}
      </button>
      {/* </Link> */}

      <div className="mt-6 flex items-center justify-center gap-1 text-center text-sm ">
        <p>{t('or')}</p>
        <Link
          href={locale ? `/${locale}` : '/'}
          className="font-medium text-indigo-600 hover:text-indigo-500"
        >
          {t('continueShopping')}
          <span aria-hidden="true"> &larr;</span>
        </Link>
      </div>
    </div>
  )
}

export default CheckoutBtn
