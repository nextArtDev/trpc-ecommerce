import { AddressType } from './generated/prisma'
import { Currency } from './types/home'

type CityInfo = {
  province: string
  city: string
}

type ShippingInput = {
  origin: CityInfo
  destination: CityInfo
  weightGrams: number
  valueRial: number
  dimensions?: { length: number; width: number; height: number } // cm
  packaging?: number
  currency: Currency
  addressType: AddressType
}

const provinceAdjacency: Record<string, string[]> = {
  'آذربایجان شرقی': ['آذربایجان غربی', 'اردبیل', 'زنجان'],
  'آذربایجان غربی': ['آذربایجان شرقی', 'کردستان', 'زنجان'],
  اردبیل: ['آذربایجان شرقی', 'زنجان', 'گیلان'],
  اصفهان: [
    'یزد',
    'فارس',
    'کهگیلویه و بویراحمد',
    'چهارمحال و بختیاری',
    'لرستان',
    'مرکزی',
    'قم',
    'سمنان',
    'خراسان جنوبی',
  ],
  البرز: ['تهران', 'قزوین', 'مازندران', 'مرکزی'],
  ایلام: ['خوزستان', 'لرستان', 'کرمانشاه'],
  بوشهر: ['خوزستان', 'کهگیلویه و بویراحمد', 'فارس', 'هرمزگان'],
  تهران: ['البرز', 'مازندران', 'سمنان', 'قم', 'مرکزی'],
  'چهارمحال و بختیاری': ['اصفهان', 'کهگیلویه و بویراحمد', 'خوزستان', 'لرستان'],
  'خراسان جنوبی': [
    'خراسان رضوی',
    'یزد',
    'کرمان',
    'سیستان و بلوچستان',
    'اصفهان',
    'سمنان',
  ],
  'خراسان رضوی': ['خراسان شمالی', 'خراسان جنوبی', 'سمنان', 'یزد'],
  'خراسان شمالی': ['خراسان رضوی', 'سمنان', 'گلستان'],
  خوزستان: [
    'ایلام',
    'لرستان',
    'چهارمحال و بختیاری',
    'کهگیلویه و بویراحمد',
    'بوشهر',
  ],
  زنجان: [
    'آذربایجان شرقی',
    'آذربایجان غربی',
    'اردبیل',
    'گیلان',
    'قزوین',
    'کردستان',
    'همدان',
  ],
  سمنان: [
    'تهران',
    'قم',
    'اصفهان',
    'یزد',
    'خراسان رضوی',
    'خراسان جنوبی',
    'خراسان شمالی',
    'گلستان',
    'مازندران',
  ],
  'سیستان و بلوچستان': ['خراسان جنوبی', 'کرمان', 'هرمزگان'],
  فارس: ['اصفهان', 'یزد', 'کرمان', 'هرمزگان', 'بوشهر', 'کهگیلویه و بویراحمد'],
  قزوین: ['گیلان', 'مازندران', 'البرز', 'مرکزی', 'همدان', 'زنجان'],
  قم: ['تهران', 'سمنان', 'اصفهان', 'مرکزی'],
  کردستان: ['آذربایجان غربی', 'زنجان', 'همدان', 'کرمانشاه'],
  کرمان: ['یزد', 'خراسان جنوبی', 'سیستان و بلوچستان', 'هرمزگان', 'فارس'],
  کرمانشاه: ['کردستان', 'همدان', 'لرستان', 'ایلام'],
  'کهگیلویه و بویراحمد': [
    'چهارمحال و بختیاری',
    'اصفهان',
    'فارس',
    'بوشهر',
    'خوزستان',
  ],
  گلستان: ['مازندران', 'سمنان', 'خراسان شمالی'],
  گیلان: ['اردبیل', 'زنجان', 'قزوین', 'مازندران'],
  لرستان: [
    'کرمانشاه',
    'همدان',
    'مرکزی',
    'اصفهان',
    'چهارمحال و بختیاری',
    'خوزستان',
    'ایلام',
  ],
  مازندران: ['گیلان', 'قزوین', 'البرز', 'تهران', 'سمنان', 'گلستان'],
  مرکزی: ['قزوین', 'البرز', 'تهران', 'قم', 'اصفهان', 'لرستان', 'همدان'],
  هرمزگان: ['سیستان و بلوچستان', 'کرمان', 'فارس', 'بوشهر'],
  همدان: ['کردستان', 'زنجان', 'قزوین', 'مرکزی', 'لرستان', 'کرمانشاه'],
  یزد: ['سمنان', 'خراسان رضوی', 'خراسان جنوبی', 'کرمان', 'فارس', 'اصفهان'],
}

