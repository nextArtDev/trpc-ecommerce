//https://github.com/stefanbinder/countries-states
'use client'
import { useQueries } from '@tanstack/react-query'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Country } from '@/lib/generated/prisma'
import { getStateByCountryId, getStateById } from '@/lib/home/actions/location'
import { useTranslations } from 'next-intl'

interface CountryStateSelectorProps {
  isPending?: boolean
  countryLabel?: string
  countries: Country[]
  className?: string
}
const CountryStateSelector: FC<CountryStateSelectorProps> = ({
  isPending = false,
  countries,
  className,
}) => {
  const t = useTranslations('shipping')

  const form = useFormContext()

  // Get current form values as numbers
  const currentCountryId = form.watch('countryId')
  const currentStateId = form.watch('stateId')
  const currentState = form.watch('state')

  const [{ data: states, isPending: isPendingCountry }] = useQueries({
    queries: [
      {
        queryKey: ['stateByCountry', currentCountryId],
        queryFn: () => {
          return currentCountryId && currentCountryId > 0
            ? getStateByCountryId(currentCountryId)
            : Promise.resolve([])
        },
        enabled: !!(currentCountryId && currentCountryId > 0),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['stateById', currentStateId],
        queryFn: () => {
          return currentStateId && currentStateId > 0
            ? getStateById(currentStateId)
            : Promise.resolve(null)
        },
        enabled: !!(
          currentStateId &&
          currentStateId > 0 &&
          currentCountryId &&
          currentCountryId > 0
        ),
        staleTime: 5 * 60 * 1000,
      },
    ],
  })

  // Handle country change
  const handleCountryChange = (value: string) => {
    const numericValue = parseInt(value, 10)
    // console.log('Country changed to:', numericValue)
    form.setValue('countryId', numericValue)
    // Clear state selection when country changes
    form.setValue('stateId', 0)
    form.setValue('state', '')
  }

  // Handle state change
  const handleStateChange = (value: string) => {
    const numericValue = parseInt(value, 10)
    // console.log('State changed to:', numericValue)
    form.setValue('stateId', numericValue)
    form.setValue('state', value)
  }

  // Clear state when country changes to ensure consistency
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'countryId' && value.countryId !== currentCountryId) {
        form.setValue('stateId', 0)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, currentCountryId])

  return (
    <div className={cn('w-full h-full relative', className)}>
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>{t('country')}</FormLabel>
              <Select
                disabled={isPending || countries?.length === 0}
                onValueChange={handleCountryChange}
                value={
                  field.value && field.value > 0 ? String(field.value) : ''
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCountry')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country.id} value={String(country.id)}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="stateId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select
                disabled={
                  isPending ||
                  isPendingCountry ||
                  !states ||
                  states.length === 0 ||
                  !currentCountryId ||
                  currentCountryId <= 0
                }
                onValueChange={handleStateChange}
                value={
                  field.value && field.value > 0 ? String(field.value) : ''
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="شهرستان" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {states?.map((state) => (
                    <SelectItem key={state.id} value={String(state.id)}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* State/Province Input for International Addresses */}
        {/* <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('stateProvince')}</FormLabel>
              <FormControl>
                <Input placeholder={t('stateProvincePlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        {/* City Input for International Addresses */}
        {/* <FormField
          control={form.control}
          name="cityInt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('city')}</FormLabel>
              <FormControl>
                <Input placeholder={t('cityPlaceholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      </div>
    </div>
  )
}

export default CountryStateSelector
