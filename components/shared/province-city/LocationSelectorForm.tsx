// 'use client'
// import { handleServerErrors } from '@/app/(dashboard)/dashboard/lib/server-utils'
// import { Button } from '@/components/ui/button'
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from '@/components/ui/command'
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from '@/components/ui/popover'
// import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
// import {
//   calculateShipping,
//   calculateShippingPrice,
//   compareShippingPrices,
//   getCityByCode,
//   getCityByProvinceCode,
//   getShippingQuote,
// } from '@/lib/home/actions/location'
// import { cn } from '@/lib/utils'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { useQueries } from '@tanstack/react-query'
// import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'
// import { useState, useTransition } from 'react'
// import { useForm } from 'react-hook-form'
// import { toast } from 'sonner'
// import { z } from 'zod'

// interface City {
//   city_name: string
//   city_code: number
// }

// interface Province {
//   province_name: string
//   province_code: number
// }

// interface LocationSelectorFormProps {
//   provinces: Province[]
// }

// const formSchema = z.object({
//   province_code: z.string().min(1, 'Province is required'),
//   city_code: z.string().min(1, 'City is required'),
// })

// const LocationSelectorForm = ({ provinces }: LocationSelectorFormProps) => {
//   const [openProvince, setOpenProvince] = useState(false)
//   const [openCity, setOpenCity] = useState(false)
//   const [isPending, startTransition] = useTransition()

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       province_code: '',
//       city_code: '',
//     },
//   })

//   const watchedProvinceCode = form.watch('province_code')
//   const watchedCityCode = form.watch('city_code')

//   const [{ data: cities, isPending: citiesLoading }, { data: cityDetails }] =
//     useQueries({
//       queries: [
//         {
//           queryKey: ['cityByProvince', watchedProvinceCode],
//           queryFn: async () => {
//             if (!watchedProvinceCode) return []
//             return await getCityByProvinceCode(Number(watchedProvinceCode))
//           },
//           enabled: !!watchedProvinceCode,
//           staleTime: 5 * 60 * 1000, // 5 minutes
//         },
//         {
//           queryKey: ['cityById', watchedCityCode],
//           queryFn: async () => {
//             if (!watchedCityCode) return null
//             return await getCityByCode(Number(watchedCityCode))
//           },
//           enabled: !!watchedCityCode,
//           staleTime: 5 * 60 * 1000, // 5 minutes
//         },
//       ],
//     })

//   // Find selected province and city for display
//   const selectedProvince = provinces.find(
//     (province) => province.province_code.toString() === watchedProvinceCode
//   )

//   const selectedCity = cities?.find(
//     (city: City) => city.city_code.toString() === watchedCityCode
//   )

//   const handleProvinceSelect = (province: Province) => {
//     form.setValue('province_code', province.province_code.toString())
//     form.setValue('city_code', '') // Reset city when province changes
//     setOpenProvince(false)
//   }

//   const handleCitySelect = (city: City) => {
//     form.setValue('city_code', city.city_code.toString())
//     setOpenCity(false)
//   }

//   function onSubmit(values: z.infer<typeof formSchema>) {
//     // دزفول 18 -> 236
//     startTransition(async () => {
//       //   const res = await compareShippingPrices({
//       //     fromCityCode: 236,
//       //     toCityCode: +values.city_code,
//       //     dimensions: { height: 50, width: 15, length: 60 },
//       //     weight: 450,
//       //     value: 4500000,
//       //   })
//       //   console.log(res)
//       //   const result = await getShippingQuote(
//       //     'post',
//       //     123, // from city code
//       //     456, // to city code
//       //     1500, // weight in grams
//       //     { height: 10, width: 15, length: 20 }, // dimensions in cm
//       //     50000 // value in rials (optional)
//       //   )
//       const result = await calculateShippingPrice({
//         from_city_code: Number(236),
//         pickup_needed: true,
//         courier: {
//           courier_code: 'POST',
//           service_type: 'standard',
//         },
//         ValueAddedService: {
//           // یا آرایه: []
//           //   insurance: {
//           //     amount: 5000000,
//           //     currency: 'IRR',
//           //   },
//           cod: {
//             enabled: false,
//             amount: 0,
//             currency: 'IRR',
//           },
//         },
//         parcels: [
//           {
//             custom_parcel_id: 'parcel_123',
//             to_city_code: Number(189),
//             payment_type: 'prepaid',
//             parcel_properties: {
//               length: Number(56),
//               width: Number(56),
//               height: Number(45),
//               total_weight: Number(1500),
//               is_fragile: false,
//               is_liquid: false,
//               total_value: Number(5000000),
//               pre_paid_amount: 0,
//               total_value_currency: 'IRR',
//               box_type_id: 0,
//             },
//           },
//         ],
//       })

//       //   if (result.success) {
//       //     console.log('Shipping price:', result.data)
//       //   } else {
//       //     console.error('Error:', result.error)
//       //   }

//       console.log(result)

