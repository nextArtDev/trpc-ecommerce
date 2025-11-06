import { getExchangeRates } from '@/app/(dashboard)/dashboard/lib/actions/exchanges'
import { Currency, CURRENCY_INFO } from '@/lib/types/home'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CurrencyState {
  currentCurrency: Currency
  exchangeRates: Record<Currency, Record<Currency, number>>
  isLoading: boolean
  lastUpdated: Date | null
  setCurrency: (currency: Currency) => void
  setExchangeRates: (rates: Record<Currency, Record<Currency, number>>) => void
  fetchExchangeRatesFromDB: () => Promise<void>
  formatPrice: (amount: number) => string
  convertCurrency: (
    amount: number,
    fromCurrency: Currency,
    toCurrency: Currency
  ) => number
}

// Fixed exchange rates with proper typing
const DEFAULT_EXCHANGE_RATES: Record<Currency, Record<Currency, number>> = {
  تومان: {
    dollar: 0.000023,
    euro: 0.000021,
    تومان: 1, // Add self-reference
  },
  dollar: {
    تومان: 43000,
    euro: 0.92,
    dollar: 1, // Add self-reference
  },
  euro: {
    تومان: 47000,
    dollar: 1.09,
    euro: 1, // Add self-reference
  },
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currentCurrency: 'تومان',
      exchangeRates: DEFAULT_EXCHANGE_RATES,
      isLoading: false,
      lastUpdated: null,

      setCurrency: (currency: Currency) => {
        set({ currentCurrency: currency })
      },

      setExchangeRates: (rates: Record<Currency, Record<Currency, number>>) => {
        set({
          exchangeRates: rates,
          lastUpdated: new Date(), // Always store a Date object
        })
      },

      fetchExchangeRatesFromDB: async () => {
        const { isLoading } = get()
        if (isLoading) return

        set({ isLoading: true })

        try {
          const data = await getExchangeRates()

          if (data.success && data.rates) {
            const { rates } = data

            const exchangeRates: Record<Currency, Record<Currency, number>> = {
              تومان: {
                dollar: 1 / rates.dollarToToman,
                euro: 1 / rates.euroToToman,
                تومان: 1,
              },
              dollar: {
                تومان: rates.dollarToToman,
                euro: rates.dollarToToman / rates.euroToToman,
                dollar: 1,
              },
              euro: {
                تومان: rates.euroToToman,
                dollar: rates.euroToToman / rates.dollarToToman,
                euro: 1,
              },
            }

            set({
              exchangeRates,
              lastUpdated: new Date(), // Store a new Date object
              isLoading: false,
            })
          } else {
            console.error('Failed to fetch exchange rates')
            set({ isLoading: false })
          }
        } catch (error) {
          console.error('Error fetching exchange rates:', error)
          set({ isLoading: false })
        }
      },

      formatPrice: (amount: number) => {
        const { currentCurrency } = get()
        const currencyInfo = CURRENCY_INFO[currentCurrency]

        const formattedAmount = new Intl.NumberFormat(currencyInfo.locale, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(amount)

        return `${formattedAmount} ${currencyInfo.symbol}`
      },

      convertCurrency: (
        amount: number,
        fromCurrency: Currency,
        toCurrency: Currency
      ) => {
        if (fromCurrency === toCurrency) return amount

        const { exchangeRates } = get()
        const sourceRates = exchangeRates[fromCurrency]
        if (!sourceRates) return amount

        const rate = sourceRates[toCurrency]
        if (rate === undefined) return amount

        return amount * rate
      },
    }),
    {
      name: 'currency-storage',
      partialize: (state) => ({
        currentCurrency: state.currentCurrency,
        exchangeRates: state.exchangeRates,
        lastUpdated: state.lastUpdated, // Persist the date
      }),
      // THIS IS THE KEY FIX:
      onRehydrateStorage: () => (state) => {
        // console.log('Currency store rehydrated', state)
        if (
          state &&
          state.lastUpdated &&
          typeof state.lastUpdated === 'string'
        ) {
          // Convert the string from localStorage back to a Date object
          state.lastUpdated = new Date(state.lastUpdated)
        }
      },
    }
  )
)

// The standalone sync function is still useful for manual refreshes
export async function syncExchangeRatesFromDB() {
  try {
    const data = await getExchangeRates()
    if (data.success && data.rates) {
      const { rates } = data
      const exchangeRates: Record<Currency, Record<Currency, number>> = {
        تومان: {
          dollar: 1 / rates.dollarToToman,
          euro: 1 / rates.euroToToman,
          تومان: 1,
        },
        dollar: {
          تومان: rates.dollarToToman,
          euro: rates.dollarToToman / rates.euroToToman,
          dollar: 1,
        },
        euro: {
          تومان: rates.euroToToman,
          dollar: rates.euroToToman / rates.dollarToToman,
          euro: 1,
        },
      }
      useCurrencyStore.getState().setExchangeRates(exchangeRates)
      return { success: true, rates: exchangeRates }
    }
    return { success: false, rates: DEFAULT_EXCHANGE_RATES }
  } catch (error) {
    console.error('Failed to sync exchange rates:', error)
    return { success: false, rates: DEFAULT_EXCHANGE_RATES }
  }
}
