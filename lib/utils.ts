import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { formatDistanceToNowStrict } from 'date-fns'
import * as locale from 'date-fns/locale/fa-IR'
import qs from 'query-string'
import { CartProductType } from './types/home'
import { STORE_NAME } from '@/constants/store'
import { Metadata } from 'next'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatDistanceLocale = {
  lessThanXSeconds: 'همین الان',
  xSeconds: 'همین الان',
  halfAMinute: 'همین الان',
  lessThanXMinutes: '{{count}} دقیقه',
  xMinutes: '{{count}} دقیقه',
  aboutXHours: '{{count}} ساعت',
  xHours: '{{count}} ساعت',
  xDays: '{{count}} روز',
  aboutXWeeks: '{{count}} هفته',
  xWeeks: '{{count}} هفته',
  aboutXMonths: '{{count}} ماه',
  xMonths: '{{count}} ماه',
  aboutXYears: '{{count}} سال',
  xYears: '{{count}} سال',
  overXYears: '{{count}} سال',
  almostXYears: '{{count}} سال',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatDistance(token: string, count: number, options?: any): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return '' + result
    } else {
      if (result === 'همین الان') return result
      return result + ' پیش '
    }
  }

  return result
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}

export interface Schedule {
  time: string | null

  day: string | null
}

export const getCurrentStartOfDay = (schedule: Schedule[]): Date => {
  const today = new Date()

  const currentDay = today
    .toLocaleString('en-US', { weekday: 'long' })
    .toLowerCase()

  const foundSchedule = schedule.find((item) => item.day === currentDay)

  if (foundSchedule && foundSchedule.time) {
    const [hours, minutes] = foundSchedule.time.split(':').map(Number)

    today.setHours(hours, minutes, 0, 0)
  } else {
    today.setHours(0, 0, 0, 0)
  }

  return today
}

export const getCurrentTime = (): string => {
  const now = new Date()
  const hours: string = String(now.getHours()).padStart(2, '0')
  const minutes: string = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

export const compareTimeStrings = (time1: string, time2: string) => {
  const [hour1, minute1] = time1.split(':').map(Number)
  const [hour2, minute2] = time2.split(':').map(Number)

  return hour1 > hour2 || (hour1 === hour2 && minute1 > minute2)
}

//Query string for pagination
interface UrlQueryParams {
  params: string
  key: string
  value: string | null
}
export const formUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  // accessing the current url
  const currentUrl = qs.parse(params)
  // query-string package automatically gives you the search params

  // it only updates the one we want to update, while keeping everything else the same in component's useState
  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      // base url
      url: window.location.pathname,
      // current url
      query: currentUrl,
    },
    // options: we don't need null values
    { skipNull: true }
  )
}

// Cart
export const isProductValidToAdd = (product: CartProductType): boolean => {
  const {
    productId,
    name,
    image,
    quantity,
    price,
    variantId,
    size,
    stock,
    weight,
  } = product

  return !!(
    productId?.trim() &&
    name?.trim() &&
    image?.trim() &&
    quantity > 0 &&
    price > 0 &&
    variantId?.trim() &&
    size?.trim() &&
    stock > 0 &&
    weight > 0
  )
}

export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // abbreviated month name (e.g., 'Oct')
    day: 'numeric', // numeric day of the month (e.g., '25')
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
    month: 'short', // abbreviated month name (e.g., 'Oct')
    year: 'numeric', // numeric year (e.g., '2023')
    day: 'numeric', // numeric day of the month (e.g., '25')
  }
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric', // numeric hour (e.g., '8')
    minute: 'numeric', // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  }
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'fa-IR',
    dateTimeOptions
  )
  const formattedDate: string = new Date(dateString).toLocaleString(
    'fa-IR',
    dateOptions
  )
  const formattedTime: string = new Date(dateString).toLocaleString(
    'fa-IR',
    timeOptions
  )
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    )

    return fieldErrors.join('. ')
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle Prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field'
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message)
  }
}

