'use server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { CouponFormSchema } from '../schemas'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Coupon } from '@/lib/generated/prisma'

interface CreateCouponFormState {
  success?: string
  errors: {
    code?: string[]
    discount?: string[]
    startDate?: string[]
    endDate?: string[]

    _form?: string[]
  }
}
export async function createCoupon(
  data: unknown,
  path: string
): Promise<CreateCouponFormState> {
  const result = CouponFormSchema.safeParse(data)
  // console.log(result.data)
  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    if (!user) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }

  try {
    // Throw error if a coupon with the same code and storeId already exists
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        AND: [{ code: result.data.code }],
      },
    })

    if (existingCoupon) {
      return {
        errors: {
          _form: ['کوپن با این نام موجود است!'],
        },
      }
    }

    // Upsert coupon into the database
    await prisma.coupon.create({
      data: {
        code: result.data.code,
        discount: +result.data.discount,
        startDate: String(result.data.startDate),
        endDate: String(result.data.endDate),
      },
    })

    // return couponDetails
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }
  revalidatePath(path)
  redirect(`/dashboard/coupons`)
}

interface DeleteBillboardFormState {
  errors: {
    name?: string[]
    featured?: string[]
    url?: string[]
    images?: string[]
    _form?: string[]
  }
}

export async function deleteCoupon(
  path: string,
  couponId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: DeleteBillboardFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<DeleteBillboardFormState> {
  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    if (!user) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }
  // console.log(result)
  if (!couponId) {
    return {
      errors: {
        _form: ['کوپن در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting: Coupon | null = await prisma.coupon.findFirst({
      where: { id: couponId },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کوپن حذف شده است!'],
        },
      }
    }

    await prisma.coupon.delete({
      where: {
        id: couponId,
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(`/dashboard/coupons`)
}
