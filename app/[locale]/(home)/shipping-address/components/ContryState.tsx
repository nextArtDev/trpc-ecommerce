// app/[locale]/(home)/shipping-address/components/CountryStateSelector.tsx

'use client'
import { useQueries } from '@tanstack/react-query'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'

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
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Country } from '@/lib/generated/prisma'
import { getStatesByCountryId } from '@/lib/home/actions/location'

interface CountryStateSelectorProps {
  isPending?: boolean
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

  // Get current form values
  const currentCountryId = form.watch('countryId')
  // const currentStateId = form.watch('stateId')

  const [{ data: states, isPending: isPendingStates }] = useQueries({
    queries: [
      {
        queryKey: ['statesByCountry', currentCountryId],
        queryFn: () => {
          return currentCountryId
            ? getStatesByCountryId(currentCountryId)
            : Promise.resolve([])
        },
        enabled: !!currentCountryId,
        staleTime: 5 * 60 * 1000,
      },
    ],
  })
  // Handle country change

  const handleCountryChange = (value: string) => {
    form.setValue('countryId', value)
    // Clear state and city when country changes
    form.setValue('stateId', '')
    form.setValue('state', '')
    form.setValue('cityInt', '')
  }

  // Handle state change
  const handleStateChange = (value: string) => {
    form.setValue('stateId', value)
    // Find the selected state's name
    const selectedState = states?.find((state) => state.id === value)
    if (selectedState) {
      form.setValue('state', selectedState.name)
    }
    // Clear city when state changes
    form.setValue('cityInt', '')
  }

  // Clear dependent fields when country changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'countryId' && value.countryId !== currentCountryId) {
        form.setValue('stateId', '')
        form.setValue('state', '')
        form.setValue('cityInt', '')
      }
    })
    return () => subscription.unsubscribe()
  }, [form, currentCountryId])

  return (
    <div className={cn('w-full h-full relative', className)}>
      <div className="flex  gap-4">
        <FormField
          control={form.control}
          name="countryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('country')}</FormLabel>
              <Select
                disabled={isPending || countries?.length === 0}
                onValueChange={handleCountryChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectCountry')} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {countries?.map((country) => (
                    <SelectItem key={country.id} value={country.id}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {states && states.length > 0 ? (
          <FormField
            control={form.control}
            name="stateId"
            render={({ field }) => (
              <FormItem>
                <Select
                  disabled={
                    isPending ||
                    isPendingStates ||
                    !currentCountryId ||
                    !states ||
                    states.length === 0
                  }
                  onValueChange={handleStateChange}
                  value={field.value || ''}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t('stateProvince')} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {states?.map((state) => (
                      <SelectItem key={state.id} value={state.id}>
                        {state.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={t('stateProvincePlaceholder')}
                    disabled={isPending || !currentCountryId}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {/* City Input */}
        <FormField
          control={form.control}
          name="cityInt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('city')}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t('cityPlaceholder')}
                  disabled={isPending || !currentCountryId}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default CountryStateSelector
