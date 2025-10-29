import { fetchCurrentPricesAndStock } from '@/lib/home/actions/cart'
import { CartProductType, Currency } from '@/lib/types/home'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useCurrencyStore } from './useCurrencyStore'

// Define the interface of the Cart state
interface State {
  cart: CartProductType[]
  totalItems: number
  totalPrice: number
  baseCurrency: Currency // Add base currency tracking
  lastCurrencyUpdate: number // Timestamp of last currency sync
}

// Define the interface of the actions that can be performed in the Cart
interface Actions {
  addToCart: (item: CartProductType) => void
  updateProductQuantity: (product: CartProductType, quantity: number) => void
  removeMultipleFromCart: (items: CartProductType[]) => void
  removeFromCart: (item: CartProductType) => void
  emptyCart: () => void
  setCart: (newCart: CartProductType[]) => void
  validateAndUpdatePrices: () => Promise<void>
  convertCartPrices: (targetCurrency: Currency) => Promise<void> // New currency conversion
  getCartTotalInCurrency: (currency?: Currency) => number // Fixed: remove async
}

// Initialize a default state
const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
  baseCurrency: 'تومان', // Default base currency
  lastCurrencyUpdate: Date.now(),
}

const calculateTotals = (cart: CartProductType[]) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  return { totalItems, totalPrice }
}

// Helper function to convert prices between currencies
const convertPrice = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return amount

  // Static rates with proper typing
  const rates: Record<Currency, Record<Currency, number>> = {
    تومان: {
      dollar: 0.000023,
      euro: 0.000021,
      تومان: 1,
    },
    dollar: {
      تومان: 43000,
      euro: 0.92,
      dollar: 1,
    },
    euro: {
      تومان: 47000,
      dollar: 1.09,
      euro: 1,
    },
  }

  const sourceRates = rates[fromCurrency]
  if (!sourceRates) return amount

  const rate = sourceRates[toCurrency]
  if (rate === undefined) return amount

  return amount * rate
}

// Create the store with Zustand
export const useCartStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
      baseCurrency: INITIAL_STATE.baseCurrency,
      lastCurrencyUpdate: INITIAL_STATE.lastCurrencyUpdate,

      addToCart: (product: CartProductType) => {
        if (!product || !product.variantId) return

        const cart = get().cart

        // If product already exists in cart
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
          set({ cart: updatedCart, ...calculateTotals(updatedCart) })
        } else {
          const updatedCart = [...cart, { ...product }]
          set({ cart: updatedCart, ...calculateTotals(updatedCart) })
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
        set({ cart: updatedCart, ...calculateTotals(updatedCart) })
      },

      removeMultipleFromCart: (products: CartProductType[]) => {
        const cart = get().cart
        const variantIdsToRemove = new Set(products.map((p) => p.variantId))
        const updatedCart = cart.filter(
          (item) => !variantIdsToRemove.has(item.variantId)
        )
        set({ cart: updatedCart, ...calculateTotals(updatedCart) })
      },

      emptyCart: () => {
        set(INITIAL_STATE)

        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart')
        }
      },

      setCart: (newCart: CartProductType[]) => {
        set({ cart: newCart, ...calculateTotals(newCart) })
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
            set({ cart: finalCart, ...calculateTotals(finalCart) })
          }
        } catch (error) {
          console.error('Failed to validate cart:', error)
        }
      },

      convertCartPrices: async (targetCurrency: Currency) => {
        const cart = get().cart
        if (cart.length === 0) return

        try {
          const { baseCurrency } = get()

          // Convert each cart item to target currency
          const convertedCart = cart.map((item) => ({
            ...item,
            price: convertPrice(item.price, baseCurrency, targetCurrency),
            currency: targetCurrency,
          }))

          set({
            cart: convertedCart,
            ...calculateTotals(convertedCart),
            lastCurrencyUpdate: Date.now(),
          })
        } catch (error) {
          console.error('Failed to convert cart prices:', error)
        }
      },

      // Fixed: Remove async, return number directly
      getCartTotalInCurrency: (currency?: Currency) => {
        const { totalPrice, baseCurrency } = get()
        const targetCurrency =
          currency || useCurrencyStore.getState().currentCurrency

        if (baseCurrency === targetCurrency) return totalPrice

        const convertedPrice = convertPrice(
          totalPrice,
          baseCurrency,
          targetCurrency
        )
        return convertedPrice
      },
    }),
    {
      name: 'cart-fixed',
      partialize: (state) => ({
        cart: state.cart,
        baseCurrency: state.baseCurrency,
        lastCurrencyUpdate: state.lastCurrencyUpdate,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && typeof window !== 'undefined') {
          const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart-fixed' && e.newValue) {
              try {
                const parsed = JSON.parse(e.newValue)
                if (parsed.state) {
                  state.setCart(parsed.state.cart)
                }
              } catch (error) {
                console.warn('Failed to parse storage change:', error)
              }
            }
          }

          window.addEventListener('storage', handleStorageChange)

          return () => {
            window.removeEventListener('storage', handleStorageChange)
          }
        }
      },
    }
  )
)