export function calculateShippingCost(input: ShippingInput): {
  base: number
  insurance: number
  packaging: number
  oversize: number
  total: number
  currency: string
} {
  const {
    origin,
    destination,
    weightGrams,
    valueRial,
    dimensions,
    packaging = 100000,
    currency = 'تومان',
    addressType = AddressType.IRANIAN,
  } = input
  // console.log({
  //   origin,
  //   destination,
  //   weightGrams,
  //   valueRial,
  //   dimensions,
  //   packaging,
  // })

  if (addressType === AddressType.INTERNATIONAL && currency !== 'تومان') {
    return calculateInternationalShipping({
      weightGrams,
      valueRial,
      dimensions,
      packaging,
      currency,
    })
  }
  return calculateIranianShipping({
    origin,
    destination,
    weightGrams,
    valueRial,
    dimensions,
    packaging,
  })
}
function calculateIranianShipping({
  origin,
  destination,
  weightGrams,
  valueRial,
  dimensions,
  packaging,
}: {
  origin: { province: string; city: string }
  destination: { province?: string; city?: string }
  weightGrams: number
  valueRial: number
  dimensions?: { length: number; width: number; height: number }
  packaging: number
}): {
  base: number
  insurance: number
  packaging: number
  oversize: number
  total: number
  currency: string
} {
  // تعیین نوع مسیر
  let region: 'intra' | 'neighbor' | 'nonNeighbor'
  if (origin.province === destination.province) {
    region = 'intra'
  } else if (
    provinceAdjacency[origin.province]?.includes(destination.province || '')
  ) {
    region = 'neighbor'
  } else {
    region = 'nonNeighbor'
  }

  const weightKg = weightGrams / 1000

  // نرخ‌های پست پیشتاز (ریال)
  const pishtazRates = {
    intra: { halfKg: 215000, oneKg: 280000, extraKg: 105400 },
    neighbor: { halfKg: 265000, oneKg: 400000, extraKg: 90000 },
    nonNeighbor: { halfKg: 375000, oneKg: 457500, extraKg: 85000 },
  }

  let base = 0
  if (weightKg <= 0.5) base = pishtazRates[region].halfKg
  else if (weightKg <= 1) base = pishtazRates[region].oneKg
  else
    base =
      pishtazRates[region].oneKg +
      Math.ceil(weightKg - 1) * pishtazRates[region].extraKg

  // بیمه اجباری (۰.۴٪ ارزش کالا، سقف ۵۰ میلیون ریال)
  const maxCovered = 50_000_000
  const insuredValue = Math.min(valueRial, maxCovered)
  const insurance = Math.ceil((insuredValue * 0.004) / 1000) * 1000

  // اضافه هزینه ابعاد غیر استاندارد (+۲۵٪ پایه)
  let oversize = 0
  if (dimensions) {
    const { length, width, height } = dimensions
    if (length > 35 || width > 25 || height > 18) {
      oversize = Math.ceil(base * 0.25)
    }
  }

  // هزینه بسته‌بندی ثابت فروشگاه
  //   const packaging = 30000

  const totalRial = base + insurance + oversize + packaging

  const toTomanRounded = (rial: number) => Math.round(rial / 10000) * 1000

  // console.log({
  //   base,
  //   insurance,
  //   packaging,
  //   oversize,
  //   totalRial,
  // })
  return {
    base: toTomanRounded(base),
    insurance: toTomanRounded(insurance),
    packaging: toTomanRounded(packaging),
    oversize: toTomanRounded(oversize),
    total: toTomanRounded(totalRial),
    currency: 'تومان',
  }
}