// export async function generateSearchMetadata(searchParams: {
//   q?: string
//   categoryId?: string
//   minPrice?: string
//   maxPrice?: string
// }) {
//   const { q, categoryId, minPrice, maxPrice } = searchParams

//   const titleParts = []

//   if (q) titleParts.push(`جستجو: ${q}`)
//   if (categoryId) titleParts.push(`دسته‌بندی`)
//   if (minPrice || maxPrice) titleParts.push(`فیلتر قیمت`)

//   const title =
//     titleParts.length > 0
//       ? titleParts.join(' | ') + ' - فروشگاه'
//       : 'جستجو و فیلتر محصولات - فروشگاه'

//   return {
//     title,
//     description: 'جستجو، فیلتر و مرتب‌سازی محصولات با بهترین قیمت و کیفیت',
//   }
// }

export async function generateSearchMetadata(params: {
  q?: string
  categoryId?: string
  subCategoryId?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  page?: string
  colors?: string | string[]
  sizes?: string | string[]
}): Promise<Metadata> {
  const query = params.q || ''
  const page = Number(params.page) || 1
  const isSearch = !!query

  // Build dynamic title and description
  let title = ''
  let description = ''
  let keywords: string[] = []

  if (isSearch) {
    title = `"${query} نتایج جست‌وجوی"${
      page > 1 ? ` ${page} - صفحه ` : ''
    } | ${STORE_NAME}`
    description = `"${query}" پیدا کردن بهترین نتایج برای.`
    keywords = [
      query,
      'جست‌وجو',
      'محصولات',
      'فروشگاه چرم آنلاین',
      'فروشگاه چرم',
    ]
  } else {
    title = `محصولات${page > 1 ? ` - Page ${page}` : ''} | ${STORE_NAME}`
    description = 'جست‌وجوی محصولات کامل فروشگاه'
    // 'Discover our complete product collection. Filter by category, price, color, and size to find exactly what you need.'
    keywords = [
      'چرم طبیعی',
      'کیف چرمی',
      'خرید آنلاین',
      'فروشگاه چرم',
      'فروشگاه چرم',
    ]
  }

  // Add filter-based keywords
  if (params.colors) {
    const colors = Array.isArray(params.colors)
      ? params.colors
      : [params.colors]
    keywords.push(...colors.map((c) => `محصولات${c} `))
  }

  if (params.sizes) {
    const sizes = Array.isArray(params.sizes) ? params.sizes : [params.sizes]
    keywords.push(...sizes.map((s) => `  ${s}سایز`))
  }

  const currentUrl = new URL(
    `${process.env.NEXT_PUBLIC_SITE_URL}/products` || 'localhost:3000/products'
    // `localhost:3000/products`
  )
  Object.entries(params).forEach(([key, value]) => {
    if (value) currentUrl.searchParams.set(key, String(value))
  })

  return {
    title,
    description,
    keywords: keywords.join(', '),

    openGraph: {
      type: 'website',
      title: isSearch ? `${query}جست‌وجوی: ` : 'محصولات',
      description,
      url: currentUrl.toString(),
      siteName: `${STORE_NAME}`,
      images: ['/default-search-og.jpg'], // Add a default search page image
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/default-search-twitter.jpg'],
    },

    robots: {
      index: page === 1, // Only index page 1
      follow: true,
      googleBot: {
        index: page === 1,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    alternates: {
      canonical: page === 1 ? currentUrl.toString() : undefined, // Only canonical for page 1
    },

    other: {
      'search-query': query || '',
      'page-number': page.toString(),
      'results-type': isSearch ? 'search' : 'catalog',
    },
  }
}

// utils/rateLimit.ts
import prisma from '@/lib/prisma'

export async function checkRateLimit(userId: string) {
  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60)

  const count = await prisma.paymentRateLimit.count({
    where: { userId, createdAt: { gte: oneHourAgo } },
  })

  if (count >= 10) {
    throw new Error(
      'تعداد درخواست‌ها بیش از حد مجاز است، لطفا چند دقیقه بعد دوباره امتحان کنید.'
    )
  }

  await prisma.paymentRateLimit.create({ data: { userId } })
}
