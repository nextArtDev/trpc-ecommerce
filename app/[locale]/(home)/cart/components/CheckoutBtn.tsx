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

  const [isPending, startTransition] = useTransition()

  const handleSaveCart = async () => {
    startTransition(async () => {
      const res = await saveAllToCart(cartItems)
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