// مثال: تهران → دزفول
// const result = calculateShippingCost({
//   origin: { province: 'تهران', city: 'تهران' },
//   destination: { province: 'اصفهان', city: 'اصفهان' },
//   weightGrams: 100,
//   valueRial: 2_000_000, // ۲ میلیون تومان = ۲۰,۰۰۰,۰۰۰ ریال
//   dimensions: { length: 12, width: 8, height: 2 }, // استاندارد
// })

// console.log(result)
// خروجی نمونه:
// { base: 375000, insurance: 200000, packaging: 30000, oversize: 0, total: 605000 }

const INTERNATIONAL_RATES = {
  dollar: {
    base: 50, // $50 base rate
    weightMultiplier: 5, // $5 per additional kg
    maxWeight: 10, // Max weight before additional charges
  },
  euro: {
    base: 45, // €45 base rate
    weightMultiplier: 4.5, // €4.5 per additional kg
    maxWeight: 10, // Max weight before additional charges
  },
}

function calculateInternationalShipping({
  weightGrams,
  valueRial,
  dimensions,
  packaging,
  currency,
}: {
  weightGrams: number
  valueRial: number
  dimensions?: { length: number; width: number; height: number }
  packaging: number
  currency: 'dollar' | 'euro'
}): {
  base: number
  insurance: number
  packaging: number
  oversize: number
  total: number
  currency: string
} {
  const weightKg = weightGrams / 1000
  const rates = INTERNATIONAL_RATES[currency]

  // Calculate base shipping
  let base = rates.base

  // Add weight-based charges for overweight items
  if (weightKg > 1) {
    const extraWeight = Math.min(weightKg - 1, rates.maxWeight - 1)
    base += extraWeight * rates.weightMultiplier
  }

  // For very heavy items, add additional charges
  if (weightKg > rates.maxWeight) {
    base += (weightKg - rates.maxWeight) * rates.weightMultiplier * 1.5
  }

  // Insurance (0.5% of item value, with caps based on currency)
  let insurance = 0
  if (currency === 'dollar') {
    // Convert value from Rial to USD (assuming 43,000 Rial = 1 USD)
    const valueUSD = valueRial / 43000
    const maxCovered = 500 // $500 max coverage
    const insuredValue = Math.min(valueUSD, maxCovered)
    insurance = Math.ceil(insuredValue * 0.005)
  } else if (currency === 'euro') {
    // Convert value from Rial to EUR (assuming 47,000 Rial = 1 EUR)
    const valueEUR = valueRial / 47000
    const maxCovered = 450 // €450 max coverage
    const insuredValue = Math.min(valueEUR, maxCovered)
    insurance = Math.ceil(insuredValue * 0.005)
  }

  // Oversize package handling (+20% of base)
  let oversize = 0
  if (dimensions) {
    const { length, width, height } = dimensions
    const volume = length * width * height
    // If volume exceeds 30,000 cm³ (30L), add oversize charge
    if (volume > 30000) {
      oversize = Math.ceil(base * 0.2)
    }
  }

  // Convert packaging from Rial to target currency
  let packagingFee = 0
  if (currency === 'dollar') {
    packagingFee = packaging / 43000
  } else if (currency === 'euro') {
    packagingFee = packaging / 47000
  }

  const total = base + insurance + oversize + packagingFee

  return {
    base: Math.round(base * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    packaging: Math.round(packagingFee * 100) / 100,
    oversize: Math.round(oversize * 100) / 100,
    total: Math.round(total * 100) / 100,
    currency,
  }
}
