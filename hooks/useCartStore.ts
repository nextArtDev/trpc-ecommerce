import { fetchCurrentPricesAndStock } from '@/lib/home/actions/cart'
import { CartProductType } from '@/lib/types/home'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
// Define the interface of the Cart state
interface State {
  cart: CartProductType[]
  totalItems: number
  totalPrice: number
}

// Define the interface of the actions that can be performed in the Cart
interface Actions {
  addToCart: (Item: CartProductType) => void
  updateProductQuantity: (product: CartProductType, quantity: number) => void // New quantity update action
  removeMultipleFromCart: (items: CartProductType[]) => void // Multiple products removal
  removeFromCart: (Item: CartProductType) => void // Single product removal
  emptyCart: () => void // Empty cart
  setCart: (newCart: CartProductType[]) => void // Added setCart method
  validateAndUpdatePrices: () => Promise<void>
}

// Initialize a default state
const INITIAL_STATE: State = {
  cart: [],
  totalItems: 0,
  totalPrice: 0,
}

const calculateTotals = (cart: CartProductType[]) => {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  return { totalItems, totalPrice }
}
// Create the store with Zustand, combining the status interface and actions with persisted data
export const useCartStore = create(
  persist<State & Actions>(
    (set, get) => ({
      cart: INITIAL_STATE.cart,
      totalItems: INITIAL_STATE.totalItems,
      totalPrice: INITIAL_STATE.totalPrice,
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
                } // Prevent adding more than stock
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

        // If quantity is 0 or less, remove the item
        if (quantity <= 0) {
          get().removeFromCart(product)
          return
        }

        const updatedCart = cart.map((item) =>
          item.variantId === product.variantId
            ? { ...item, quantity: Math.min(quantity, item.stock) } // Prevent setting more than stock
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

        // Manually sync with localStorage after removal
        if (typeof window !== 'undefined') {
          localStorage.setItem('cart', JSON.stringify(updatedCart))
        }
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

        localStorage.removeItem('cart')
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
              // ✅ CHANGE: Find current data by variantId
              const currentVariant = currentData.find(
                (data) => data.variantId === item.variantId
              )

              // If variant was deleted from DB, it will be removed
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
    }),
    {
      name: 'cart',
      // Add storage event listener for cross-tab synchronization
      onRehydrateStorage: () => (state) => {
        // This runs after the store is rehydrated from localStorage
        if (state && typeof window !== 'undefined') {
          // Listen for storage changes from other tabs
          const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'cart' && e.newValue) {
              try {
                const parsed = JSON.parse(e.newValue)
                if (parsed.state) {
                  // Update the store with the new state from other tab
                  state.setCart(parsed.state.cart)
                }
              } catch (error) {
                console.warn('Failed to parse storage change:', error)
              }
            }
          }

          window.addEventListener('storage', handleStorageChange)

          // Cleanup function
          return () => {
            window.removeEventListener('storage', handleStorageChange)
          }
        }
      },
    }
  )
)
