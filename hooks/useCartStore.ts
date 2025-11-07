// stores/useCartStore.ts
import { fetchCurrentPricesAndStock } from '@/lib/home/actions/cart'
import { CartProductType, Currency } from '@/lib/types/home'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { convertCurrency, formatPrice } from '@/lib/currency-config'

interface State {
  cart: CartProductType[]
  totalItems: number
  totalPrice: number
  lockedCurrency: Currency | null
}

interface Actions {
  addToCart: (item: CartProductType) => void
  updateProductQuantity: (product: CartProductType, quantity: number) => void
  removeMultipleFromCart: (items: CartProductType[]) => void
  removeFromCart: (item: CartProductType) => void
  emptyCart: () => void
  setCart: (newCart: CartProductType[]) => void
  validateAndUpdatePrices: () => Promise<void>
  getCartTotalInCurrency: () => number
  getFormattedCartTotal: () => string
  getLockedCurrency: () => Currency | null
  canAddToCart: (currency: Currency) => boolean
}

const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  lockedCurrency: null,
}

const calculateTotals = (cart: CartProductType[]) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  return { totalItems, totalPrice }
}

export const useCartStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      lockedCurrency: INITIAL_STATE.lockedCurrency,

      getLockedCurrency: () => {
        return get().lockedCurrency
      },

      canAddToCart: (currency: Currency) => {
        const { cart, lockedCurrency } = get()
        if (cart.length === 0) return true
        return lockedCurrency === currency
      },

      addToCart: (product: CartProductType) => {
        if (!product || !product.variantId) return
        const { cart, lockedCurrency } = get()

        const currencyToLock =
          cart.length === 0 ? product.currency : lockedCurrency

        if (lockedCurrency && product.currency !== lockedCurrency) {
          console.warn('Cannot add item with different currency')
          return
        }

        const cartItem = cart.find(
          (item) => item.variantId === product.variantId
        )
        if (cartItem) {
          const updatedCart = cart.map((item) =>
            item.variantId === product.variantId
              ? {
                  ...item,
                  quantity: Math.min(
                    item.quantity + product.quantity,
                    item.stock
                  ),
                }
              : item
          )
          set({
            cart: updatedCart,
            ...calculateTotals(updatedCart),
            lockedCurrency: currencyToLock,
          })
        } else {
          const updatedCart = [...cart, { ...product }]
          set({
            cart: updatedCart,
            ...calculateTotals(updatedCart),
            lockedCurrency: currencyToLock,
          })
        }
      },

      updateProductQuantity: (product: CartProductType, quantity: number) => {
        const cart = get().cart
        if (quantity <= 0) {
          get().removeFromCart(product)
          return
        }
        const updatedCart = cart.map((item) =>
          item.variantId === product.variantId
            ? { ...item, quantity: Math.min(quantity, item.stock) }
            : item
        )
        set({ cart: updatedCart, ...calculateTotals(updatedCart) })
      },

      removeFromCart: (product: CartProductType) => {
        if (!product || !product.variantId) return
        const updatedCart = get().cart.filter(
          (item) => item.variantId !== product.variantId
        )
        const newLockedCurrency =
          updatedCart.length === 0 ? null : get().lockedCurrency

        set({
          cart: updatedCart,
          ...calculateTotals(updatedCart),
          lockedCurrency: newLockedCurrency,
        })
      },

      removeMultipleFromCart: (products: CartProductType[]) => {
        const cart = get().cart
        const variantIdsToRemove = new Set(products.map((p) => p.variantId))
        const updatedCart = cart.filter(
          (item) => !variantIdsToRemove.has(item.variantId)
        )
        const newLockedCurrency =
          updatedCart.length === 0 ? null : get().lockedCurrency

        set({
          cart: updatedCart,
          ...calculateTotals(updatedCart),
          lockedCurrency: newLockedCurrency,
        })
      },

      emptyCart: () => {
        set(INITIAL_STATE)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart')
        }
      },

      setCart: (newCart: CartProductType[]) => {
        const newLockedCurrency =
          newCart.length > 0 ? newCart[0].currency : null
        set({
          cart: newCart,
          ...calculateTotals(newCart),
          lockedCurrency: newLockedCurrency,
        })
      },

      validateAndUpdatePrices: async () => {
        const cart = get().cart
        if (cart.length === 0) return

        try {
          const variantIds = cart.map((item) => item.variantId)
          const currentData = await fetchCurrentPricesAndStock(variantIds)

          let hasChanges = false

          const updatedCart = cart
            .map((item) => {
              const currentVariant = currentData.find(
                (data) => data.variantId === item.variantId
              )

              if (!currentVariant) {
                hasChanges = true
                return null
              }

              const updatedItem = { ...item }
              const currentFinalPrice =
                currentVariant.price -
                currentVariant.price * (currentVariant.discount / 100)

              if (Math.abs(currentFinalPrice - item.price) > 0.01) {
                updatedItem.price = currentFinalPrice
                hasChanges = true
              }

              if (currentVariant.stock !== item.stock) {
                updatedItem.stock = currentVariant.stock
                hasChanges = true
              }

              if (item.quantity > currentVariant.stock) {
                updatedItem.quantity = currentVariant.stock
                hasChanges = true
              }
              return updatedItem
            })
            .filter(Boolean) as CartProductType[]

          const finalCart = updatedCart.filter((item) => item.quantity > 0)

          if (hasChanges || finalCart.length !== cart.length) {
            const newLockedCurrency =
              finalCart.length > 0 ? finalCart[0].currency : null
            set({
              cart: finalCart,
              ...calculateTotals(finalCart),
              lockedCurrency: newLockedCurrency,
            })
          }
        } catch (error) {
          console.error('Failed to validate cart:', error)
        }
      },

      // ✅ UPDATED: Use .env-based conversion (no DB/API calls needed)
      getCartTotalInCurrency: () => {
        const { totalPrice, lockedCurrency } = get()
        if (!lockedCurrency || lockedCurrency === 'تومان') return totalPrice

        // Convert from Toman (base currency) to locked currency
        return convertCurrency(totalPrice, 'تومان', lockedCurrency)
      },

      // ✅ UPDATED: Use .env-based formatting
      getFormattedCartTotal: () => {
        const { totalPrice, lockedCurrency } = get()

        if (!lockedCurrency) {
          return formatPrice(totalPrice, 'تومان')
        }

        if (lockedCurrency === 'تومان') {
          return formatPrice(totalPrice, 'تومان')
        }

        const convertedPrice = get().getCartTotalInCurrency()
        return formatPrice(convertedPrice, lockedCurrency)
      },
    }),
    {
      name: 'cart',
      partialize: (state) => ({
        cart: state.cart,
        totalItems: state.totalItems,
        totalPrice: state.totalPrice,
        lockedCurrency: state.lockedCurrency,
      }),
    }
  )
)
