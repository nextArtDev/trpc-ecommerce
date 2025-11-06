'use server'

import { currentUser } from '@/lib/auth'
import { Currency } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ExchangeFormSchema } from '../schemas'

interface ExchangeRateData {
  tomanToDollar: number
  tomanToEuro: number
  dollarToEuro: number
}

interface ExchangeRateResult {
  success?: boolean
  message?: string
  errors?: {
    tomanToDollar?: string[]
    tomanToEuro?: string[]
    dollarToEuro?: string[]
    _form?: string[]
  }
}

export async function createOrUpdateExchangeRates(
  data: ExchangeRateData,
  path: string
): Promise<ExchangeRateResult> {
  const result = ExchangeFormSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }
  //   console.log(result?.data)

  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    if (!user) {
      return {
        success: false,
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }
  if (
    data.tomanToDollar <= 0 ||
    data.tomanToEuro <= 0 ||
    data.dollarToEuro <= 0
  ) {
    return {
      success: false,
      message: 'نرخ‌ها باید مثبت باشند',
      errors: {
        _form: ['نرخ‌ها باید مثبت باشند'],
      },
    }
  }

  try {
    // Calculate inverse rates
    const dollarToToman = 1 / data.tomanToDollar
    const euroToToman = 1 / data.tomanToEuro
    const euroToDollar = 1 / data.dollarToEuro

    await prisma.$transaction(async (tx) => {
      // تومان به دلار
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'تومان' as Currency,
            to: 'dollar' as Currency,
          },
        },
        update: {
          rate: data.tomanToDollar,
        },
        create: {
          from: 'تومان' as Currency,
          to: 'dollar' as Currency,
          rate: data.tomanToDollar,
        },
      })

      // دلار به تومان
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'dollar' as Currency,
            to: 'تومان' as Currency,
          },
        },
        update: {
          rate: dollarToToman,
        },
        create: {
          from: 'dollar' as Currency,
          to: 'تومان' as Currency,
          rate: dollarToToman,
        },
      })

      // تومان به یورو
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'تومان' as Currency,
            to: 'euro' as Currency,
          },
        },
        update: {
          rate: data.tomanToEuro,
        },
        create: {
          from: 'تومان' as Currency,
          to: 'euro' as Currency,
          rate: data.tomanToEuro,
        },
      })

      // یورو به تومان
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'euro' as Currency,
            to: 'تومان' as Currency,
          },
        },
        update: {
          rate: euroToToman,
        },
        create: {
          from: 'euro' as Currency,
          to: 'تومان' as Currency,
          rate: euroToToman,
        },
      })

      // دلار به یورو
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'dollar' as Currency,
            to: 'euro' as Currency,
          },
        },
        update: {
          rate: data.dollarToEuro,
        },
        create: {
          from: 'dollar' as Currency,
          to: 'euro' as Currency,
          rate: data.dollarToEuro,
        },
      })

      // یورو به دلار
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'euro' as Currency,
            to: 'dollar' as Currency,
          },
        },
        update: {
          rate: euroToDollar,
        },
        create: {
          from: 'euro' as Currency,
          to: 'dollar' as Currency,
          rate: euroToDollar,
        },
      })

      // Self-reference rates
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'تومان' as Currency,
            to: 'تومان' as Currency,
          },
        },
        update: { rate: 1 },
        create: {
          from: 'تومان' as Currency,
          to: 'تومان' as Currency,
          rate: 1,
        },
      })

      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'dollar' as Currency,
            to: 'dollar' as Currency,
          },
        },
        update: { rate: 1 },
        create: {
          from: 'dollar' as Currency,
          to: 'dollar' as Currency,
          rate: 1,
        },
      })

      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'euro' as Currency,
            to: 'euro' as Currency,
          },
        },
        update: { rate: 1 },
        create: {
          from: 'euro' as Currency,
          to: 'euro' as Currency,
          rate: 1,
        },
      })
    })

    revalidatePath(path)
    revalidatePath('/', 'layout') // Revalidate entire site
    return {
      success: true,
      message: 'نرخ‌های ارز با موفقیت بروزرسانی شدند',
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
}

export async function getExchangeRates() {
  try {
    const rates = await prisma.exchangeRate.findMany({
      where: {
        OR: [
          { from: 'تومان' as Currency, to: 'dollar' as Currency },
          { from: 'تومان' as Currency, to: 'euro' as Currency },
          { from: 'dollar' as Currency, to: 'euro' as Currency },
        ],
      },
    })

    const rateMap: Record<string, number> = {}
    rates.forEach((rate) => {
      rateMap[`${rate.from}_${rate.to}`] = rate.rate
    })

    return {
      success: true,
      rates: {
        id: rateMap['id'],
        createdAt: rateMap['createdAt'],
        tomanToDollar: rateMap['تومان_dollar'] || 0.000023,
        tomanToEuro: rateMap['تومان_euro'] || 0.000021,
        dollarToEuro: rateMap['dollar_euro'] || 0.92,
      },
    }
  } catch (error) {
    console.error('Get exchange rates error:', error)
    return {
      success: false,
      rates: {
        tomanToDollar: 0.000023,
        tomanToEuro: 0.000021,
        dollarToEuro: 0.92,
      },
    }
  }
}
