'use client'

import { buttonVariants } from '@/components/ui/button'
import { useCartStore } from '@/hooks/useCartStore'

import { useEffect } from 'react'
import CheckoutBtn from './CheckoutBtn'
import OrderSummary from './OrderSummary'
import ShoppingList from './ShoppingList'
import { TransitionLink } from '@/components/home/shared/TransitionLink'

function CartContainer() {
  // const totalPrice = useCartStore((state) => state.totalPrice)
  const cartItems = useCartStore((state) => state.cart)
  const { validateAndUpdatePrices } = useCartStore()

  useEffect(() => {
    validateAndUpdatePrices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // console.log('Cart items:', cartItems)
  // const setCart = useCartStore((state) => state.setCart)
  // const [loading, setLoading] = useState<boolean>(false)

  // const [isCartLoaded, setIsCartLoaded] = useState<boolean>(false)
  // const [selectedItems, setSelectedItems] = useState<CartItem[]>([])
  // const [totalShipping, setTotalShipping] = useState<number>(0)

  // // const hasMounted = useRef(false)

  // useEffect(() => {
  //   if (cartItems !== undefined) {
  //     setIsCartLoaded(true) // Flag indicating cartItems has finished loading
  //   }
  // }, [cartItems])
  // useEffect(() => {
  //   const loadAndSyncCart = () => {
  //     if (!cartItems) return
  //       try {
  //         setLoading(true)
  //         const updatedCart = await updateCartWithLatest(cartItems)
  //         setCart(updatedCart)
  //         setLoading(false)
  //       } catch (error) {
  //         setLoading(false)
  //       }
  //   }

  //   // Run only when userCountry changes and after the initial mount
  //   if (hasMounted.current && cartItems?.length) {
  //     loadAndSyncCart()
  //   } else {
  //     hasMounted.current = true // Set the ref to true after the first render
  //   }
  // }, [])
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-center">
        لیست خرید
      </h1>

      {!!cartItems?.length ? (
        <>
          <div className="">
            <h2 className="sr-only">Items in your shopping cart</h2>
          </div>

          <ShoppingList cartItems={cartItems} />
          <OrderSummary cartItems={cartItems} />
          <CheckoutBtn cartItems={cartItems} />
        </>
      ) : (
        <article className="w-full h-full flex flex-col items-center justify-center">
          سبد شما خالی است!
          <TransitionLink
            href={'/'}
            className={buttonVariants({ variant: 'default' })}
          >
            ادامه خرید
          </TransitionLink>
        </article>
      )}
    </div>
  )
}

export default CartContainer
