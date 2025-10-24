'use server'

import prisma from '@/lib/prisma'

export const getCityByProvinceId = async (provinceId: string | number) => {
  try {
    // Convert to number and validate
    const numericProvinceId =
      typeof provinceId === 'string' ? parseInt(provinceId, 10) : provinceId

    if (!provinceId || isNaN(numericProvinceId) || numericProvinceId <= 0) {
      return []
    }

    const cities = await prisma.city.findMany({
      where: {
        provinceId: numericProvinceId,
      },
      orderBy: {
        id: 'asc',
      },
    })

    return cities
  } catch (error) {
    console.error('getCityByProvinceId error:', error)
    return []
  }
}

export const getCityById = async (cityId: string | number) => {
  try {
    // Convert to number and validate
    const numericCityId =
      typeof cityId === 'string' ? parseInt(cityId, 10) : cityId

    if (!cityId || isNaN(numericCityId) || numericCityId <= 0) {
      return null
    }

    const city = await prisma.city.findFirst({
      where: {
        id: numericCityId,
      },
    })

    return city
  } catch (error) {
    console.error('getCityById error:', error)
    return null
  }
}

export const getProvinceById = async (provinceId: string | number) => {
  try {
    // Convert to number and validate
    const numericProvinceId =
      typeof provinceId === 'string' ? parseInt(provinceId, 10) : provinceId

    if (!provinceId || isNaN(numericProvinceId) || numericProvinceId <= 0) {
      return null
    }

    const province = await prisma.province.findFirst({
      where: {
        id: numericProvinceId,
      },
    })

    return province
  } catch (error) {
    console.log('getProvinceById error:', error)
    return null
  }
}
// export async function getProvinces() {
//   const apiKey = process.env.POSTEX_API_KEY
//   try {
//     const response = await fetch(
//       'https://api.postex.ir/api/v1/locality/provinces',
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     )

//     if (!response.ok) {
//       throw new Error('Failed to fetch provinces')
//     }

//     const data = await response.json()

//     return data
//   } catch (error) {
//     console.error(error)
//     return []
//   }
// }

// export async function getCityByProvinceCode(provinceCode: number) {
//   const apiKey = process.env.POSTEX_API_KEY
//   try {
//     const response = await fetch(
//       `https://api.postex.ir/api/v1/locality/cities/${provinceCode}`,
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     )

//     if (!response.ok) {
//       throw new Error('Failed to fetch provinces')
//     }

//     const data = await response.json()

//     return data
//   } catch (error) {
//     return console.error(error)
//   }
// }
// export async function getCityByCode(cityCode: number) {
//   const apiKey = process.env.POSTEX_API_KEY
//   try {
//     const response = await fetch(
//       `https://api.postex.ir/api/v1/locality/cities/${cityCode}`,
//       {
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     )

//     if (!response.ok) {
//       throw new Error('Failed to fetch provinces')
//     }

//     const data = await response.json()

//     return data
//   } catch (error) {
//     console.error(error)
//     return []
//   }
// }

// // Calculation Price
// interface ParcelProperties {
//   length: number
//   width: number
//   height: number
//   total_weight: number
//   is_fragile: boolean
//   is_liquid: boolean
//   total_value: number
//   pre_paid_amount: number
//   total_value_currency: string
//   box_type_id: number
// }

// /**
//  * Represents a single parcel in the shipping request.
//  */
// interface Parcel {
//   custom_parcel_id: string
//   to_city_code: number
//   payment_type: string
//   parcel_properties: ParcelProperties // Updated to use the detailed interface
// }

// /**
//  * Represents the courier and service type.
//  */
// interface Courier {
//   courier_code: string
//   service_type: string
// }

// interface ValueAddedService {
//   insurance?: {
//     amount: number
//     currency: string
//   }
//   cod?: {
//     enabled: boolean
//     amount: number
//     currency: string
//   }
// }

// interface ShippingQuotePayload {
//   from_city_code: number
//   pickup_needed: boolean
//   courier: Courier
//   parcels: Parcel[]
//   ValueAddedService: ValueAddedService // تغییر نام فیلد
// }

// /**
//  * Defines the structure for the expected API response.
//  */
// interface ShippingQuoteResponse {
//   success: boolean
//   data: {
//     price: number
//   }[]
//   message?: string
// }

// /**
//  * A Next.js server action to calculate the shipping price using the PostEx API.
//  * @param payload - The data for the shipping quote request.
//  * @returns A promise that resolves to the API response or an error object.
//  */
// export async function calculateShippingPrice(
//   payload: ShippingQuotePayload
// ): Promise<{ success: boolean; data?: any; error?: string }> {
//   const apiKey = process.env.POSTEX_API_KEY

//   if (!apiKey) {
//     console.error('API key for PostEx is not configured.')
//     return {
//       success: false,
//       error: 'Server configuration error: Missing API key.',
//     }
//   }

//   const apiUrl = 'https://api.postex.ir/api/app/v1/shipping/quotes'

//   try {
//     console.log('Payload sent to PostEx:', JSON.stringify(payload, null, 2))
//     const response = await fetch(apiUrl, {
//       method: 'POST',
//       headers: {
//         Authorization: `Bearer ${apiKey}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     })

//     const responseBody = await response.text()
//     console.log('API response:', response.status, responseBody)

//     if (!response.ok) {
//       const errorData = JSON.parse(responseBody)
//       console.error('API request failed:', response.status, errorData)
//       return {
//         success: false,
//         error:
//           errorData?.message ||
//           `API request failed with status ${response.status}`,
//       }
//     }

//     const data: ShippingQuoteResponse = JSON.parse(responseBody)
//     return { success: true, data }
//   } catch (error) {
//     console.error('An unexpected error occurred:', error)
//     return {
//       success: false,
//       error: 'An unexpected error occurred. Please try again.',
//     }
//   }
// }
