'use client'
import { useQueries } from '@tanstack/react-query'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FormControl,
  FormField,
  FormItem,
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
import { Province } from '@/lib/generated/prisma'
import { getCityById, getCityByProvinceId } from '@/lib/home/actions/location'

interface ProvinceCityProps {
  isPending?: boolean
  provinceLabel?: string
  provinces: Province[]
  className?: string
}

const ProvinceCity: FC<ProvinceCityProps> = ({
  isPending = false,
  provinces,
  className,
}) => {
  const form = useFormContext()

  // Get current form values as numbers
  const currentProvinceId = form.watch('provinceId')
  const currentCityId = form.watch('cityId')

  // console.log('Form values:', {
  //   currentProvinceId,
  //   currentCityId,
  //   type: typeof currentProvinceId,
  // })

  // Use queries with proper dependencies
  const [{ data: cities, isPending: isPendingProvince }] = useQueries({
    queries: [
      {
        queryKey: ['cityByProvince', currentProvinceId],
        queryFn: () => {
          return currentProvinceId && currentProvinceId > 0
            ? getCityByProvinceId(currentProvinceId)
            : Promise.resolve([])
        },
        enabled: !!(currentProvinceId && currentProvinceId > 0),
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: ['cityById', currentCityId],
        queryFn: () => {
          return currentCityId && currentCityId > 0
            ? getCityById(currentCityId)
            : Promise.resolve(null)
        },
        enabled: !!(
          currentCityId &&
          currentCityId > 0 &&
          currentProvinceId &&
          currentProvinceId > 0
        ),
        staleTime: 5 * 60 * 1000,
      },
    ],
  })

  // Handle province change
  const handleProvinceChange = (value: string) => {
    const numericValue = parseInt(value, 10)
    // console.log('Province changed to:', numericValue)
    form.setValue('provinceId', numericValue)
    // Clear city selection when province changes
    form.setValue('cityId', 0)
  }

  // Handle city change
  const handleCityChange = (value: string) => {
    const numericValue = parseInt(value, 10)
    // console.log('City changed to:', numericValue)
    form.setValue('cityId', numericValue)
  }

  // Clear city when province changes to ensure consistency
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'provinceId' && value.provinceId !== currentProvinceId) {
        form.setValue('cityId', 0)
      }
    })
    return () => subscription.unsubscribe()
  }, [form, currentProvinceId])

  return (
    <div className={cn('w-full h-full relative', className)}>
      <div className="flex gap-4">
        <FormField
          control={form.control}
          name="provinceId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select
                disabled={isPending || provinces?.length === 0}
                onValueChange={handleProvinceChange}
                value={
                  field.value && field.value > 0 ? String(field.value) : ''
                }
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="استان" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {provinces?.map((province) => (
                    <SelectItem key={province.id} value={String(province.id)}>
                      {province.name}
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
          name="cityId"
          render={({ field }) => (
            <FormItem className="flex-1">
              <Select
                disabled={
                  isPending ||
                  isPendingProvince ||
                  !cities ||
                  cities.length === 0 ||
                  !currentProvinceId ||
                  currentProvinceId <= 0
                }
                onValueChange={handleCityChange}
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
                  {cities?.map((city) => (
                    <SelectItem key={city.id} value={String(city.id)}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}

export default ProvinceCity

// const distance = getDistance(
//   {
//     latitude: '32.390',

//     longitude: '51.400',
//   },
//   {
//     latitude: `${city?.latitude}`,
//     longitude: `${city?.longitude}`,
//   }
// )
// const isThePointWithinRadius = isPointWithinRadius(
//   {
//     latitude: '32.390',

//     longitude: '51.400',
//   },
//   {
//     latitude: `${city?.latitude}`,
//     longitude: `${city?.longitude}`,
//   },
//   500000
// )
// console.log(city?.name)
// console.log({ distance })
// console.log({ isThePointWithinRadius })
