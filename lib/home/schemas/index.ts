import { AddressType } from '@/lib/generated/prisma'
import { OrderStatus } from '@/lib/types/home'
import { z } from 'zod'

export const ReviewFormSchema = z.object({
  title: z
    .string()
    .min(2, { message: 'عنوان نباید کمتر از 2 حرف باشد!' })
    .max(20, { message: 'عنوان نباید بیشتر از 20 حرف باشد' }),
  description: z
    .string()
    .min(3, { message: 'توضیحات نمی‌تواند کمتر از 3 حرف باشد.' })
    .max(200, { message: 'توضیحات نمی‌تواند بیشتر از 200 حرف باشد.' }),
  rating: z
    .number()
    .int()
    .min(1, { message: 'ستاره باید حداقل 1 باشد.' })
    .max(5, { message: 'ستاره‌ها باید حداکثر 5 باشد.' }),
})
// export const shippingAddressSchema = z.object({
//   name: z
//     .string({ message: 'نام و نام‌خانوادگی نمی‌تواند خالی باشد.' })
//     .min(2, { message: 'نام و نام‌خانوادگی باید حداقل 2 کاراکتر باشد.' })
//     .max(50, { message: 'نام باید حداکثر 50 کاراکتر باشد.' }),

//   address1: z
//     .string({ message: '  آدرس نمی‌تواند خالی باشد.' })
//     .min(10, { message: 'آدرس حداقل باید 10 کاراکتر باشد.' })
//     .max(100, { message: 'آدرس حداکثر باید 100 کاراکتر باشد.' }),

//   cityId: z.number().min(1, { message: 'نام شهر نمی‌تواند خالی باشد.' }),
//   provinceId: z.number().min(1, { message: 'استان نمی‌تواند خالی باشد.' }),
//   zip_code: z
//     .string({ message: 'کدپستی نمی‌تواند خالی باشد.' })
//     .min(10, { message: 'کدپستی باید 10 رقمی باشد.' }),
// })

//Payment

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  // url: z.string(),
  authority: z.string(),
  // status: z.string(),
  fee: z.string(),
})
export type PaymentResult = z.infer<typeof paymentResultSchema>

export const UpdateOrderStatusFormSchema = z.object({
  status: z.enum(OrderStatus),
})

export const updateProfileSchema = z.object({
  name: z.string(),
  phoneNumber: z.string().optional(),
})

const iranianAddressSchema = z.object({
  name: z.string().min(1, 'Recipient name is required'),
  addressType: z.literal(AddressType.IRANIAN),
  provinceId: z.number().min(1, 'Province is required'),
  cityId: z.number().min(1, 'City is required'),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  zip_code: z.string().min(1, 'Postal code is required'),
})

// International address schema
const internationalAddressSchema = z.object({
  name: z.string().min(1, 'Recipient name is required'),
  addressType: z.literal(AddressType.INTERNATIONAL),
  countryId: z.string().min(1, 'Country is required'),
  stateId: z.string().optional(),
  state: z.string().min(1, 'State/Province is required'),
  cityInt: z.string().min(1, 'City is required'),
  address1: z.string().min(1, 'Address is required'),
  address2: z.string().optional(),
  zip_code: z.string().optional(),
})

export const shippingAddressSchema = z.discriminatedUnion('addressType', [
  iranianAddressSchema,
  internationalAddressSchema,
])