//       try {
//         const submitData = {
//           province_code: values.province_code,
//           province_name: selectedProvince?.province_name,
//           city_code: values.city_code,
//           city_name: selectedCity?.city_name,
//         }
//         console.log(values)
//         console.log(submitData)
//         toast.success('Location selected successfully!', {
//           description: `${selectedProvince?.province_name} - ${selectedCity?.city_name}`,
//         })
//       } catch (error) {
//         console.error('Form submission error', error)
//         toast.error('Failed to submit the form. Please try again.')
//       }
//     })
//   }

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(onSubmit)}
//         className="space-y-6 max-w-md mx-auto"
//       >
//         <div className="flex gap-8 w-full">
//           {/* Province Selector */}

//           <FormField
//             control={form.control}
//             name="province_code"
//             render={({ field }) => (
//               <FormItem className="space-y-2">
//                 <FormLabel>Province</FormLabel>
//                 <Popover open={openProvince} onOpenChange={setOpenProvince}>
//                   <PopoverTrigger asChild>
//                     <FormControl>
//                       <Button
//                         variant="outline"
//                         role="combobox"
//                         aria-expanded={openProvince}
//                         disabled={provinces.length === 0}
//                         className={cn(
//                           'w-full justify-between',
//                           !field.value && 'text-muted-foreground'
//                         )}
//                       >
//                         {selectedProvince
//                           ? selectedProvince.province_name
//                           : 'Select Province'}
//                         <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                       </Button>
//                     </FormControl>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-full p-0" align="start">
//                     <Command>
//                       <CommandInput placeholder="Search province..." />
//                       <CommandList>
//                         <CommandEmpty>No province found.</CommandEmpty>
//                         <CommandGroup>
//                           <ScrollArea className="h-[300px]">
//                             {provinces.map((province) => (
//                               <CommandItem
//                                 key={province.province_code}
//                                 value={province.province_name}
//                                 onSelect={() => handleProvinceSelect(province)}
//                                 className="flex cursor-pointer items-center justify-between text-sm"
//                               >
//                                 {province.province_name}
//                                 <Check
//                                   className={cn(
//                                     'ml-auto h-4 w-4',
//                                     selectedProvince?.province_code ===
//                                       province.province_code
//                                       ? 'opacity-100'
//                                       : 'opacity-0'
//                                   )}
//                                 />
//                               </CommandItem>
//                             ))}
//                             <ScrollBar orientation="vertical" />
//                           </ScrollArea>
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* City Selector */}
//           {watchedProvinceCode && (
//             <FormField
//               control={form.control}
//               name="city_code"
//               render={({ field }) => (
//                 <FormItem className="space-y-2">
//                   <FormLabel>City</FormLabel>
//                   <Popover open={openCity} onOpenChange={setOpenCity}>
//                     <PopoverTrigger asChild>
//                       <FormControl>
//                         <Button
//                           variant="outline"
//                           role="combobox"
//                           aria-expanded={openCity}
//                           disabled={
//                             citiesLoading ||
//                             !watchedProvinceCode ||
//                             !cities?.length
//                           }
//                           className={cn(
//                             'w-full justify-between',
//                             !field.value && 'text-muted-foreground'
//                           )}
//                         >
//                           {citiesLoading ? (
//                             <div className="flex items-center gap-2">
//                               <Loader2 className="h-4 w-4 animate-spin" />
//                               Loading cities...
//                             </div>
//                           ) : selectedCity ? (
//                             selectedCity.city_name
//                           ) : (
//                             'Select City'
//                           )}
//                           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//                         </Button>
//                       </FormControl>
//                     </PopoverTrigger>
//                     <PopoverContent className="w-full p-0" align="start">
//                       <Command>
//                         <CommandInput placeholder="Search city..." />
//                         <CommandList>
//                           <CommandEmpty>No city found.</CommandEmpty>
//                           <CommandGroup>
//                             <ScrollArea className="h-[300px]">
//                               {cities?.map((city: City) => (
//                                 <CommandItem
//                                   key={city.city_code}
//                                   value={city.city_name}
//                                   onSelect={() => handleCitySelect(city)}
//                                   className="flex cursor-pointer items-center justify-between text-sm"
//                                 >
//                                   {city.city_name}
//                                   <Check
//                                     className={cn(
//                                       'ml-auto h-4 w-4',
//                                       selectedCity?.city_code === city.city_code
//                                         ? 'opacity-100'
//                                         : 'opacity-0'
//                                     )}
//                                   />
//                                 </CommandItem>
//                               ))}
//                               <ScrollBar orientation="vertical" />
//                             </ScrollArea>
//                           </CommandGroup>
//                         </CommandList>
//                       </Command>
//                     </PopoverContent>
//                   </Popover>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           )}
//         </div>

//         {/* Submit Button */}
//         <Button
//           type="submit"
//           className="w-full"
//           disabled={citiesLoading || !watchedProvinceCode || !watchedCityCode}
//         >
//           {citiesLoading ? (
//             <div className="flex items-center gap-2">
//               <Loader2 className="h-4 w-4 animate-spin" />
//               Loading...
//             </div>
//           ) : (
//             'Submit'
//           )}
//         </Button>

//         {/* Selected Information Display */}
//         {selectedProvince && selectedCity && (
//           <div className="mt-4 p-4 bg-muted rounded-lg">
//             <h3 className="font-medium mb-2">Selected Location:</h3>
//             <p className="text-sm text-muted-foreground">
//               {selectedProvince.province_name} - {selectedCity.city_name}
//             </p>
//           </div>
//         )}
//       </form>
//     </Form>
//   )
// }

// export default LocationSelectorForm
