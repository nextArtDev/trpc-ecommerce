'use server'

import { currentUser } from '@/lib/auth'
import { Currency } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { ExchangeFormSchema } from '../schemas'

interface ExchangeRateData {
  dollarToToman: number
  euroToToman: number
}

interface ExchangeRateResult {
  success?: boolean
  message?: string
  errors?: {
    dollarToToman?: string[]
    euroToToman?: string[]
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
      errors: {
        _form: [
          (result.error.flatten().fieldErrors as string) || 'خطایی رخ داده است',
        ],
      },
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

  if (data.dollarToToman <= 0 || data.euroToToman <= 0) {
    return {
      success: false,
      message: 'نرخ‌ها باید مثبت باشند',
      errors: {
        _form: ['نرخ‌ها باید مثبت باشند'],
      },
    }
  }

  try {
    const tomanToDollar = 1 / data.dollarToToman
    const tomanToEuro = 1 / data.euroToToman

    await prisma.$transaction(async (tx) => {
      // دلار به تومان (user input)
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'dollar' as Currency,
            to: 'تومان' as Currency,
          },
        },
        update: {
          rate: data.dollarToToman,
        },
        create: {
          from: 'dollar' as Currency,
          to: 'تومان' as Currency,
          rate: data.dollarToToman,
        },
      })

      // تومان به دلار (calculated)
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'تومان' as Currency,
            to: 'dollar' as Currency,
          },
        },
        update: {
          rate: tomanToDollar,
        },
        create: {
          from: 'تومان' as Currency,
          to: 'dollar' as Currency,
          rate: tomanToDollar,
        },
      })

      // یورو به تومان (user input)
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'euro' as Currency,
            to: 'تومان' as Currency,
          },
        },
        update: {
          rate: data.euroToToman,
        },
        create: {
          from: 'euro' as Currency,
          to: 'تومان' as Currency,
          rate: data.euroToToman,
        },
      })

      // تومان به یورو (calculated)
      await tx.exchangeRate.upsert({
        where: {
          from_to: {
            from: 'تومان' as Currency,
            to: 'euro' as Currency,
          },
        },
        update: {
          rate: tomanToEuro,
        },
        create: {
          from: 'تومان' as Currency,
          to: 'euro' as Currency,
          rate: tomanToEuro,
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
    // Get the latest exchange rates from your database
    const dollarToTomanRate = await prisma.exchangeRate.findFirst({
      where: {
        from: 'dollar',
        to: 'تومان',
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    const euroToTomanRate = await prisma.exchangeRate.findFirst({
      where: {
        from: 'euro',
        to: 'تومان',
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    if (!dollarToTomanRate || !euroToTomanRate) {
      return {
        success: false,
        message: 'Exchange rates not found',
        rates: null,
      }
    }

    return {
      success: true,
      rates: {
        dollarToToman: dollarToTomanRate.rate,
        euroToToman: euroToTomanRate.rate,
      },
    }
  } catch (error) {
    console.error('Failed to get exchange rates:', error)
    return {
      success: false,
      message: 'Failed to fetch exchange rates',
      rates: null,
    }
  }
}
