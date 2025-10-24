'use server'

import { currentUser } from '@/lib/auth'
import { Review } from '@/lib/generated/prisma'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface DeleteCommentFormState {
  errors: {
    commentId?: string[]
    _form?: string[]
  }
}

export async function deleteComment(
  path: string,
  commentId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: DeleteCommentFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<DeleteCommentFormState> {
  // console.log({ path, storeId, categoryId })
  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }
  // console.log(result)
  if (!commentId) {
    return {
      errors: {
        _form: ['کامنت موجود نیست!'],
      },
    }
  }

  try {
    const isExisting: Review | null = await prisma.review.findFirst({
      where: { id: commentId },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کامنت حذف شده است!'],
        },
      }
    }

    await prisma.review.delete({
      where: {
        id: commentId,
      },
    })
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
  redirect(`/dashboard/comments`)
}
interface ShouldPublishedCommentFormState {
  errors: {
    commentId?: string[]
    _form?: string[]
  }
}

export async function shouldPublishedComment(
  path: string,
  commentId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formState: ShouldPublishedCommentFormState,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  formData: FormData
): Promise<ShouldPublishedCommentFormState> {
  // console.log({ path, storeId, categoryId })
  const user = await currentUser()
  if (!user || user.role !== 'admin') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }
  // console.log(result)
  if (!commentId) {
    return {
      errors: {
        _form: ['کامنت موجود نیست!'],
      },
    }
  }

  try {
    const isExisting: Review | null = await prisma.review.findFirst({
      where: { id: commentId },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کامنت حذف شده است!'],
        },
      }
    }

    await prisma.review.update({
      where: {
        id: commentId,
      },
      data: {
        isPending: !isExisting.isPending,
      },
    })
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
  redirect(`/dashboard/comments`)
}
