'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { currentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Review } from '@/lib/generated/prisma'
import { ReviewFormSchema } from '../schemas'
import { deleteFileFromS3 } from '@/app/(dashboard)/dashboard/lib/actions/s3Upload'

interface CreateReviewFormState {
  success?: string
  errors: {
    title?: string[]
    description?: string[]
    rating?: string[]
    _form?: string[]
  }
}

export async function createReview(
  data: unknown,
  productId: string,
  path: string
): Promise<CreateReviewFormState> {
  const result = ReviewFormSchema.safeParse(data)

  if (!result.success) {
    console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  //   console.log(result?.data)

  const user = await currentUser()
  if (!user) {
    if (!user) {
      return {
        errors: {
          _form: ['شما اجازه دسترسی ندارید!'],
        },
      }
    }
  }

  const isProductExisted = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  })
  if (!isProductExisted) {
    return {
      errors: {
        _form: ['محصول مورد نظر یافت نشد!'],
      },
    }
  }

  try {
    const isExisting = await prisma.review.findFirst({
      where: {
        // OR: [{ name: result.data.name }, { url: result.data.url }],
        AND: [
          {
            userId: user.id,
          },
          {
            productId: productId,
          },
        ],
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['شما قبلا نظر خود راجع به این محصول را ثبت کرده‌اید!'],
        },
      }
    }
    // console.log(isExisting)

    await prisma.review.create({
      data: {
        title: result.data.title,
        description: result.data.description,
        rating: result.data.rating,
        productId: productId,
        userId: user.id,
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(path)
}
interface EditReviewFormState {
  success?: string
  errors: {
    title?: string[]
    description?: string[]
    rating?: string[]
    _form?: string[]
  }
}
export async function editReview(
  data: unknown,
  reviewId: string,
  path: string
): Promise<EditReviewFormState> {
  const result = ReviewFormSchema.safeParse(data)

  // console.log(result)
  // console.log(formData.getAll('images'))

  if (!result.success) {
    // console.error(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  const user = await currentUser()

  if (!user) {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }

  if (!reviewId) {
    return {
      errors: {
        _form: ['نظر شما در دسترس نیست!'],
      },
    }
  }
  // console.log(result)

  try {
    const isExisting: Review | null = await prisma.review.findFirst({
      where: { id: reviewId },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['نظر شما حذف شده است!'],
        },
      }
    }

    // console.log(isExisting)
    // console.log(billboard)

    await prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        title: result.data.title,
        description: result.data.description,
        rating: result.data.rating,
      },
    })
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'مشکلی در سرور پیش آمده.'
    return { errors: { _form: [message] } }
  }
  revalidatePath(path)
  redirect(path)
}

//////////////////////

interface DeleteReviewFormState {
  errors: {
    // name?: string[]
    // featured?: string[]
    // url?: string[]
    images?: string[]

    _form?: string[]
  }
}

export async function deleteReview(
  path: string,
  reviewId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: DeleteReviewFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<DeleteReviewFormState> {
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
  if (!reviewId) {
    return {
      errors: {
        _form: ['فروشگاه در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Review & { images: { id: string; key: string }[] | null })
      | null = await prisma.review.findFirst({
      where: { id: reviewId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی حذف شده است!'],
        },
      }
    }

    if (isExisting.images && isExisting.images?.length > 0) {
      const oldImageKeys = isExisting.images.map((img) => img.key)

      await Promise.all(oldImageKeys.map((key) => deleteFileFromS3(key)))
      await prisma.review.delete({
        where: {
          id: reviewId,
        },
      })
    }
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
  redirect(path)
}
